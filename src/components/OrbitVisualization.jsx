
import { useEffect, useRef, useState } from 'react'
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
    issPosition.longitude !== null

  // Convert live longitude into an angle around the orbit
  const longitude = Number(issPosition.longitude)

  const spacecraftAngle = hasPosition
    ? (longitude + 180) % 360
    : 0

  // Store the animated angle separately from the API target angle
  const [animatedAngle, setAnimatedAngle] = useState(0)

  // Keep animation values between React renders
  const animatedAngleRef = useRef(null)
  const previousTargetRef = useRef(null)

  // Smoothly animate the ISS between API position updates
  useEffect(() => {
    if (!hasPosition) return

    // Place the marker at its first valid position immediately
    if (previousTargetRef.current === null) {
      previousTargetRef.current = spacecraftAngle
      animatedAngleRef.current = spacecraftAngle
      setAnimatedAngle(spacecraftAngle)
      return
    }

    // Ignore repeated target angles
    if (previousTargetRef.current === spacecraftAngle) return

    // Start from the marker's current visual position
    const startAngle = animatedAngleRef.current
    const targetAngle = spacecraftAngle

    // Choose the shortest path when crossing the 0°/360° boundary
    const delta =
      ((targetAngle - startAngle + 540) % 360) - 180

    const duration = 9500 // Animate over 9.5 seconds
    let startTime = null
    let frameId

    // Save the new target so this update is not repeated
    previousTargetRef.current = targetAngle

    const animate = (timestamp) => {
      if (startTime === null) startTime = timestamp

      // Calculate animation progress from 0 to 1
      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      )

      // Interpolate the angle between old and new positions
      const currentAngle = startAngle + delta * progress

      animatedAngleRef.current = currentAngle
      setAnimatedAngle(currentAngle)

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      } else {
        // Snap to the exact target when animation completes
        animatedAngleRef.current = targetAngle
        setAnimatedAngle(targetAngle)
      }
    }

    frameId = requestAnimationFrame(animate)

    // Cancel unfinished animation if the target changes or component unmounts
    return () => cancelAnimationFrame(frameId)
  }, [hasPosition, spacecraftAngle])

  // Convert the animated angle into circular coordinates
  const angleInRadians = (animatedAngle * Math.PI) / 180
  const orbitRadius = 145

  const spacecraftX =
    50 + (orbitRadius / 145) * 50 * Math.cos(angleInRadians)

  const spacecraftY =
    50 + (orbitRadius / 145) * 50 * Math.sin(angleInRadians)

  return (
    <section className="orbit-visualization">

      <div className="orbit-title-row">
        <h2>Orbital Position</h2>

        {!issLoading && !issError && (
          <span className="live-indicator">● LIVE</span>
        )}
      </div>

      {/* Display API request status */}
      {issLoading && (
        <p className="api-status">Connecting to ISS data...</p>
      )}

      {issError && (
        <p className="api-error">{issError}</p>
      )}

      {/* Keep actual API coordinates and movement direction */}
      <div className="iss-coordinates">
        <div className="coordinate-item">
          <span>LATITUDE</span>
          <strong>
            {issPosition.latitude !== null
              ? Number(issPosition.latitude).toFixed(4)
              : '--'}°
          </strong>
        </div>

        <div className="coordinate-item">
          <span>LONGITUDE</span>
          <strong>
            {issPosition.longitude !== null
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
        {/* Existing Earth image */}
        <img
          src={earthImage}
          alt="Earth"
          className="earth"
        />

        <div className="orbit-ring">
          {/* ISS marker follows the animated orbital position */}
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
