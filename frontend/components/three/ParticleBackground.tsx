"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create constellation nodes
    const nodeCount = 100;
    const nodes: {
      position: THREE.Vector3;
      basePosition: THREE.Vector3;
      mesh: THREE.Mesh;
      connections: number[];
      rippleStrength: number;
      baseOpacity: number;
      baseScale: number;
    }[] = [];

    const nodeGeometry = new THREE.SphereGeometry(0.15, 16, 16);


    // Create nodes in an evenly distributed grid pattern
    const gridCols = 12;
    const gridRows = 8;
    const spacing = 6.5;

    for (let i = 0; i < nodeCount; i++) {
      // Grid-based positioning with random offset
      const col = i % gridCols;
      const row = Math.floor(i / gridCols);

      const x = (col - gridCols / 2) * spacing + (Math.random() - 0.5) * 2;
      const y = (row - gridRows / 2) * spacing + (Math.random() - 0.5) * 2;
      const z = (Math.random() - 0.5) * 15;

      const position = new THREE.Vector3(x, y, z);

      // Subtle purple variations
      const hue = 0.75 + Math.random() * 0.08;
      const saturation = 0.35 + Math.random() * 0.15;
      const lightness = 0.55 + Math.random() * 0.25;

      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue, saturation, lightness),
        transparent: true,
        opacity: 0.4,
      });

      const mesh = new THREE.Mesh(nodeGeometry, material);
      mesh.position.copy(position);
      scene.add(mesh);

      nodes.push({
        position: position.clone(),
        basePosition: position.clone(),
        mesh,
        connections: [],
        rippleStrength: 0,
        baseOpacity: 0.4 + Math.random() * 0.2,
        baseScale: 1,
      });
    }

    // Create mesh topology connections
    const connectionLines: {
      line: THREE.Line;
      nodeA: number;
      nodeB: number;
      baseOpacity: number;
    }[] = [];

    const maxConnectionDistance = 10;

    for (let i = 0; i < nodes.length; i++) {
      // Find nearest neighbors for mesh topology
      const distances: { index: number; distance: number }[] = [];

      for (let j = 0; j < nodes.length; j++) {
        if (i !== j) {
          const distance = nodes[i].position.distanceTo(nodes[j].position);
          if (distance < maxConnectionDistance) {
            distances.push({ index: j, distance });
          }
        }
      }

      // Sort by distance and connect to nearest 3-5 nodes
      distances.sort((a, b) => a.distance - b.distance);
      const connectCount = Math.min(
        3 + Math.floor(Math.random() * 3),
        distances.length
      );

      for (let k = 0; k < connectCount; k++) {
        const j = distances[k].index;

        // Avoid duplicate connections
        if (i < j) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            nodes[i].position,
            nodes[j].position,
          ]);

          const material = new THREE.LineBasicMaterial({
            color: 0x9333ea,
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending,
          });

          const line = new THREE.Line(geometry, material);
          scene.add(line);

          nodes[i].connections.push(j);
          nodes[j].connections.push(i);

          connectionLines.push({
            line,
            nodeA: i,
            nodeB: j,
            baseOpacity: 0.12,
          });
        }
      }
    }

    // Ambient glow particles
    const glowGeometry = new THREE.BufferGeometry();
    const glowCount = 150;
    const glowPositions = new Float32Array(glowCount * 3);
    const glowColors = new Float32Array(glowCount * 3);

    for (let i = 0; i < glowCount; i++) {
      glowPositions[i * 3] = (Math.random() - 0.5) * 80;
      glowPositions[i * 3 + 1] = (Math.random() - 0.5) * 55;
      glowPositions[i * 3 + 2] = (Math.random() - 0.5) * 25;

      const hue = 0.75 + Math.random() * 0.08;
      const color = new THREE.Color().setHSL(hue, 0.4, 0.65);
      glowColors[i * 3] = color.r;
      glowColors[i * 3 + 1] = color.g;
      glowColors[i * 3 + 2] = color.b;
    }

    glowGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(glowPositions, 3)
    );
    glowGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(glowColors, 3)
    );

    const glowMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const glowParticles = new THREE.Points(glowGeometry, glowMaterial);
    scene.add(glowParticles);

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Raycasting to detect hover
      raycaster.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycaster.current.intersectObjects(
        nodes.map((n) => n.mesh)
      );

      // Reset all ripples first
      nodes.forEach((node) => {
        node.rippleStrength *= 0.85; // Decay
      });

      // Apply ripple to hovered node and neighbors
      if (intersects.length > 0) {
        const hoveredMesh = intersects[0].object;
        const nodeIndex = nodes.findIndex((n) => n.mesh === hoveredMesh);

        if (nodeIndex !== -1) {
          // Direct hit - strongest ripple
          nodes[nodeIndex].rippleStrength = 1;

          // Propagate to connected nodes (1 level)
          nodes[nodeIndex].connections.forEach((connectedIndex) => {
            nodes[connectedIndex].rippleStrength = Math.max(
              nodes[connectedIndex].rippleStrength,
              0.6
            );

            // Second level (weaker)
            nodes[connectedIndex].connections.forEach((secondLevelIndex) => {
              if (secondLevelIndex !== nodeIndex) {
                nodes[secondLevelIndex].rippleStrength = Math.max(
                  nodes[secondLevelIndex].rippleStrength,
                  0.3
                );
              }
            });
          });
        }
      }
    };

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Animation loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animate nodes
      nodes.forEach((node, index) => {
        // Gentle floating
        node.position.x =
          node.basePosition.x + Math.sin(elapsedTime * 0.3 + index * 0.1) * 0.3;
        node.position.y =
          node.basePosition.y +
          Math.cos(elapsedTime * 0.25 + index * 0.15) * 0.25;
        node.mesh.position.copy(node.position);

        // Apply ripple effect
        const ripple = node.rippleStrength;
        const material = node.mesh.material as THREE.MeshBasicMaterial;

        // Brightness boost on hover
        const targetOpacity = node.baseOpacity + ripple * 0.5;
        material.opacity += (targetOpacity - material.opacity) * 0.25;

        // Scale pulse on hover
        const targetScale = 1 + ripple * 0.8;
        node.baseScale += (targetScale - node.baseScale) * 0.25;
        node.mesh.scale.setScalar(node.baseScale);

        // Color shift to brighter on hover
        const hue = 0.75 + ripple * 0.05;
        const saturation = 0.4 + ripple * 0.3;
        const lightness = 0.7 + ripple * 0.4;
        material.color.setHSL(hue, saturation, lightness);
      });

      // Update connection lines
      connectionLines.forEach(({ line, nodeA, nodeB }) => {
        const positions = line.geometry.attributes.position
          .array as Float32Array;

        positions[0] = nodes[nodeA].position.x;
        positions[1] = nodes[nodeA].position.y;
        positions[2] = nodes[nodeA].position.z;
        positions[3] = nodes[nodeB].position.x;
        positions[4] = nodes[nodeB].position.y;
        positions[5] = nodes[nodeB].position.z;

        line.geometry.attributes.position.needsUpdate = true;

        // Line brightness based on connected nodes' ripple
        const rippleA = nodes[nodeA].rippleStrength;
        const rippleB = nodes[nodeB].rippleStrength;
        const maxRipple = Math.max(rippleA, rippleB);

        const material = line.material as THREE.LineBasicMaterial;
        const targetOpacity = 0.12 + maxRipple * 0.4;
        material.opacity += (targetOpacity - material.opacity) * 0.3;
      });

      // Slow glow drift
      const glowPositions = glowParticles.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < glowCount; i++) {
        glowPositions[i * 3 + 1] += Math.sin(elapsedTime * 0.4 + i) * 0.003;
      }
      glowParticles.geometry.attributes.position.needsUpdate = true;
      glowParticles.rotation.z = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      nodeGeometry.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();

      nodes.forEach((node) => {
        node.mesh.geometry.dispose();
        (node.mesh.material as THREE.Material).dispose();
      });

      connectionLines.forEach(({ line }) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });

      renderer.dispose();

      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{
        background:
          "linear-gradient(to bottom right, #0f0b1f 0%, #1a0b2e 50%, #0f0b1f 100%)",
        cursor: "pointer",
      }}
    />
  );
}
