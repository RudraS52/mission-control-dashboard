
import { useEffect, useRef } from 'react'
import issImage from '../assets/iis.png'
import earthImage from '../assets/Earth-Planet.png'

function OrbitVisualization({
  issPosition,
  issLoading,
  issError,
  issDirection,
}) {
  // Check whether valid ISS coordinates have been received
  const hasPosition =
    issPosition.latitude !== null &&
    issPosition.longitude !== null &&
    Number.isFinite(Number(issPosition.longitude))

  // Convert live longitude into a target angle around the orbit
  const spacecraftAngle = hasPosition
    ? (Number(issPosition.longitude) + 180 + 360) % 360
    : 0

  // Keep animation values and the marker between React renders
  const spacecraftRef = useRef(null)
  const animatedAngleRef = useRef(null)
  const previousTargetRef = useRef(null)
  const animationFrameRef = useRef(null)

  // Smoothly animate the ISS between API position updates
  useEffect(() => {
    if (!hasPosition || !spacecraftRef.current) return

    const marker = spacecraftRef.current

    // Position the marker around the existing circular path
    const updateMarker = (angle) => {
      const radians = (angle * Math.PI) / 180

      const x = 50 + 50 * Math.cos(radians)
      const y = 50 + 50 * Math.sin(radians)

      marker.style.left = `${x}%`
      marker.style.top = `${y}%`
    
      const trail = marker.parentElement?.querySelector('.iss-trail')

      if (trail) {
        trail.style.left = `${x}%`
        trail.style.top = `${y}%`
       // Orient the trail along the orbital direction of travel
trail.style.setProperty(
  '--iss-trail-angle',
  `${angle + 90}deg`
)
      }

    
    }

    // Place the ISS at its first valid position immediately
    if (animatedAngleRef.current === null) {
      animatedAngleRef.current = spacecraftAngle
      previousTargetRef.current = spacecraftAngle

      updateMarker(spacecraftAngle)
      return
    }

    // Do not restart the animation for an unchanged target
    if (previousTargetRef.current === spacecraftAngle) return

    // Begin at the marker's current visual position
    const startAngle = animatedAngleRef.current
    const targetAngle = spacecraftAngle

    // Choose the shortest path across the 0°/360° boundary
    const delta =
      ((targetAngle - startAngle + 540) % 360) - 180

    // Animate over the approximate API refresh interval
    const duration = 12000 // Complete the visual transition in 9 seconds
    let startTime = null

    // Save the latest API target
    previousTargetRef.current = targetAngle

    // Cancel any previous animation before starting another
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    const animate = (timestamp) => {
      if (startTime === null) {
        startTime = timestamp
      }

      // Calculate progress from 0 to 1
      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      )

      // Linear interpolation gives a constant angular speed
      const angle = startAngle + delta * progress

      // Save and display the current animated position
      animatedAngleRef.current = angle
      updateMarker(angle)

      if (progress < 1) {
        animationFrameRef.current =
          requestAnimationFrame(animate)
      } else {
        // Finish exactly at the latest target
        animatedAngleRef.current = targetAngle
        updateMarker(targetAngle)
        animationFrameRef.current = null
      }
    }

    animationFrameRef.current =
      requestAnimationFrame(animate)

    // Clean up when the target changes or component unmounts
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [hasPosition, spacecraftAngle])

  return (
    <section className="orbit-visualization">

      {/* Header and live indicator */}
      <div className="orbit-title-row">
        <h2>Orbital Position</h2>

        {!issLoading && !issError && (
          <span className="live-indicator">● LIVE</span>
        )}
      </div>

      {/* Display API request status */}
      {issLoading && (
        <p className="api-status">
          Connecting to ISS data...
        </p>
      )}

      {issError && (
        <p className="api-error">{issError}</p>
      )}

      {/* Display live ISS coordinate telemetry */}
      <div className="iss-coordinates">

        <div className="coordinate-item">
          <span>LATITUDE</span>
          <strong>
            {issPosition.latitude !== null &&
            Number.isFinite(Number(issPosition.latitude))
              ? Number(issPosition.latitude).toFixed(4)
              : '--'}°
          </strong>
        </div>

        <div className="coordinate-item">
          <span>LONGITUDE</span>
          <strong>
            {issPosition.longitude !== null &&
            Number.isFinite(Number(issPosition.longitude))
              ? Number(issPosition.longitude).toFixed(4)
              : '--'}°
          </strong>
        </div>

        <div className="coordinate-item">
          <span>DIRECTION</span>
          <strong style={{ fontSize: '18px' }}>
            {issDirection || 'NO DIRECTION'}
          </strong>
        </div>

      </div>

      
      
   
<div className="orbit-view">
  <img src={earthImage} alt="Earth" className="earth" />

  <div className="orbit-ring">
    {/* Decorative orbital rings */}
    <span
      className="orbit-layer orbit-layer--outer"
      aria-hidden="true"
    />
    <span
      className="orbit-layer orbit-layer--inner"
      aria-hidden="true"
    />
    <span
      className="orbit-layer orbit-layer--tilted"
      aria-hidden="true"
    />

    {/* ISS trail follows the spacecraft */}
    <div className="iss-trail" aria-hidden="true" />

    {hasPosition && (
      <img
        ref={spacecraftRef}
        src={issImage}
        alt="International Space Station"
        className="spacecraft"
        style={{
          left: '50%',
          top: '50%',
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
