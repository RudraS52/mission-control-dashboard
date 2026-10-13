
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line, OrbitControls, useTexture } from '@react-three/drei'

const EARTH_RADIUS = 1.5
const ORBIT_RADIUS = 1.72

// Build a circular illustrative orbit that passes through the ISS position.
function createOrbitPoints(latitude, longitude) {
  const lat = THREE.MathUtils.degToRad(latitude)
  const lon = THREE.MathUtils.degToRad(longitude)

  const position = new THREE.Vector3(
    Math.cos(lat) * Math.sin(lon),
    Math.sin(lat),
    Math.cos(lat) * Math.cos(lon)
  ).normalize()

  const reference = Math.abs(position.y) > 0.95
    ? new THREE.Vector3(1, 0, 0)
    : new THREE.Vector3(0, 1, 0)

  const secondAxis = reference
    .clone()
    .addScaledVector(position, -reference.dot(position))
    .normalize()

  return Array.from({ length: 241 }, (_, index) => {
    const angle = (index / 240) * Math.PI * 2

    return position
      .clone()
      .multiplyScalar(Math.cos(angle) * ORBIT_RADIUS)
      .addScaledVector(
        secondAxis,
        Math.sin(angle) * ORBIT_RADIUS
      )
    .toArray()
  })
}

function ISSMarker({ latitude, longitude }) {
  const markerRef = useRef(null)

  const targetPosition = useMemo(() => {
    const lat = THREE.MathUtils.degToRad(latitude)
    const lon = THREE.MathUtils.degToRad(longitude)

    return new THREE.Vector3(
      ORBIT_RADIUS * Math.cos(lat) * Math.sin(lon),
      ORBIT_RADIUS * Math.sin(lat),
      ORBIT_RADIUS * Math.cos(lat) * Math.cos(lon)
    )
  }, [latitude, longitude])

  useFrame((_, delta) => {
    if (!markerRef.current) return

    markerRef.current.position.lerp(
      targetPosition,
      1 - Math.exp(-delta * 2)
    )

    // Point the spacecraft outward from Earth.
    markerRef.current.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      markerRef.current.position.clone().normalize()
    )
  })

  return (
    <group ref={markerRef} position={targetPosition}>
      {/* Bright location marker */}
      <mesh>
        <sphereGeometry args={[0.045, 20, 20]} />
        <meshBasicMaterial
          color="#bafaff"
          toneMapped={false}
        />
      </mesh>

      {/* Soft luminous halo */}
      <mesh>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshBasicMaterial
          color="#28cfff"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight
        color="#32dfff"
        intensity={2}
        distance={0.65}
      />

      {/* Simplified ISS body */}
      <mesh>
        <boxGeometry args={[0.12, 0.065, 0.065]} />
        <meshStandardMaterial
          color="#e5f4ff"
          emissive="#478bff"
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Left and right solar panels */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.13, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.14, 0.008, 0.075]} />
            <meshStandardMaterial
              color="#237bff"
              emissive="#124bba"
              emissiveIntensity={0.8}
              metalness={0.5}
              roughness={0.35}
            />
          </mesh>

          {/* Solar panel grid lines */}
          {[-0.035, 0, 0.035].map((offset) => (
            <mesh
              key={offset}
              position={[0, 0.005, offset]}
            >
              <boxGeometry args={[0.14, 0.002, 0.002]} />
              <meshBasicMaterial color="#8ddcff" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}


function GlowingOrbit({ points }) {
  return (
    <>
      {/* Soft, subtle outer glow */}
      <Line
        points={points}
        color="#36cfff"
        lineWidth={3}
        transparent
        opacity={0.10}
        depthWrite={false}
      />

      {/* Thin cyan-blue ring */}
      <Line
        points={points}
        color="#36cfff"
        lineWidth={1.2}
        transparent
        opacity={0.8}
      />
    </>
  )
}

function DecorativeRing({ rotation, radius, color }) {
  const points = useMemo(
    () =>
      Array.from({ length: 181 }, (_, index) => {
        const angle = (index / 180) * Math.PI * 2

        return [
          radius * Math.cos(angle),
          0,
          radius * Math.sin(angle),
        ]
      }),
    [radius]
  )

  return (
    <group rotation={rotation}>
      <GlowingOrbit points={points} color={color} />
    </group>
  )
}

function EarthScene({ issPosition, hasPosition }) {
  const earthGroupRef = useRef(null)

  const earthTexture = useTexture(
    `${import.meta.env.BASE_URL}textures/earth_atmos_2048.jpg`
  )

  useMemo(() => {
    earthTexture.colorSpace = THREE.SRGBColorSpace
    earthTexture.anisotropy = 8
  }, [earthTexture])

  const latitude = Number(issPosition.latitude)
  const longitude = Number(issPosition.longitude)

  const liveOrbitPoints = useMemo(() => {
    if (!hasPosition) return []

    return createOrbitPoints(latitude, longitude)
  }, [hasPosition, latitude, longitude])

  useFrame((_, delta) => {
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y += delta * 0.06
    }
  })

  return (
    <>
      <ambientLight intensity={1.1} />

      <directionalLight
        position={[4, 2, 5]}
        intensity={2.2}
      />

      <pointLight
        position={[-4, -2, -3]}
        color="#176bff"
        intensity={1.5}
      />

      {/* Earth, ISS marker and main orbit share one reference frame. */}
      <group ref={earthGroupRef}>
        <mesh>
          <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
          <meshStandardMaterial
            map={earthTexture}
            roughness={1}
            metalness={0}
          />
        </mesh>

        {/* Atmospheric halo */}
        <mesh>
          <sphereGeometry args={[1.56, 64, 64]} />
          <meshBasicMaterial
            color="#218bff"
            transparent
            opacity={0.13}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Main orbit updates with the live ISS coordinates. */}
        {hasPosition && (
          <>
            <GlowingOrbit points={liveOrbitPoints} />

            <ISSMarker
              latitude={latitude}
              longitude={longitude}
            />
          </>
        )}

        {/* Additional decorative rings */}
        <DecorativeRing
          rotation={[0.7, 0.2, 0.35]}
          radius={1.92}
          color="#36cfff"
        />

        <DecorativeRing
          rotation={[-0.55, 0.9, -0.25]}
          radius={2.08}
          color="#36cfff"
        />
      </group>
    </>
  )
}

