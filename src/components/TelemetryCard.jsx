
import {
  Mountain,
  Gauge,
  Thermometer,
  BatteryCharging,
} from "lucide-react"

const telemetryIcons = {
  Altitude: Mountain,
  Velocity: Gauge,
  Temperature: Thermometer,
  Battery: BatteryCharging,
}

function TelemetryCard({ label, value, isBattery, batteryLevel }) {
  const Icon = telemetryIcons[label]

  return (
    <div className="telemetry-card">
      <div className="telemetry-card-label">
        {Icon && <Icon size={20} strokeWidth={1.8} />}
        <span>{label}</span>
      </div>

      <strong>{value}</strong>

      {isBattery && (
        <div>
          <div className="battery-bar">
            <div
              className={`battery-level ${
                batteryLevel <= 75 ? "battery-low" : ""
              }`}
              style={{ width: `${batteryLevel}%` }}
            ></div>
          </div>

          {batteryLevel <= 75 && (
            <small className="battery-warning">
              LOW BATTERY
            </small>
          )}
        </div>
      )}
    </div>
  )
}

export default TelemetryCard
