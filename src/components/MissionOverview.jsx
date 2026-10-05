import OverviewCard from './OverviewCard'

const missionData = {
  launchVehicle: "Falcon 9",
  launchSite: "LC-39A",
  orbit: "Low Earth Orbit",
  missionDuration: "12 Days",
}

function MissionOverview() {
  return (
    <section className="mission-overview">
      <h2>
  <span className="spacecraft-icon">🚀</span> Mission Overview
</h2>
      <div className="overview-details">
        <OverviewCard
  label="Launch Vehicle"
  value={missionData.launchVehicle}
/>

       <OverviewCard
  label="Launch Site"
  value={missionData.launchSite}
/>
        <OverviewCard
  label="Orbit"
  value={missionData.orbit}
/>
        <OverviewCard
  label="Mission Duration"
  value={missionData.missionDuration}
/>
      </div>
    </section>
  )
}

export default MissionOverview