function TopBar({ currentUser, onLogout }) {
  return (
    <header className="top-bar">
      <div className="brand-block">
        <span className="brand-pill">DSG</span>
        <div>
          <p className="brand-title">Dynamic Study Group Platform</p>
          <p className="brand-subtitle">Plan, collaborate, and track progress together.</p>
        </div>
      </div>

      <div className="top-bar-actions">
        {currentUser ? <p className="session-text">Signed in as @{currentUser.username}{currentUser.authProvider ? ` via ${currentUser.authProvider}` : ''}</p> : null}
        {currentUser ? (
          <button className="secondary-btn session-btn" type="button" onClick={onLogout}>Logout</button>
        ) : (
          <button className="primary-btn" type="button">Create Group</button>
        )}
      </div>
    </header>
  )
}

export default TopBar
