
import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

function TelemetryChart({ longitude }) {
  const [history, setHistory] = useState([])

  // Record each valid longitude reading when the API updates
  useEffect(() => {
    const value = Number(longitude)

    if (longitude == null || !Number.isFinite(value)) return

    setHistory((previous) => {
      const latest = previous[previous.length - 1]

      // Avoid duplicate readings when the value has not changed
      if (latest && latest.longitude === value) return previous
console.log(
  'ISS longitude:',
  value,
  '| Previous:',
  latest?.longitude,
  '| Change:',
  latest ? (value - latest.longitude).toFixed(4) : 'First reading'
)
      return [
        ...previous,
        {
          time: new Date().toLocaleTimeString(),
          longitude: value,
        },
      ].slice(-30) // Keep the latest 30 readings
    })
  }, [longitude])

  return (
    <section className="telemetry-chart">
      <h2>ISS Longitude History</h2>
      <p className="chart-subtitle">Recent position readings</p>

      <div className="telemetry-chart__plot">
        {history.length < 2 ? (
          <p>Collecting ISS position data...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid stroke="#26364a" strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#9aadc2', fontSize: 11 }}
                minTickGap={25}
              />
  <YAxis
  domain={[-180, 180]}
  width={65}
  tick={(props) => {
    const { x, y, payload } = props;

    const roundedValue = Number(payload.value).toFixed(2);

    return (
      <text
        x={x}
        y={y}
        dy={4}
        textAnchor="end"
        fill="#9aadc2"
        fontSize={11}
      >
        {roundedValue + String.fromCharCode(176)}
      </text>
    );
  }}
/>
              <Tooltip
                contentStyle={{
                  background: '#101b2b',
                  border: '1px solid #38bdf8',
                  borderRadius: '8px',
                  
                }}
                labelFormatter={(label) => `Time: ${label}`}
  formatter={(value, name) => [
    `${Number(value).toFixed(2)}°`,
    name,
  ]}
              />
    
<Line
  type="linear"
  dataKey="longitude"
  name="Longitude"
  stroke="#38bdf8"
  strokeWidth={3}
  dot={{ r: 3, fill: '#38bdf8', strokeWidth: 0 }}
  activeDot={{ r: 6, fill: '#ffffff', stroke: '#38bdf8', strokeWidth: 2 }}
  connectNulls
  isAnimationActive={false}
/>

            </LineChart>
          </ResponsiveContainer>
        )}
      </div>


{/* Magnified view of recent ISS longitude changes */}
 <div className="telemetry-chart__detail">
  <h3>Recent Longitude — Magnified View</h3>
  <p className="chart-subtitle">
    Automatically scaled to recent readings
  </p>

  {history.length < 2 ? (
    <p>Collecting more readings...</p>
  ) : (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={history.slice(-10)}>
        <CartesianGrid stroke="#26364a" strokeDasharray="3 3" />
        <XAxis dataKey="time" hide />
        <YAxis
          domain={([dataMin, dataMax]) => {
            const padding = Math.max((dataMax - dataMin) * 0.2, 0.1)
            return [dataMin - padding, dataMax + padding]
          }}
          tick={{ fill: '#9aadc2', fontSize: 11 }}
          width={65}
        />
        <Tooltip />
        <Line
          type="linear"
          dataKey="longitude"
          name="Longitude"
          stroke="#fbbf24"
          strokeWidth={2}
          dot={{ r: 3 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )}
</div> 


    </section>
    
  )
}

export default TelemetryChart
