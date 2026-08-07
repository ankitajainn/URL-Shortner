import { useEffect, useState } from 'react'
import AuthScreen from './components/AuthScreen.jsx'
import Dashboard from './components/Dashboard.jsx'

const TOKEN_KEY = 'snip_token'

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [token])

  if (!token) {
    return <AuthScreen onAuthenticated={setToken} />
  }

  return <Dashboard token={token} onLogout={() => setToken(null)} />
}
