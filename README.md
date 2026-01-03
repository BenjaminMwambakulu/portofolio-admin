# Portfolio Admin Dashboard
A comprehensive admin panel built with React, Vite, Tailwind CSS, and Firebase to manage your personal portfolio content. This dashboard allows you to track analytics, manage projects, skills, and view recent activities.

## 🚀 Features

- **Auth System**: Secure login/signup using Firebase Authentication.
- **Analytics Dashboard**: 
    - Real-time "Profile Views" tracking.
    - "Projects Completed" and "Total Skills" counters.
    - Activity Feed logging user actions (e.g., "Updated Projects Section").
    - Performance Chart (currently visualized with Chart.js).
- **Profile Management**: Automatically creates and syncs user profiles in Firestore users upon login.
- **Content Management Services**:
    - **Projects**: Add, update, and manage portfolio projects.
    - **Skills**: Manage technical skills.
    - **Hero/About/Contact/Documents**: Edit other sections of the portfolio.
- **Real-time Updates**: Data updates reflect instantly using Firestore.

## 🛠 Tech Stack

- **Frontend Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4
- **Database & Auth**: Firebase (Firestore, Authentication)
- **Charts**: Chart.js & react-chartjs-2
- **Icons**: React Icons

## 📂 Project Structure

```
src/
├── Config/            # Firebase configuration
├── Pages/             # Application pages (Dashboard, Login, etc.)
│   ├── Auth/          # Auth related pages
│   └── Dashboard.jsx  # Main Dashboard View
├── Services/          # Service layer for Firestore interactions
│   ├── ActivityService.js       # Logging & fetching activities
│   ├── DashboardService.js      # Aggregating dashboard stats
│   ├── ProjectsSectionService.js# CRUD for Projects
│   ├── ProfileService.js        # User profile management
│   └── ...                      # Other section services
├── App.jsx            # Main app component & routing
└── main.jsx           # Entry point
```

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portofolio-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📊 Dashboard Overview

The dashboard provides a quick snapshot of your portfolio's health:
- **Top Stats Cards**: Show key metrics like View Count & Project Count.
- **Interactive Chart**: Visualizes performance trends (currently using sample data for demonstration).
- **Recent Activity**: A timeline of your latest admin actions (e.g., adding a new skill).

## 🔒 Security

- Firebase Security Rules should be configured to allow only authenticated users to write to `Sections` and `Profile` collections.
- `stats/portfolio` is generally readable by the public (for the portfolio site) but writable only by the admin/system.

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
