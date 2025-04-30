# 🌟 Creative Coding Showcase Platform

An interactive web-based platform for showcasing creative projects built by students in the **"Creative Coding Using Python"** course. The platform allows students to upload their animations, games, websites, documentaries, and digital art, while aligning their work with the **Sustainable Development Goals (SDGs)**.

This initiative promotes creativity, sustainability, collaboration, and real-world impact.

---

## 🎯 Objective

To provide a centralized platform where:

- 👩‍🎓 Students can showcase creative coding projects and build a personal portfolio.
- 🌱 Projects are mapped to relevant **SDGs**.
- 🧑‍🏫 Faculty can mentor and track progress.
- 🌐 Viewers (public, employers, industry experts) can explore, give feedback, and connect.
- 🏛️ Admins & management can oversee and analyze contributions institutionally.

---

## 👥 User Roles & Features

### 🧑‍💻 Viewers (Public / Employers / Experts)

- Browse categorized projects (Games, Animations, Websites, etc.)
- View project details, media, SDG mapping
- Filter/search by SDG, category, rating
- Leave feedback, rate projects
- View leaderboard, contact student teams

### 👩‍🎓 Student Teams

- Upload & manage projects with media, descriptions, and GitHub links
- Map projects to SDGs
- Build personal portfolios
- View feedback & leaderboard participation

### 👨‍🏫 Faculty Coordinators

- Review projects and SDG mappings
- Provide feedback and mentorship
- Monitor project progress

### 🛡️ Admins

- Moderate content & approve submissions
- Manage users and platform structure
- Handle leaderboard logic and platform-wide notifications
- Generate analytics and impact reports

### 🏛️ Management

- Analyze institutional engagement and SDG contribution
- Evaluate educational impact
- View performance reports and external engagement metrics

---

## 🔧 Features Summary

| Feature                    | Description                                                            |
| -------------------------- | ---------------------------------------------------------------------- |
| 🧠 SDG Mapping             | Projects linked with SDGs like Climate Action, Quality Education, etc. |
| 🔍 Search & Filters        | Find projects by SDG, type, rating                                     |
| 💬 Feedback & Ratings      | Ratings + comments from public, faculty                                |
| 🏆 Leaderboard             | Rank projects by engagement, creativity, feedback                      |
| 🤝 Mentorship & Networking | Direct messaging and mentor requests                                   |
| 🔔 Real-Time Notifications | For ratings, feedback, deadlines, announcements                        |
| 🔐 Role-Based Access       | JWT Auth to secure data and restrict role-based actions                |

---

## 🧑‍💻 Tech Stack

### 🔗 Frontend

- **React.js (with Vite)** – Fast, modern UI
- **TailwindCSS** – For sleek and responsive styling

### ⚙️ Backend

- **Django REST Framework** – Robust API handling
- **JWT Authentication** – Role-based access with JSON Web Tokens

### ☁️ Deployment

- **Hosted on Vercel** for the frontend deployment

---

## 🚀 How to Run the Project

### 📦 Backend (Django)
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the server:
   ```bash
   python manage.py runserver
   ```

### 🌐 Frontend (React + Vite)
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

Make sure the backend is running before starting the frontend for full functionality.

---

## 📽️ Project Links

- 🎥 **Demo Video**: [Watch the demo](https://www.loom.com/share/e91132917ae84c859ba3b64e55b366c1?sid=76af2063-0025-4c3e-b246-39782e46a40d)
- 📊 **Canva Presentation**: [View the presentation](https://www.canva.com/design/DAGmHI8z714/C1SKJhYdYZG2EuZS7oyrBQ/edit?utm_content=DAGmHI8z714&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

