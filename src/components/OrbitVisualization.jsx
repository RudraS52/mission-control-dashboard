import issImage from '../assets/iis.png'
import earthImage from '../assets/Earth-Planet.png'

// Receive live ISS coordinates and API request status from App
function OrbitVisualization({ issPosition, issLoading, issError }) {

  // Read the live ISS longitude from React state
  const longitude = Number(issPosition.longitude)

  // Check whether valid ISS coordinates have been received
  const hasPosition =
    issPosition.latitude !== null &&
    issPosition.longitude !== null

  // Convert longitude into an angle around the orbital ring
  const spacecraftAngle = hasPosition
    ? (longitude + 180) % 360
    : 0

  // Convert the angle into radians for circular positioning
  const angleInRadians = (spacecraftAngle * Math.PI) / 180

   // Calculate the spacecraft position around the ring
  // const spacecraftX = 50 + 50 * Math.cos(angleInRadians)
  // const spacecraftY = 50 + 50 * Math.sin(angleInRadians)


// Position the ISS on the exact visual orbit radius
const orbitRadius = 145

// Convert the orbit radius into percentage coordinates
const spacecraftX = 50 + (orbitRadius / 145) * 50 * Math.cos(angleInRadians)
const spacecraftY = 50 + (orbitRadius / 145) * 50 * Math.sin(angleInRadians)



  return (
   <section className="orbit-visualization">
    
    <h2>Orbital Position</h2>

    {/* Show the current ISS API request status */}
 {issLoading && (
  <p className="api-status">Connecting to ISS data...</p>
)} 


{issError && (
  <p className="api-error">{issError}</p>
)}
 
{/* Display live ISS position telemetry */}
<div className="iss-coordinates">
  <div className="coordinate-item">
    <span>LATITUDE</span>
    <strong>{issPosition.latitude ?? '--'}°</strong>
  </div>

  <div className="coordinate-item">
    <span>LONGITUDE</span>
    <strong>{issPosition.longitude ?? '--'}°</strong>
  </div>
</div>

    <div className="orbit-view">
  {/* Display the realistic Earth image  */}
<img
  src={earthImage}
  alt="Earth"
  className="earth"
/>
  <div className="orbit-ring">
    
   {/* Position the ISS image using the live longitude */}
{hasPosition && (
  <img
    src={issImage}
    alt="International Space Station"
    className="spacecraft"
    style={{
      left: `${spacecraftX}%`,
      top: `${spacecraftY}%`,
      transform: 'translate(-50%, -50%)',
    }}
  />
)}
 </div>
</div>
    
     </section>
  )
}

export default OrbitVisualization