function OrbitVisualization3D({
  issPosition,
  issLoading,
  issError,
  issDirection,
}) {
  const hasPosition =
    issPosition.latitude !== null &&
    issPosition.longitude !== null &&
    Number.isFinite(Number(issPosition.latitude)) &&
    Number.isFinite(Number(issPosition.longitude))

  return (
    <section className="orbit-visualization">
      <div className="orbit-title-row">
        <h2>Orbital Position</h2>

        {!issLoading && !issError && (
          <span className="live-indicator">● LIVE</span>
        )}
      </div>

      {issLoading && (
        <p className="api-status">Connecting to ISS data...</p>
      )}

      {issError && (
        <p className="api-error">{issError}</p>
      )}

      <div className="iss-coordinates">
        <div className="coordinate-item">
          <span>LATITUDE</span>
          <strong>
            {hasPosition
              ? Number(issPosition.latitude).toFixed(4)
              : '--'}°
          </strong>
        </div>

        <div className="coordinate-item">
          <span>LONGITUDE</span>
          <strong>
            {hasPosition
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

      <div className="orbit-view orbit-view--3d">
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={['#030916']} />

          <Suspense fallback={null}>
            <EarthScene
              issPosition={issPosition}
              hasPosition={hasPosition}
            />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableRotate
            enableZoom
            minDistance={3.5}
            maxDistance={8}
            rotateSpeed={0.6}
          />
        </Canvas>
      </div>
    </section>
  )
}

export default OrbitVisualization3D
