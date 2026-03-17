const checkpoints = [
  {
    id: 1,
    designItem: 'Reusable component architecture',
    endState: 'TopBar, HeroSection, StatsStrip, GroupGrid, WeeklyFocus implemented',
    status: 'Matched',
  },
  {
    id: 2,
    designItem: 'Discover and filter study groups',
    endState: 'Search input filters groups by name, topic, and level',
    status: 'Matched',
  },
  {
    id: 3,
    designItem: 'Dashboard-style visual hierarchy',
    endState: 'Hero, stats, cards, and tracker arranged in responsive layout',
    status: 'Matched',
  },
  {
    id: 4,
    designItem: 'Clear progress/tracking area',
    endState: 'Weekly focus tracker section included at end of dashboard',
    status: 'Matched',
  },
]

function DesignMatchBoard() {
  return (
    <section className="design-match-panel">
      <p className="section-kicker">ASSIGNMENT 2.16</p>
      <h2>Design Matching With End State</h2>
      <p className="design-match-copy">
        This table maps planned UI/design intentions to implemented frontend behavior for capstone proof.
      </p>

      <div className="design-match-table" role="table" aria-label="Design to end state mapping">
        <div className="design-match-row design-match-header" role="row">
          <p role="columnheader">Design Intent</p>
          <p role="columnheader">Current End State</p>
          <p role="columnheader">Status</p>
        </div>

        {checkpoints.map((item) => (
          <div key={item.id} className="design-match-row" role="row">
            <p role="cell">{item.designItem}</p>
            <p role="cell">{item.endState}</p>
            <p role="cell"><span className="status-pill">{item.status}</span></p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DesignMatchBoard
