
function TelemetryCard({ label, value, isBattery, batteryLevel }) {
  return (
    <div className="telemetry-card">
      <span>{label}</span>
      <strong>{value}</strong>

      {/* Show battery progress and warning only for the battery */}
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

          {/* Show warning below the progress bar when battery is low */}
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

