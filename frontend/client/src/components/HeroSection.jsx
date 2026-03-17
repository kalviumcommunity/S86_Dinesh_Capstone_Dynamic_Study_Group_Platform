function HeroSection({ query, onQueryChange }) {
  return (
    <section className="hero-section">
      <p className="section-kicker">SMARTER COLLABORATIVE LEARNING</p>
      <h1>Discover focused study groups and stay accountable.</h1>
      <p className="hero-copy">
        Join active groups by subject, track upcoming sessions, and keep your weekly learning goals on schedule.
      </p>

      <label className="search-label" htmlFor="group-search">Search groups</label>
      <input
        id="group-search"
        className="search-input"
        type="text"
        placeholder="Try: React, DSA, Calculus"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </section>
  )
}

export default HeroSection
