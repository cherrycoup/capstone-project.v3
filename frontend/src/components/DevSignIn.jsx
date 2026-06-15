import React from 'react'

export default function DevSignIn({ onSignedIn }) {
  const handleDevSignIn = async () => {
    try {
      const resp = await fetch('/api/auth/dev/dev-signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'dev@local' })
      })
      const data = await resp.json()
      if (data?.success && data?.token) {
        localStorage.setItem('authToken', data.token)
        if (onSignedIn) onSignedIn(data)
        window.location.reload()
      } else {
        alert('Dev sign-in failed')
      }
    } catch (err) {
      console.error('Dev sign-in error', err)
      alert('Dev sign-in error')
    }
  }

  return (
    <div style={{ marginTop: 8 }}>
      <button onClick={handleDevSignIn} style={{ padding: '8px 12px' }}>
        Dev Sign In
      </button>
    </div>
  )
}
