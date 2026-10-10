
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
  domain={['auto', 'auto']}
  tick={{ fill: '#9aadc2', fontSize: 11 }}
  width={55}
  tickCount={5}
/>
              <Tooltip
                contentStyle={{
                  background: '#101b2b',
                  border: '1px solid #38bdf8',
                  borderRadius: '8px',
                }}
              />
    
<Line
  type="natural"
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
    </section>
  )
}

export default TelemetryChart
