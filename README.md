# 🚀 AI-Powered Study Tracker

✨ A full-stack productivity app that helps students track study sessions, stay consistent, and improve performance using AI insights.

---

## 🌟 Features

### 📊 Dashboard
- Track daily study sessions
- View subject-wise progress
- Clean SaaS-style UI

### 🧠 AI Smart Planner
- Generate study insights using AI
- Suggests weekly improvement plan

### 📅 Smart Calendar
- ✔ Marks completed days (Green)
- ✖ Marks missed days (Red)
- Visual learning consistency tracker

### 🔥 Streak System
- Current streak
- Maximum streak
- Year-wise tracking

### 🏆 Gamification
- Beginner → Pro → Master badges
- Motivates consistent learning

### 🔐 Authentication
- Secure login/register system
- JWT-based authentication

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React (Vite)
- 🎨 Tailwind CSS
- 📊 Recharts
- 📅 React Calendar

### Backend
- 🟢 Node.js
- 🚀 Express.js
- 🍃 MongoDB

### AI
- 🤖 OpenRouter (Mistral model)

---


## 📂 Project Structure
study-tracker/
│
├── client/ # React frontend
├── server/ # Node backend
├── .gitignore
└── README.md


---

## ⚙️ Installation

### 1️⃣ Clone Repository

git clone https://github.com/Lohith-004/MindStreak
cd Study-Tracker

### 2️⃣ Setup Backend

cd server
npm install

Create .env file:

MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
OPENROUTER_API_KEY=your_key

Run server:

node server.js

### 3️⃣ Setup Frontend

cd client
npm install
npm run dev


---

## 🌐 Deployment

| Service   | Platform        |
|----------|----------------|
| Frontend | Vercel         |
| Backend  | Render         |
| Database | MongoDB Atlas  |

---

## 🔗 API Endpoints

| Method | Endpoint                     | Description       |
|--------|----------------------------|-------------------|
| POST   | /api/auth/register         | Register user     |
| POST   | /api/auth/login            | Login user        |
| GET    | /api/study                 | Get sessions      |
| POST   | /api/study/add             | Add session       |
| PUT    | /api/study/toggle/:id      | Mark complete     |
| GET    | /api/study/streak-details  | Streak data       |
| GET    | /api/ai/insights           | AI planner        |

---

## 🧠 How It Works

1. User logs in → receives JWT token  
2. Frontend sends API requests using Axios  
3. Backend validates user & stores data in MongoDB  
4. AI analyzes study data → returns insights  
5. UI updates dynamically  

---

## 🎯 Future Improvements

- 📊 Advanced analytics charts  
- 🔔 Study reminders  
- 📱 Mobile responsive UI  
- 🌍 Social sharing  

---

## 👨‍💻 Author

**Lohith Gowda C P**

---

## ⭐ Support

If you like this project:

👉 Give it a ⭐ on GitHub  
👉 Share with friends  

---

## 🌐 Live Demo

 https://mind-streak.vercel.app

---

🔥 *This project demonstrates full-stack development, API integration, and real-world product design.*
