
function MissionStatus({ missionPhase }) {
  const phaseMessages = {
    "Nominal Operations": "ISS is orbiting Earth normally.",
    "Data Collection": "Live ISS position data is being tracked.",
    "Orbit Maintenance": "ISS orbital activity is being monitored.",
  }

  return (
    <section className="mission-status">
      <h2>Mission Status</h2>

      <div className="status-indicator">
        <span>●</span>
        <p className="mission-message">
          {phaseMessages[missionPhase] ||
            "Monitoring ISS orbital position."}
        </p>
      </div>

      <div className="mission-details">
        <div>
          <span>Mission ID</span>
          <strong>ISS-001</strong>
        </div>

        <div>
          <span>Spacecraft</span>
          <strong>International Space Station (ISS)</strong>
        </div>

        <div>
          <span>Mission Phase</span>
          <strong>{missionPhase}</strong>
        </div>
      </div>
    </section>
  )
}

export default MissionStatus
