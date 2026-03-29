# 🛒 Flipkart Clone – Full Stack E-Commerce Application

## 🚀 Live Demo
- 🌐 Frontend: https://flipkart-clone-2mxk.vercel.app/  
- ⚙️ Backend: (API not available Publically)

---

## 📌 Project Overview

This is a **modern full-stack eCommerce web application** inspired by Flipkart.  
It provides a complete shopping experience including product browsing, cart management, checkout, and order placement.

---

## ✨ Features

- 🔍 Product Search & Filtering  
- 🛒 Add to Cart / Remove / Update Quantity  
- 💳 Multi-Step Checkout System  
- 📦 Order Placement & Tracking  
- 🌙 Dark / Light Mode  
- 📱 Fully Responsive Design  
- ⚡ Fast Performance with SSR (Next.js)

---

## 🧠 Tech Stack

### Frontend
- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion
- Axios

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL (Supabase)
- Sequelize ORM

---

## 📂 Folder Structure

### Frontend

frontend/
- ├── src/
- │ ├── app/
- ├── components/
- │ ├── context/
- │ └── lib/


### Backend

backend/
- ├── src/
- │ ├── config/
- │ ├── controllers/
- │ ├── models/
- │ ├── routes/
- │ └── server.js

- 
---

## 🔗 API Endpoints

### Products
- `GET /products`
- `GET /products/:id`

### Cart
- `GET /cart`
- `POST /cart/add`
- `PUT /cart/update`
- `DELETE /cart/remove`

### Orders
- `POST /orders`
- `GET /orders/:id`

---

## 🔄 Data Flow

User → Frontend → API → Backend → Database → Backend → Frontend → UI Update

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo

2️⃣setUp backend
cd backend
npm install

#Create .env file:
PORT=5001
DB_URI=your_database_url

#Run backend:
npm start

3️⃣ Setup Frontend
cd frontend
npm install

# Create .env
NEXT_PUBLIC_API_URL=http://localhost:5001

Run frontend
npm run dev

```

### 🌍 Deployment
- Frontend → Vercel
- Backend → Render / Railway
- Database → Supabase

### 🧩 Architecture
- MVC Pattern (Backend)
- Context API (State Management)
- Axios (API Handling)
- Server & Client Components (Next.js)

### 🎯 Unique Features
- Smooth animations using Framer Motion
- Dark/Light theme support
- Clean UI inspired by Flipkart
- Scalable project structure

📸 Screenshots

Example:
- Dark Theme
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/f7e7f5f8-e17c-435d-a22a-05203b4d2cdb" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/0d378f40-e68d-41e4-96bd-a4f010890219" />
<img width="1919" height="961" alt="image" src="https://github.com/user-attachments/assets/1bb0e9f3-06a3-4279-a042-01a6f6b19efa" />

- Light Theme
- <img width="940" height="966" alt="image" src="https://github.com/user-attachments/assets/b5c6d8a0-f148-4199-94c1-641d6f164e09" />
- <img width="926" height="912" alt="image" src="https://github.com/user-attachments/assets/601e2888-048f-4182-9838-e728a420d830" />
<img width="936" height="958" alt="image" src="https://github.com/user-attachments/assets/96082c7d-5127-43a5-b2e3-41703732f5d7" />


### 👨‍💻 Author

- Himanshu Sharma

### ⭐ Support

- If you like this project:

### ⭐ Star the repo
🍴 Fork it

