# IET CONNECT - Institution of Engineering & Technology Portal 🚀

[![Vite](https://img.shields.io/badge/Vite-6.4.3-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express)](https://expressjs.com/)

A modern, high-performance web portal built for the **Institution of Engineering and Technology (IET) Student Chapter**. It empowers engineering students and tech innovators to collaborate on projects, participate in hackathons, share learning resources, explore career opportunities, and manage chapter activities.

---

## ✨ Features Overview

### 🎨 1. Modern Glassmorphic UI & Dark Mode System
- **Class-Based Light/Dark Mode**: Smooth theme toggling with sliding pill controls in Navbar, Sidebar, and Auth cards. Built for Tailwind CSS v4.
- **Responsive Layout**: Sidebar navigation, mobile hamburger drawer, and clean responsive containers.
- **Interactive Auth Page**: Futuristic glassmorphism sign-in and registration forms with phone number format validation.

### 🛠️ 2. Full CRUD Operations Across All Modules (Task 2)
- **📅 Events & Workshops**: Create, view, update, delete, and RSVP for events (with capacity limits).
- **🚀 Member Projects**: Submit, star/upvote, edit, delete, and showcase engineering projects.
- **💼 Career Opportunities**: Post, edit, delete, and apply for research fellowships, internships, and hackathon grants.
- **📚 Learning Resources**: Share e-books, course links, toolkits, and documentation.
- **📢 Chapter Notices & Announcements**: Post, pin, and delete official circulars and notices.
- **👥 Member Directory**: Explore profiles, skills, institutions, and contact details.

### 🛡️ 3. Admin & User Roles (Task 2)
- **Admin Control Panel** (`AdminView.tsx`):
  - Accessible to `admin` / `lead` roles (e.g., `venkatns2008@gmail.com`).
  - **Role Management**: Promote members to Chapter Lead/Admin or demote to Member.
  - **Account Management**: Remove inactive or violating user accounts.
  - **Content Moderation**: Instantly delete any inappropriate projects, events, or resources.

### 🔎 4. Multi-Category Instant Search Overlay (Task 2)
- **Global Search Bar**: Instant search dropdown in the Navbar searching across **Projects**, **Events**, **Opportunities**, **Resources**, and **Members** simultaneously with real-time field matching.

### 📜 5. User Activity Audit Trail (Task 2)
- **Audit System** (`ActivityLogView.tsx`):
  - Tracks user actions (`LOGIN`, `REGISTER`, `CREATE_PROJECT`, `UPDATE_PROJECT`, `DELETE_PROJECT`, `RSVP_EVENT`, `ADMIN_CHANGE_ROLE`, etc.).
  - Searchable audit logs with category filtering and timestamp records for chapter compliance.

### 🔔 6. Notification Panel & Duplicate Alerts (Task 3)
- **Interactive Notification Panel** (`NotificationPanel.tsx`):
  - Slide-over drawer panel triggered from the Navbar Bell button with a live pulsing unread badge counter.
  - *All / Unread* filter tabs, *Mark All as Read*, and individual read toggles.
- **Duplicate Registration Alerts**:
  - 🛑 **Duplicate Account Registration**: Displays a red warning banner on the sign-up form if an email already exists, with a quick "Sign In instead" action button.
  - ⚠️ **Duplicate Event RSVP**: Displays a dedicated modal dialog and notification warning if a user attempts to RSVP for an event they already joined.

### ⚡ 7. Vercel & Static Host Resilience
- **Embedded Fallback Engine** (`fallbackData.ts`):
  - Ensures the portal, search bar, directory, and views run **100% reliably** on static deployments (Vercel, Netlify, GitHub Pages) even without a live background Node.js process.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS v4, Lucide React Icons
- **Build Tool**: Vite 6, ESBuild
- **Backend API**: Node.js, Express 4, REST APIs
- **Database & Storage**: JSON file store (`data/db.json`) with embedded fallback dataset

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (comes with Node.js)

### Installation & Running

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Code-Provenance-main.git
   cd Code-Provenance-main