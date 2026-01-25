# Propix8 - Modern Real Estate Platform

![Propix8](https://img.shields.io/badge/Propix8-Real%20Estate-3E5879?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌟 Overview

**Propix8** is a cutting-edge real estate platform designed to provide a seamless and premium experience for users looking to buy, rent, or invest in properties. Built with modern web technologies, it features a dynamic listing system, advanced filtering, interactive maps, and a comprehensive user dashboard for managing bookings and favorites.

The application is optimized for performance and user experience, featuring smooth animations (Framer Motion) and a responsive design that works perfectly across all devices (Mobile First). It fully supports RTL (Right-to-Left) layout for Arabic content.

## 🚀 Key Features

*   **🏠 Advanced Property Search**: Filter properties by type (Sale/Rent), price range, area, city, and developer.
*   **🔐 User Authentication**: Secure login, registration, and password reset functionality using JWT.
*   **❤️ Favorites System**: innovative favorites feature allowing users to pin and manage their top property choices.
*   **📅 Booking Management**: Integrated system for booking services and viewing booking history.
*   **🗺️ Interactive Maps**: Visual property location exploration using Leaflet.
*   **📱 Fully Responsive**: Adaptive layout ensuring a consistent experience on Desktop, Tablet, and Mobile.
*   **✨ Modern UI/UX**:
    *   **Animations**: Smooth transitions using Framer Motion.
    *   **Components**: Custom-built reusable components (Hero, Navbar, Cards).
    *   **Video Integration**: React Player for video showcases.
*   **💬 Reviews & Testimonials**: User feedback system to build trust and community.

## 🛠️ Tech Stack

*   **Frontend Framework**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **State Management**: React Context API
*   **Routing**: React Router DOM v7
*   **Forms & Validation**: React Hook Form + Zod
*   **Icons**: Lucide React
*   **Animations**: Framer Motion
*   **Maps**: React Leaflet
*   **HTTP Client**: Axios

## 📂 Project Structure

```bash
propix8/
├── src/
│   ├── assets/          # Static assets (images, icons)
│   ├── components/      # Reusable UI components (Navbar, Footer, Cards)
│   ├── context/         # Global state (AuthContext, etc.)
│   ├── hooks/           # Custom React Hooks
│   ├── layouts/         # Page layouts
│   ├── pages/           # Application pages (Home, UnitsListing, PropertyDetails)
│   ├── App.jsx          # Main application component / Routes
│   └── main.jsx         # Entry point
├── public/              # Public assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/propix8.git
    cd propix8
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and configure your API endpoints (if necessary):
    ```env
    VITE_API_BASE_URL=https://propix8.com/api
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Build for Production

To create an optimized production build:

```bash
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

**Developed with ❤️ by the Fourth Pyramid Team.**
