import OverviewCard from './OverviewCard'


const missionData = {
  spacecraft: "International Space Station (ISS)",
  launchVehicle: "Multiple launch vehicles",
  launchSite: "International Space Station",
  orbit: "Low Earth Orbit (LEO)",
  missionDuration: "Continuous orbital mission",
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