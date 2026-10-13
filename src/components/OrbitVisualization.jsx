
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

  
 
  // Smoothly animate the ISS marker when the API position changes
  useEffect(() => {
    // Wait until valid coordinates and the marker are available
    if (!hasPosition || !spacecraftRef.current) return

    const marker = spacecraftRef.current
    const orbitRadius = 50 // Keep the marker inside the orbital ring

    // Position the ISS marker and its trail along the circular path
    const updateMarker = (angle) => {
      const radians = (angle * Math.PI) / 180

      // Calculate marker coordinates around the center of the orbit
      const x = 50 + orbitRadius * Math.cos(radians)
      const y = 50 + orbitRadius * Math.sin(radians)

      marker.style.left = `${x}%`
      marker.style.top = `${y}%`

      // Keep the trail attached to the ISS marker
      const trail = marker.parentElement?.querySelector('.iss-trail')

      if (trail) {
        trail.style.left = `${x}%`
        trail.style.top = `${y}%`

        // Rotate the trail to follow the circular movement
        trail.style.setProperty(
          '--iss-trail-angle',
          `${angle + 90}deg`
        )
      }
    }

    // Initialize the marker at the first received ISS position
    if (animatedAngleRef.current === null) {
      animatedAngleRef.current = spacecraftAngle
      previousTargetRef.current = spacecraftAngle
      updateMarker(spacecraftAngle)
      return
    }

    // Skip animation when the API target has not changed
    if (previousTargetRef.current === spacecraftAngle) return

    // Start from the marker's current animated position
    const startAngle = animatedAngleRef.current
    const targetAngle = spacecraftAngle

    // Find the shortest angular path across 0° and 360°
    const delta =
      ((targetAngle - startAngle + 540) % 360) - 180

    // Animate the transition over 9 seconds
    const duration = 9000
    let startTime = null

    // Save the new target received from the API
    previousTargetRef.current = targetAngle

    // Cancel any previous animation frame before starting another
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    // Animate the marker progressively toward the new position
    const animate = (timestamp) => {
      if (startTime === null) startTime = timestamp

      // Calculate animation progress between 0 and 1
      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      )

      // Apply smooth ease-in/ease-out movement
      const easedProgress =
        progress * progress * (3 - 2 * progress)

      const angle = startAngle + delta * easedProgress

      // Save and render the current animated position
      animatedAngleRef.current = angle
      updateMarker(angle)

      if (progress < 1) {
        animationFrameRef.current =
          requestAnimationFrame(animate)
      } else {
        // Finish exactly at the target angle
        animatedAngleRef.current = startAngle + delta
        updateMarker(startAngle + delta)
        animationFrameRef.current = null
      }
    }

    // Start the animation
    animationFrameRef.current =
      requestAnimationFrame(animate)

    // Cancel pending animation frames when the effect restarts or unmounts
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
