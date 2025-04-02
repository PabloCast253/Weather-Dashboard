# Weather-Dashboard# 

A full-stack weather dashboard that allows users to search for a city and view the current and 5-day forecast using data from the [OpenWeather API](https://openweathermap.org/api). Built with TypeScript, Express, Vite, and deployed on Render.

## 🚀 Features

- 🔍 Search for any city and view:
  - Current weather conditions
  - 5-day forecast (daily at 12:00 PM)
- 💾 Search history is stored and displayed
- 🧹 Option to delete cities from search history
- 🌐 Fully deployed on Render
- ⚡ Built with Vite for fast frontend development

## 🛠️ Tech Stack

- **Frontend**: TypeScript, Vite, HTML, CSS
- **Backend**: Express.js (TypeScript)
- **API**: [OpenWeather API](https://openweathermap.org/api)
- **Data Storage**: `searchHistory.json` (file-based persistence)
- **Dev Tools**: Nodemon, concurrently, wait-on, fs module
- **Deployment**: [Render](https://render.com)

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/weather-dashboard.git
cd weather-dashboard
npm install
npm run build
npm run start:dev
