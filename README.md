# 🎯 TicketFlow - Project Management Dashboard

A modern, real-time project management dashboard built with **Next.js**, **NestJS**, and **TypeScript**. Inspired by Trello and Jira, TicketFlow provides seamless ticket management with email-based authentication and super-user controls.

![TicketFlow Dashboard](https://img.shields.io/badge/Status-In%20Development-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### 🔐 Authentication
- **Email-based OTP Login** - Passwordless authentication system
- JWT token management for secure sessions
- Mock email service (OTP logged to console for demo)

### 📊 Project Management
- **Create & Manage Projects** - Organize work into distinct projects
- **Project Dashboard** - Overview of all projects with statistics
- **Project Details** - Deep dive into individual projects

### 🎫 Ticket System
- **Kanban Board** - Visual workflow with 5 status columns:
  - 🟣 **Proposed** - New ideas and requests
  - 🔵 **To Do** - Ready to start
  - 🟡 **In Progress** - Currently being worked on
  - 🟢 **Done** - Completed tasks
  - 🌸 **Deployed** - Live in production
- **Drag & Drop** - Move tickets between columns seamlessly
- **Ticket Creation** - Quick ticket creation with status selection
- **Ticket Details** - Title, description, creator, and timestamps

### 👑 Super User Mode
- **Password-Protected Toggle** - Secure access control
- **Creator Information** - View who created and last updated tickets
- **Audit Trail** - Track changes and modifications

### 🔔 Notifications (Upcoming)
- Real-time activity feed
- Email notifications for offline users
- WebSocket-based instant updates

---

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client (ready for integration)
- **Icons**: Lucide React
- **Date Handling**: date-fns

#### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: SQLite with TypeORM
- **Authentication**: JWT + Passport
- **Real-time**: Socket.io (ready for integration)
- **Validation**: class-validator

### Design Patterns

1. **Repository Pattern** - Clean data access layer with TypeORM
2. **Strategy Pattern** - Notification delivery system (real-time vs email)
3. **Factory Pattern** - Ticket and notification creation
4. **Observer Pattern** - WebSocket event handling
5. **Middleware Pattern** - Authentication and validation

---

## 🗄️ Database Design

### Why SQLite?

We chose **SQLite** over NoSQL for several key reasons:

#### ✅ Advantages
- **Relational Structure**: Projects → Tickets → Users have clear relationships
- **ACID Compliance**: Ensures data integrity during ticket moves
- **Foreign Keys**: Maintains referential integrity
- **Complex Queries**: Easy to query "all tickets created by user X"
- **Zero Configuration**: File-based, perfect for demos and development
- **Transactions**: Safe concurrent updates

### Getting Started
- Node.js 18+
- npm
- Git
