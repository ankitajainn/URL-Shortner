import { useState } from 'react'
import { api, ApiError } from '../api.js'

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  function switchMode(next) {
    setMode(next)
    setError('')
    setNotice('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        await api.signup({ firstname, lastname: lastname || undefined, email, password })
        setNotice('Account created. Sign in to continue.')
        setMode('login')
        setPassword('')
      } else {
        const data = await api.login({ email, password })
        onAuthenticated(data.token)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shell">
      <div className="auth-wrap">
        <div className="auth-visual">
          <span className="brand-mark mono">⌁/</span>
          <h1>Long links, short codes, nothing in between.</h1>
          <p className="lede">
            Paste any URL, get a compact code back, and keep every link you've ever shortened in
            one list — with one-click copy and delete.
          </p>
          <div className="compress-demo">
            <div className="compress-row">
              <span className="compress-bar mono">
                https://example.com/articles/2026/how-signals-become-links
              </span>
            </div>
            <div className="compress-row">
              <span className="compress-arrow mono">↓ compress</span>
            </div>
            <div className="compress-row">
              <span className="code-chip mono" style={{ alignSelf: 'flex-start' }}>
                snip/8fK2q1
              </span>
            </div>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-card">
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                onClick={() => switchMode('login')}
              >
                Log in
              </button>
              <button
                type="button"
                className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => switchMode('signup')}
              >
                Sign up
              </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {notice && <div className="alert alert-success">{notice}</div>}

            <form onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="firstname">First name</label>
                    <input
                      id="firstname"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      placeholder="Ankita"
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="lastname">Last name</label>
                    <input
                      id="lastname"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                </div>
              )}

              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 3 characters"
                  minLength={3}
                  required
                />
              </div>

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Working…' : mode === 'signup' ? 'Create account' : 'Log in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
