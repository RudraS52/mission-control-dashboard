import { useState, useEffect } from 'react'
import './App.css'
import MissionStatus from './components/MissionStatus'
import Telemetry from './components/Telemetry'
import MissionOverview from './components/MissionOverview'
import MissionTimeline from './components/MissionTimeline'
import OrbitVisualization from './components/OrbitVisualization'
import { getISSData } from './services/issApi'
function App() {
  
  const [telemetryData, setTelemetryData] = useState({
  altitude: "408 km",
  velocity: "7.66 km/s",
  temperature: "21.4 °C",
  battery: "87%",
})

const [batteryLevel, setBatteryLevel] = useState(87)
const [missionPhase, setMissionPhase] = useState("Nominal Operations")
const [currentTime, setCurrentTime] = useState(new Date())
const [phaseChangedAt, setPhaseChangedAt] = useState(new Date())
const [issPosition, setIssPosition] = useState({
  latitude: null,
  longitude: null,
})
// Track the current ISS API request status
const [issLoading, setIssLoading] = useState(true)
const [issError, setIssError] = useState('')

// Gradually decrease battery level to simulate power consumption
useEffect(() => {
  const timer = setInterval(() => {
    setBatteryLevel((prev) => {

// Simulate battery discharge and recharge cycle
const newBattery = prev <= 70 ? 87 : prev - 1


// Simulate mission phase progression
setMissionPhase((prev) => {
  if (prev === "Nominal Operations") {
    return "Data Collection"
  }

  if (prev === "Data Collection") {
    return "Orbit Maintenance"
  }

  return "Nominal Operations"
})

  setTelemetryData((current) => ({
    ...current,
    battery: `${newBattery}%`,
  }))

  return newBattery
})

    setTelemetryData({
      altitude: `${(408 + (Math.random() * 2 - 1)).toFixed(1)} km`,
      velocity: `${(7.66 + (Math.random() * 0.10 - 0.05)).toFixed(2)} km/s`,
      // Simulate small temperature fluctuations
      temperature: `${(21.5 + (Math.random() * 0.6 - 0.3)).toFixed(1)} °C`,
      battery: `${batteryLevel}%`,
    })
  }, 3000)

  const clockTimer = setInterval(() => {
  setCurrentTime(new Date())
}, 1000)

return () => {
  clearInterval(timer)
  clearInterval(clockTimer)
}
}, [])

// Record the time whenever the mission phase changes
useEffect(() => {
  setPhaseChangedAt(new Date())
}, [missionPhase])

// Fetch and monitor live ISS position data
useEffect(() => {
  // Request the latest ISS coordinates
  const fetchISSPosition = async () => {
    try {
      const data = await getISSData()

      // Update coordinates from the normalized ISS API response
setIssPosition({
  latitude: data.latitude,
  longitude: data.longitude,
})

      // Clear any previous API error
      setIssError('')
    } catch (error) {
      // Store an error message if the request fails
      setIssError('Unable to fetch ISS position')
    } finally {
      // Mark the request as completed
      setIssLoading(false)
    }
  }

  // Fetch immediately when the component loads
  fetchISSPosition()

  // Refresh ISS coordinates every 10 seconds
  const issTimer = setInterval(fetchISSPosition, 10000)

  // Clean up the interval when the component unmounts
  return () => {
    clearInterval(issTimer)
  }
}, [])

useEffect(() => {
  // Log only when ISS position state changes
  console.log('ISS Position Updated:', issPosition)
}, [issPosition])

// Check the ISS position stored in React state
// console.log('ISS Position State:', issPosition)

  return (
   <div className="dashboard">
<header className="dashboard-header">
  <div className="header-content">

    <div className="header-title">
      <h1 style={{ letterSpacing: '2px' }}>Mission Control</h1>
      <p style={{letterSpacing: '1px'}}>Space Engineering Mission Monitoring System</p>
    </div>

    <div className="header-status">
  <div>
    <span
  className={`status-dot ${
    missionPhase === "Orbit Maintenance" ? "status-maintenance" : ""
  }`}
>
  ●
</span>
    <span className="system-nominal" style={{ fontSize: '13.5px' }}>{missionPhase === "Orbit Maintenance"
        ? "MAINTENANCE MODE"
        : "SYSTEM NOMINAL"}
    </span>
  </div>

<div className="mission-meta">
  <div className="mission-clock-box">
    <div className="mission-clock-label">
      🕐 <small>MISSION CLOCK</small>
    </div>

    <small className="mission-clock">
      UTC {currentTime.toISOString().slice(11, 19)}
    </small>
  </div>

</div>
</div>

  </div>
</header>

      <main className="dashboard-content">
        
         <MissionStatus missionPhase={missionPhase} />
         <Telemetry
  data={telemetryData}
  batteryLevel={batteryLevel}
/> 
         <MissionOverview />

 {/* Pass live ISS coordinates and API status to the orbital component */}
<OrbitVisualization
  issPosition={issPosition}
  issLoading={issLoading}
  issError={issError}
/>
         <MissionTimeline
  missionPhase={missionPhase}
  phaseChangedAt={phaseChangedAt}
/>
      </main>
      <footer className="dashboard-footer">
  <p>
    © {new Date().getFullYear()} Mission Control Dashboard • Spacecraft Monitoring System.
  </p>
</footer>
    </div>
    
  )
}

export default App