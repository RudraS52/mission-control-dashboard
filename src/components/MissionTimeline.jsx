
function MissionTimeline({ missionPhase, phaseChangedAt  }) {
  // Map each mission phase to its timeline message
  const phaseMessages = {
    "Nominal Operations": "Nominal operations in progress",
    "Data Collection": "Data collection in progress",
    "Orbit Maintenance": "Orbit maintenance in progress",
  }

  // Show the latest event and previous mission events
  const events = [
    {
      // Use the live UTC clock for the latest event
      time: `UTC ${phaseChangedAt.toISOString().slice(11, 19)}`,
      event: phaseMessages[missionPhase],
    },
    {
      time: "14:30 UTC",
      event: "Orbit check completed",
    },
    {
      time: "14:27 UTC",
      event: "Data collection started",
    },
  ]

  return (
    <section className="mission-timeline">
      <h2>Mission Timeline</h2>

      {events.map((item, index) => (
        <div
          className={`timeline-event ${
            index === 0 ? "timeline-current" : ""
          }`}
          key={index}
        >
          <span>{item.time}</span>
          <strong>{item.event}</strong>
        </div>
      ))}
    </section>
  )
}

export default MissionTimeline