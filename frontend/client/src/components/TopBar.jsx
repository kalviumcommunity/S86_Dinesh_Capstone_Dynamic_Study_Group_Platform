function TopBar() {
  return (
    <header className="top-bar">
      <div className="brand-block">
        <span className="brand-pill">DSG</span>
        <div>
          <p className="brand-title">Dynamic Study Group Platform</p>
          <p className="brand-subtitle">Plan, collaborate, and track progress together.</p>
        </div>
      </div>
      <button className="primary-btn" type="button">Create Group</button>
    </header>
  )
}

export default TopBar
