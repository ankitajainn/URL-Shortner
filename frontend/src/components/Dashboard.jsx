import { useEffect, useState } from 'react'
import { api, ApiError } from '../api.js'

function shortUrlLabel(shortCode) {
  return `${api.base.replace(/^https?:\/\//, '')}/${shortCode}`
}

export default function Dashboard({ token, onLogout }) {
  const [urls, setUrls] = useState([])
  const [codesLoading, setCodesLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [url, setUrl] = useState('')
  const [code, setCode] = useState('')
  const [shortenLoading, setShortenLoading] = useState(false)
  const [shortenError, setShortenError] = useState('')

  const [deletingId, setDeletingId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    loadCodes()
  }, [])

  async function loadCodes() {
    setCodesLoading(true)
    setLoadError('')
    try {
      const data = await api.getCodes(token)
      setUrls(data.codes || [])
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onLogout()
        return
      }
      setLoadError(err instanceof ApiError ? err.message : 'Could not load your links.')
    } finally {
      setCodesLoading(false)
    }
  }

  async function handleShorten(e) {
    e.preventDefault()
    setShortenError('')
    setShortenLoading(true)
    try {
      const result = await api.shorten({ url, code: code || undefined }, token)
      setUrls((prev) => [
        { id: result.id, shortCode: result.shortCode, targetURL: result.targetURL, createdAt: new Date().toISOString() },
        ...prev,
      ])
      setUrl('')
      setCode('')
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onLogout()
        return
      }
      setShortenError(err instanceof ApiError ? err.message : 'Could not shorten that link.')
    } finally {
      setShortenLoading(false)
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await api.deleteCode(id, token)
      setUrls((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onLogout()
        return
      }
      setLoadError(err instanceof ApiError ? err.message : 'Could not delete that link.')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleCopy(id, shortCode) {
    const shortUrl = `${api.base}/${shortCode}`
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopiedId(id)
      setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500)
    } catch {
      // clipboard access denied — silently ignore
    }
  }

  return (
    <div className="shell">
      <div className="topbar">
        <div className="brand">
          <span className="brand-mark mono">⌁/</span>
          <span className="brand-name">snip</span>
          <span className="brand-tagline mono">// url shortener</span>
        </div>
        <div className="topbar-right">
          <span className="user-chip mono">signed in</span>
          <button className="btn-ghost" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>

      <div className="dash">
        <div className="panel">
          <div className="panel-title">
            <span className="dot" />
            New link
          </div>
          {shortenError && <div className="alert alert-error">{shortenError}</div>}
          <form className="shorten-form" onSubmit={handleShorten}>
            <div className="field url-field">
              <label htmlFor="url">Destination URL</label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/your-long-link"
                required
              />
            </div>
            <div className="field code-field">
              <label htmlFor="code">Custom code</label>
              <input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <button className="btn-primary" type="submit" disabled={shortenLoading}>
              {shortenLoading ? 'Shortening…' : 'Shorten'}
            </button>
          </form>
        </div>

        <div className="panel">
          <span className="section-label">
            {urls.length ? `${urls.length} link${urls.length === 1 ? '' : 's'}` : 'your links'}
          </span>

          {loadError && <div className="alert alert-error">{loadError}</div>}

          {codesLoading ? (
            <div className="loading-row pulse">loading your links…</div>
          ) : urls.length === 0 ? (
            <div className="empty-state">
              <div className="glyph mono">∅</div>
              <p>No links yet. Shorten your first one above.</p>
            </div>
          ) : (
            <div className="link-list">
              {urls.map((item) => (
                <div className="link-row" key={item.id}>
                  <div className="link-main">
                    <span className="code-chip mono">{item.shortCode}</span>
                    <a
                      className="short-url mono"
                      href={`${api.base}/${item.shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {shortUrlLabel(item.shortCode)}
                    </a>
                    <span className="target-url" title={item.targetURL}>
                      → {item.targetURL}
                    </span>
                  </div>
                  <div className="link-actions">
                    <button
                      className="icon-btn"
                      onClick={() => handleCopy(item.id, item.shortCode)}
                      title="Copy short link"
                      aria-label="Copy short link"
                    >
                      {copiedId === item.id ? '✓' : '⧉'}
                    </button>
                    <button
                      className="icon-btn danger"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      title="Delete link"
                      aria-label="Delete link"
                    >
                      {deletingId === item.id ? '…' : '✕'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
