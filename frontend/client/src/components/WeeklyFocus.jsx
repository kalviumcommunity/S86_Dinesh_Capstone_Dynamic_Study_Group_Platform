function WeeklyFocus() {
  const tasks = [
    'Complete 2 peer discussion threads',
    'Attend 3 live sessions this week',
    'Upload 1 shared notes document',
  ]

  return (
    <section className="focus-panel">
      <p className="section-kicker">THIS WEEK</p>
      <h2>Personal Focus Tracker</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task}>{task}</li>
        ))}
      </ul>
    </section>
  )
}

export default WeeklyFocus
