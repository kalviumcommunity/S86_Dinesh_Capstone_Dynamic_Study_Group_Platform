function GroupCard({ group }) {
  return (
    <article className="group-card">
      <div className="group-card-head">
        <p className="group-topic">{group.topic}</p>
        <span className="level-chip">{group.level}</span>
      </div>

      <h2>{group.name}</h2>
      <p className="group-goal">{group.goal}</p>

      <div className="group-meta">
        <p><strong>Members:</strong> {group.members}</p>
        <p><strong>Next session:</strong> {group.nextSession}</p>
      </div>

      <button className="secondary-btn" type="button">View Group</button>
    </article>
  )
}

export default GroupCard
