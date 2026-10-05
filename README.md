# 🚀 Mission Control Dashboard

A space-themed **Mission Control Dashboard** built with **React.js** to demonstrate real-time data handling, API integration, dynamic UI updates, and interactive spacecraft monitoring.

The dashboard combines live ISS location data with simulated spacecraft telemetry to create a realistic mission-monitoring interface.

## 🌐 Live Demo

**Mission Control Dashboard:**
[https://rudras52.github.io/mission-control-dashboard/](https://rudras52.github.io/mission-control-dashboard/)

## 📂 GitHub Repository

[https://github.com/RudraS52/mission-control-dashboard](https://github.com/RudraS52/mission-control-dashboard)

---

## ✨ Features

### 🛰️ Live ISS Position

* Fetches live International Space Station latitude and longitude.
* ISS position is refreshed automatically every 10 seconds.
* Displays latitude and longitude with four-decimal precision.
* Shows a `● LIVE` indicator when the API connection is active.

### 🧭 ISS Movement Direction

The dashboard compares consecutive ISS coordinates to calculate a simplified movement direction.

Example:

```text
Previous Position
Latitude:  -11.08
Longitude: -134.53

Current Position
Latitude:  -10.53
Longitude: -134.12

Latitude increased  → North
Longitude increased → East

Direction → NE
```

The previous coordinates are stored using React's `useRef`, allowing the application to remember the previous API reading without triggering an additional render.

> Note: The direction calculation is a simplified visualization based on latitude/longitude changes and is not intended to represent navigation-grade spacecraft heading.

### 🌍 Orbital Visualization

* Displays Earth using a custom image asset.
* Displays an ISS spacecraft image on the orbital ring.
* ISS position changes dynamically based on live longitude data.
* Uses trigonometric calculations to convert longitude into a visual orbital position.

### 📡 Telemetry Monitoring

The dashboard displays simulated spacecraft telemetry including:

* Altitude
* Velocity
* Temperature
* Battery level

Telemetry values dynamically fluctuate to simulate live spacecraft monitoring.

### 🔋 Battery Simulation

* Battery percentage changes automatically.
* Simulates power consumption.
* Includes a recharge/reset cycle to keep the dashboard dynamic.

### 🛰️ Mission Phase Monitoring

The dashboard simulates mission phases such as:

```text
Nominal Operations
        ↓
Data Collection
        ↓
Orbit Maintenance
        ↓
Nominal Operations
```

The mission status indicator changes based on the active mission phase.

### 🕐 Mission Clock

Displays the current UTC time as a continuously updating mission clock.

### 📅 Mission Timeline

Displays mission phase information and tracks when the current mission phase started.

---

## 🛠️ Technologies Used

* **React.js**
* **JavaScript (ES6+)**
* **Vite**
* **HTML5**
* **CSS3**
* **REST API**
* **React Hooks**

  * `useState`
  * `useEffect`
  * `useRef`
* **Git & GitHub**
* **GitHub Pages**

---

## 🔌 API Integration

Live ISS position data is retrieved from:

**Where The ISS At API**

Endpoint:

```text
https://api.wheretheiss.at/v1/satellites/25544
```

The application retrieves:

```text
latitude
longitude
```

The API data is then converted into React state and used by the dashboard components.

### Data Flow

```text
ISS API
   ↓
getISSData()
   ↓
App.jsx
   ↓
issPosition state
   ↓
OrbitVisualization
   ↓
Live coordinates + orbital position
```

For movement direction:

```text
ISS API
   ↓
Current coordinates
   ↓
Compare with previous coordinates
   ↓
Calculate N/S/E/W
   ↓
issDirection state
   ↓
OrbitVisualization
   ↓
Direction displayed
```

---

## ⚛️ React Concepts Demonstrated

### `useState`

Used for dynamic UI state such as:

* ISS position
* ISS direction
* battery level
* mission phase
* mission clock
* API loading/error state

### `useEffect`

Used for side effects such as:

* Fetching ISS data
* Refreshing ISS coordinates every 10 seconds
* Updating telemetry
* Updating the mission clock
* Tracking mission phase changes
* Cleaning up intervals

### `useRef`

Used to store the previous ISS coordinates between API requests.

```jsx
const previousIssPosition = useRef({
  latitude: null,
  longitude: null,
})
```

This allows the application to compare the previous API response with the current response without using additional UI state.

---

## 🧩 Project Structure

```text
mission-control-dashboard/
│
├── src/
│   ├── assets/
│   │   ├── Earth-Planet.png
│   │   ├── iis.png
│   │   └── ...
│   │
│   ├── components/
│   │   ├── MissionStatus.jsx
│   │   ├── Telemetry.jsx
│   │   ├── MissionOverview.jsx
│   │   ├── MissionTimeline.jsx
│   │   ├── OrbitVisualization.jsx
│   │   ├── OverviewCard.jsx
│   │   └── TelemetryCard.jsx
│   │
│   ├── services/
│   │   └── issApi.js
│   │
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── public/
├── package.json
├── vite.config.js
└── README.md
```

---

## ▶️ Run Locally

Clone the repository:

```bash
git clone https://github.com/RudraS52/mission-control-dashboard.git
```

Navigate to the project:

```bash
cd mission-control-dashboard
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available through the local Vite development URL.

---

## 📦 Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🚀 Deployment

The project is deployed to **GitHub Pages** using the `gh-pages` package.

Deployment command:

```bash
npm run deploy
```

The deployment process:

```text
React source
    ↓
Vite production build
    ↓
dist/
    ↓
gh-pages
    ↓
GitHub Pages
```

---

## 🎯 Purpose of the Project

This project was created as a practical React application to demonstrate:

* Component-based UI development
* Responsive dashboard design
* REST API integration
* Real-time polling
* State management with React Hooks
* `useRef` for persistent non-UI data
* Dynamic data visualization
* API error handling
* CSS-based dashboard styling
* Git/GitHub workflow
* Production deployment using GitHub Pages

---

## 🔮 Future Enhancements

Planned improvements may include:

* More realistic ISS telemetry
* Spacecraft orbital tracking improvements
* Additional NASA/public space APIs
* Mission outcome prediction
* Historical telemetry charts
* More detailed orbital data
* Enhanced responsive/mobile layout
* Additional mission monitoring modules

---

## 👨‍💻 Developer

**Rudra Singh**

Frontend / UI Developer
React.js • JavaScript • ASP.NET MVC / .NET

Portfolio:
[https://rudras52.github.io/portfolio/](https://rudras52.github.io/portfolio/)

LinkedIn:
[https://www.linkedin.com/in/web-developer-rp-singh/](https://www.linkedin.com/in/web-developer-rp-singh/)

---

## 📄 License

This project is intended for learning, portfolio demonstration, and experimentation with modern frontend development concepts.

This is ready to replace your current `README.md`. I kept the wording **portfolio/interview focused** rather than making it sound like a production NASA system, which is important because some telemetry is simulated and the direction calculation is intentionally simplified.
