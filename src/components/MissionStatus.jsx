
function MissionStatus({ missionPhase }) {
  
  // Map each mission phase to its status message
const phaseMessages = {
  "Nominal Operations": "All systems operating normally.",
  "Data Collection": "Spacecraft is collecting mission data.",
  "Orbit Maintenance": "Orbit maintenance activities in progress.",
}
  
  return (
    <section className="mission-status">
      <h2>Mission Status</h2>

      <div className="status-indicator">
     
        {/* Show a message based on the current mission phase */}

<p className="mission-message">
  {missionPhase === "Nominal Operations"
    ? "All systems operating normally."
    : missionPhase === "Data Collection"
    ? "Spacecraft is collecting mission data."
    : "Orbit maintenance activities in progress."}
</p>

  <span>●</span>
  {phaseMessages[missionPhase]}
</div>
      <div className="mission-details">
        <div>
          <span>Mission ID</span>
          <strong>MC-001</strong>
        </div>

        <div>
          <span>Spacecraft</span>
          <strong>Explorer-01</strong>
        </div>

        <div>
          <span>Mission Phase</span>
          {/* Display the current simulated mission phase */}
          <strong>{missionPhase}</strong>
        </div>
      </div>
    </section>
  )
}

export default MissionStatus

