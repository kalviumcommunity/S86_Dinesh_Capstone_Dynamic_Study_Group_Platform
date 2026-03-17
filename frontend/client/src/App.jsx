import { useEffect, useMemo, useState } from 'react'
import './App.css'
import AuthPanel from './components/AuthPanel'
import GroupGrid from './components/GroupGrid'
import HeroSection from './components/HeroSection'
import ResourceUploader from './components/ResourceUploader'
import StatsStrip from './components/StatsStrip'
import TopBar from './components/TopBar'
import DesignMatchBoard from './components/DesignMatchBoard'
import WeeklyFocus from './components/WeeklyFocus'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const authStorageKey = 'dynamic-study-group-auth'

const stats = [
  { label: 'Active Groups', value: '18' },
  { label: 'Live Sessions Today', value: '7' },
  { label: 'Resources Shared', value: '124' },
]

const groups = [
  {
    id: 1,
    name: 'React Interview Prep Circle',
    topic: 'Frontend Engineering',
    level: 'Intermediate',
    members: 16,
    nextSession: 'Tue, 7:00 PM',
    goal: 'Practice component design, hooks, and state patterns through mock rounds.',
  },
  {
    id: 2,
    name: 'Data Structures Night Lab',
    topic: 'DSA',
    level: 'Beginner',
    members: 22,
    nextSession: 'Wed, 8:30 PM',
    goal: 'Solve arrays, strings, and recursion problems with guided peer explanations.',
  },
  {
    id: 3,
    name: 'System Design Study Room',
    topic: 'Backend Architecture',
    level: 'Advanced',
    members: 12,
    nextSession: 'Fri, 6:00 PM',
    goal: 'Review scalability patterns and design tradeoffs using real product examples.',
  },
]

function App() {
  const [query, setQuery] = useState('')
  const [session, setSession] = useState(() => {
    const storedValue = localStorage.getItem(authStorageKey)
    return storedValue ? JSON.parse(storedValue) : null
  })

  useEffect(() => {
    let ignore = false

    async function verifySession() {
      if (!session?.token) {
        return
      }

      try {
        const response = await fetch(`${apiBaseUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Session expired')
        }

        const user = await response.json()

        if (!ignore) {
          const nextSession = { token: session.token, user }
          setSession(nextSession)
          localStorage.setItem(authStorageKey, JSON.stringify(nextSession))
        }
      } catch {
        if (!ignore) {
          setSession(null)
          localStorage.removeItem(authStorageKey)
        }
      }
    }

    verifySession()

    return () => {
      ignore = true
    }
  }, [session?.token])

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return groups
    }

    return groups.filter((group) => {
      const searchText = `${group.name} ${group.topic} ${group.level}`.toLowerCase()
      return searchText.includes(normalizedQuery)
    })
  }, [query])

  function handleAuthSuccess(payload) {
    setSession(payload)
    localStorage.setItem(authStorageKey, JSON.stringify(payload))
  }

  function handleLogout() {
    setSession(null)
    localStorage.removeItem(authStorageKey)
  }

  return (
    <div className="app-shell">
      <TopBar currentUser={session?.user} onLogout={handleLogout} />
      <HeroSection query={query} onQueryChange={setQuery} />
      <AuthPanel session={session} onAuthSuccess={handleAuthSuccess} />
      <StatsStrip stats={stats} />
      <GroupGrid groups={filteredGroups} />
      <ResourceUploader authToken={session?.token} currentUser={session?.user} />
      <DesignMatchBoard />
      <WeeklyFocus />
    </div>
  )
}

export default App
