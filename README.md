# ⏰ AssignMate – Smart Task Reminder System

🌐 **Live Demo:** https://assign-mate-one.vercel.app/home  
💻 **GitHub:** https://github.com/kundan-kumar07/AssignMate  

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Cron](https://img.shields.io/badge/Scheduler-Node--Cron-orange)
![Email](https://img.shields.io/badge/Email-Brevo-blueviolet)
![Clerkl](https://img.shields.io/badge/Auth-Clerk-white)

---

## 📌 About

**AssignMate** is a full-stack task management and reminder system that not only stores tasks but actively reminds users before deadlines using automated email notifications.

It acts like a **personal assistant**, helping users stay productive and never miss important work.

---

## ✨ Features

### ⏰ Smart Reminder System
- Sends reminder **10 minutes before deadline**
- Automated email notifications
- Built using **Node-Cron**

---

### 🌅 Daily Summary
- Sends all tasks at **9 AM**
- Helps plan the day efficiently

---

### 🌆 Overdue Alerts
- Sends overdue tasks at **6:30 PM**
- Keeps users accountable

---

### 📋 Task Management
- Add tasks with date & time  
- Mark tasks as completed  
- Delete tasks  
- Real-time UI updates  

---

### 📊 Status Tracking
- Upcoming  
- Due Today  
- Overdue  

---

### 📧 Email Notifications
- Clean & aesthetic email design  
- Includes task details  
- Direct link to open app  

---

### 📱 Responsive UI
- Works on mobile and desktop  

---

## 🛠️ Tech Stack

### Frontend
- React  
- Tailwind CSS  
- Axios  
- Clerk (Authentication)  

### Backend
- Node.js  
- Express.js  
- MongoDB  
- Mongoose  

### Scheduling
- Node-Cron  

### Email Service
- Brevo (SMTP API)  

---

## ⚡ Installation

### 1. Clone the repository

```bash
git clone https://github.com/kundan-kumar07/AssignMate.git
cd AssignMate
```

---

### 2. Install dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd server
npm install
```

---

### 3. Run the project

#### Start Backend

```bash
npm run dev
```

#### Start Frontend

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create `.env` files in both **client** and **server** directories.

---

## Server `.env`

```env
MONGODB_URI=your_mongodb_connection_string

BREVO_API_KEY=your_brevo_api_key
EMAIL=your_verified_email

NODE_ENV=development
```

---

## Client `.env`

```env
VITE_API=https://your-backend-url
VITE_CLERK_PUBLISHABLE_KEY=pk_test_yours_publishable_key
```

---
## 🧠 What I Learned

- Real-world reminder system design  
- Scheduling jobs using cron  
- Handling date & time logic  
- Email automation  
- Full-stack integration  

---

## 🚀 Future Improvements

- Daily recurring tasks  
- Weekly reminders  
- Push notifications  
- Task categories & priorities  

# 👨‍💻 Author

**Kundan Kumar Dubey**

GitHub:  
https://github.com/kundan-kumar07
