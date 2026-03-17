import { useMemo, useState } from 'react'
import './App.css'
import GroupGrid from './components/GroupGrid'
import HeroSection from './components/HeroSection'
import StatsStrip from './components/StatsStrip'
import TopBar from './components/TopBar'
import WeeklyFocus from './components/WeeklyFocus'

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

  return (
    <div className="app-shell">
      <TopBar />
      <HeroSection query={query} onQueryChange={setQuery} />
      <StatsStrip stats={stats} />
      <GroupGrid groups={filteredGroups} />
      <WeeklyFocus />
    </div>
  )
}

export default App
