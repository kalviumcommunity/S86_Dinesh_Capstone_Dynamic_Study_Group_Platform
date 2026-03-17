import GroupCard from './GroupCard'

function GroupGrid({ groups }) {
  if (!groups.length) {
    return (
      <section className="empty-state">
        <h2>No matching groups found</h2>
        <p>Try searching with another keyword like React, DSA, or System Design.</p>
      </section>
    )
  }

  return (
    <section className="group-grid">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </section>
  )
}

export default GroupGrid
