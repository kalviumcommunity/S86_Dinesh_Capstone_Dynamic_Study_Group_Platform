function StatsStrip({ stats }) {
  return (
    <section className="stats-strip">
      {stats.map((stat) => (
        <article key={stat.label} className="stat-card">
          <p className="stat-value">{stat.value}</p>
          <p className="stat-label">{stat.label}</p>
        </article>
      ))}
    </section>
  )
}

export default StatsStrip
