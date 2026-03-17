import { useState } from 'react'
import GoogleSignInButton from './GoogleSignInButton'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function AuthPanel({ session, onAuthSuccess }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    const endpoint = mode === 'register' ? '/api/users/register' : '/api/users/login'
    const payload = mode === 'register'
      ? { name, email, username, password }
      : { username, password }

    try {
      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed.')
      }

      onAuthSuccess(data)
      setName('')
      setEmail('')
      setUsername('')
      setPassword('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (session?.user) {
    return (
      <section className="auth-panel auth-panel-active">
        <p className="section-kicker">AUTHENTICATION</p>
        <h2>Signed in successfully</h2>
        <p className="auth-summary">
          You are authenticated as <strong>@{session.user.username}</strong>
          {session.user.authProvider ? ` using ${session.user.authProvider}` : ''}. Protected actions like file upload are now enabled.
        </p>
      </section>
    )
  }

  return (
    <section className="auth-panel">
      <div className="auth-panel-head">
        <div>
          <p className="section-kicker">AUTHENTICATION</p>
          <h2>{mode === 'register' ? 'Create an account' : 'Login with username and password'}</h2>
        </div>

        <div className="auth-toggle">
          <button
            className={`toggle-btn ${mode === 'login' ? 'toggle-btn-active' : ''}`}
            type="button"
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`toggle-btn ${mode === 'register' ? 'toggle-btn-active' : ''}`}
            type="button"
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === 'register' ? (
          <>
            <label className="form-label" htmlFor="auth-name">Name</label>
            <input
              id="auth-name"
              className="form-input"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Dinesh"
            />

            <label className="form-label" htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              className="form-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="dinesh@example.com"
            />
          </>
        ) : null}

        <label className="form-label" htmlFor="auth-username">Username</label>
        <input
          id="auth-username"
          className="form-input"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="studybuddy01"
          required
        />

        <label className="form-label" htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          className="form-input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimum 6 characters"
          required
        />

        <button className="primary-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : mode === 'register' ? 'Register' : 'Login'}
        </button>
      </form>

      <div className="oauth-divider">
        <span>or continue with Google</span>
      </div>

      <GoogleSignInButton onAuthSuccess={onAuthSuccess} />

      {error ? <p className="upload-feedback error-text">{error}</p> : null}
    </section>
  )
}

export default AuthPanel