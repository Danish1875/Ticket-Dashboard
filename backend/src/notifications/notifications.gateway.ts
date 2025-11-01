import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('NotificationsGateway');
  private activeUsers = new Map<string, Set<string>>(); // userId -> Set of socketIds

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    
    if (userId) {
      if (!this.activeUsers.has(userId)) {
        this.activeUsers.set(userId, new Set());
      }
      const sockets = this.activeUsers.get(userId);
      if (sockets) {
        sockets.add(client.id);
      }
      
      this.logger.log(`Client connected: ${client.id}, User: ${userId}`);
      this.logger.log(`Total active users: ${this.activeUsers.size}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    
    if (userId && this.activeUsers.has(userId)) {
      const sockets = this.activeUsers.get(userId);
      sockets?.delete(client.id);
      
      if ((sockets?.size ?? 0) === 0) {
        this.activeUsers.delete(userId);
      }
      
      this.logger.log(`Client disconnected: ${client.id}, User: ${userId}`);
      this.logger.log(`Total active users: ${this.activeUsers.size}`);
    }
  }

  @SubscribeMessage('join-project')
  handleJoinProject(client: Socket, projectId: string) {
    client.join(`project:${projectId}`);
    this.logger.log(`Client ${client.id} joined project ${projectId}`);
  }

  @SubscribeMessage('leave-project')
  handleLeaveProject(client: Socket, projectId: string) {
    client.leave(`project:${projectId}`);
    this.logger.log(`Client ${client.id} left project ${projectId}`);
  }

  // Emit events to all users in a project
  emitToProject(projectId: string, event: string, data: any) {
    this.server.to(`project:${projectId}`).emit(event, data);
    this.logger.log(`Emitted ${event} to project ${projectId}`);
  }

  // Emit events to all connected clients
  emitToAll(event: string, data: any) {
    this.server.emit(event, data);
    this.logger.log(`Emitted ${event} to all clients`);
  }

  // Check if user is active
  isUserActive(userId: string): boolean {
    return (this.activeUsers.get(userId)?.size ?? 0) > 0;
  }

  // Get all active user IDs
  getActiveUsers(): string[] {
    return Array.from(this.activeUsers.keys());
  }
}