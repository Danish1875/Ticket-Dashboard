# 📝 Ticket Dashboard

## Overview

This project is a mini project management dashboard, inspired by tools like Trello and Atlassian, designed to manage projects and track tickets efficiently. It features real-time updates , email-based authentication, and a powerful super-user toggle for enhanced control and visibility.

## Key Features

The application is built to fulfill the following core requirements:

**Email-Based Authentication:** Secure, passwordless login using a One-Time Password (OTP) sent to the user's email. Successful login grants access to the ticket dashboard page.
**Projects & Tickets:** The dashboard lists all projects. Users can create a new project if none exist. Each project can have multiple tickets with descriptions.
**Real-time Updates:** Ticket movements must instantly reflect for other viewing users.
**Super-User Controls:** A password-protected toggle allows authorized users to display (ON) who created/updated tickets, or hide (OFF) this user info.
    **Activity Feed:** All ticket updates are shown instantly in the notifications for active users.
    **Email Alerts:** Updates are sent via email to team members who visited earlier but are currently offline.

---

## 🛠️ Tech Stack & Architecture Decisions

This project uses a modern, full-stack TypeScript approach to ensure scalability and maintainability.

### Frontend 💻
**Framework:** NextJS
**Language:** Typescript
**Styling:** Tailwind CSS
**State Management:** Zustand

### Backend ⚙️
**Framework:** NestJS
**Language:** Typescript
**Database:** SQLite


---

## 🚀 Getting Started (Work in Progress)

### Prerequisites
* Node.js (LTS version)
* *\[Any specific database server/service]*

### Installation
1.  **Clone the repository:**
    ```bash
    git clone [Your-Repo-Link-Here]
    cd ticket-dashboard
    ```
2.  **Setup Backend:** (Located in the `backend/` directory)
    ```bash
    cd backend
    npm install
    # Instructions for running the NestJS service will go here
    ```
3.  **Setup Frontend:** (Located in the `frontend/` directory)
    ```bash
    cd ../frontend
    npm install
    # Instructions for running the Next.js service will go here
    ```

---

### Focused Areas:
**Backend:** Logic, notifications handling, super-admin toggle implementation, and database usage justification.
**Frontend:** Architecture, state management, and conditional rendering based on the super-user toggle.
**Code Quality:** Clean, modular, reusable code with proper naming conventions and folder structure.
