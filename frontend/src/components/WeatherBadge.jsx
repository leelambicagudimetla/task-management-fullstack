import { useEffect, useState } from 'react'
import { CloudSun, CloudRain, Cloud, Sun, CloudSnow, CloudLightning, AlertCircle } from 'lucide-react'

const ICONS = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Drizzle: CloudRain,
  Thunderstorm: CloudLightning,
  Snow: CloudSnow,
}

function iconFor(main) {
  return ICONS[main] || CloudSun
}

/**
 * Shows live temperature + conditions for a task's location.
 * Requires VITE_OPENWEATHER_API_KEY to be set in the frontend .env file.
 */
export default function WeatherBadge({ location }) {
  const [weather, setWeather] = useState(null)
  const [status, setStatus] = useState(location ? 'loading' : 'idle')

  useEffect(() => {
    if (!location) {
      setStatus('idle')
      return
    }

    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
    if (!apiKey) {
      setStatus('error')
      return
    }

    let cancelled = false
    setStatus('loading')

    const controller = new AbortController()
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        location,
      )}&units=metric&appid=${apiKey}`,
      { signal: controller.signal },
    )
      .then((res) => {
        if (!res.ok) throw new Error('Weather lookup failed')
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setWeather({
          temp: Math.round(data.main.temp),
          main: data.weather?.[0]?.main,
          description: data.weather?.[0]?.description,
        })
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [location])

  if (status === 'idle') return null

  if (status === 'loading') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-xs text-ink/50">
        <CloudSun size={13} className="animate-pulse" />
        Loading weather…
      </span>
    )
  }

  if (status === 'error') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-xs text-ink/40">
        <AlertCircle size={13} />
        Weather unavailable
      </span>
    )
  }

  const Icon = iconFor(weather.main)

  return (
    <span
      title={weather.description}
      className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent-dark"
    >
      <Icon size={13} />
      {weather.temp}°C · {location}
    </span>
  )
}
