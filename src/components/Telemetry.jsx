import TelemetryCard from './TelemetryCard'

//   const telemetryData = {
//   altitude: "408 km",
//   velocity: "7.66 km/s",
//   temperature: "21.4 °C",
//   battery: "87%",
//  }

const telemetryItems = [
  {
    label: "Altitude",
    valueKey: "altitude",
  },
  {
    label: "Velocity",
    valueKey: "velocity",
  },
  {
    label: "Temperature",
    valueKey: "temperature",
  },
  {
    label: "Battery",
    valueKey: "battery",
    isBattery: true,
  },
]


function Telemetry({ data, batteryLevel }) {
  return (
    <section className="telemetry">
      
      <h2>
  Telemetry <span className="live-indicator">● LIVE</span>
</h2>

      <div className="telemetry-grid">
      
  
       {telemetryItems.map((item) => (
  
  
  <TelemetryCard
  key={item.valueKey}
  label={item.label}
  value={data[item.valueKey]}
  isBattery={item.isBattery}
  batteryLevel={batteryLevel}
/>
))}
      </div>
    
    </section>
  )
}

export default Telemetry