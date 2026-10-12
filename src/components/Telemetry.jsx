
import TelemetryCard from './TelemetryCard'

const telemetryItems = [
  {
    label: 'Altitude',
    valueKey: 'altitude',
  },
  {
    label: 'Velocity',
    valueKey: 'velocity',
  },
  {
    label: 'Temperature',
    valueKey: 'temperature',
  },
  {
    label: 'Battery',
    valueKey: 'battery',
    isBattery: true,
  },
]

function Telemetry({ data = {}, batteryLevel = 87 }) {
  const telemetryData = {
    ...data,
    battery: `${batteryLevel}%`,
  }

  return (
    <section className="telemetry">
      <h2>
        Telemetry <span className="live-indicator">● LIVE</span>
      </h2>

      <div className="telemetry-grid">
        {telemetryItems.map(({ Icon, ...item }) => (
          <TelemetryCard
            key={item.valueKey}
            {...item}
            Icon={Icon}
            value={telemetryData[item.valueKey] ?? '--'}
            batteryLevel={batteryLevel}
          />
        ))}
      </div>
    </section>
  )
}

export default Telemetry
