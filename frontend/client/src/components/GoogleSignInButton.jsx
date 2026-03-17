import { useEffect, useRef, useState } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

function GoogleSignInButton({ onAuthSuccess }) {
  const buttonRef = useRef(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!googleClientId || !buttonRef.current) {
      return undefined
    }

    let isCancelled = false
    let scriptElement = document.querySelector('script[data-google-identity="true"]')

    async function handleCredentialResponse(response) {
      try {
        setError('')

        const request = await fetch(`${apiBaseUrl}/api/users/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ credential: response.credential }),
        })

        const data = await request.json()

        if (!request.ok) {
          throw new Error(data.message || 'Google authentication failed.')
        }

        onAuthSuccess(data)
      } catch (requestError) {
        if (!isCancelled) {
          setError(requestError.message)
        }
      }
    }

    function renderGoogleButton() {
      if (isCancelled || !window.google?.accounts?.id || !buttonRef.current) {
        return
      }

      buttonRef.current.innerHTML = ''
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
      })
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'continue_with',
        width: 320,
      })
    }

    if (window.google?.accounts?.id) {
      renderGoogleButton()
      return () => {
        isCancelled = true
      }
    }

    if (!scriptElement) {
      scriptElement = document.createElement('script')
      scriptElement.src = 'https://accounts.google.com/gsi/client'
      scriptElement.async = true
      scriptElement.defer = true
      scriptElement.dataset.googleIdentity = 'true'
      document.head.appendChild(scriptElement)
    }

    scriptElement.addEventListener('load', renderGoogleButton)

    return () => {
      isCancelled = true
      scriptElement?.removeEventListener('load', renderGoogleButton)
    }
  }, [onAuthSuccess])

  if (!googleClientId) {
    return (
      <div className="google-auth-config">
        Add <strong>VITE_GOOGLE_CLIENT_ID</strong> in frontend env and <strong>GOOGLE_CLIENT_ID</strong> in backend env to enable Google sign-in.
      </div>
    )
  }

  return (
    <div className="google-auth-block">
      <div ref={buttonRef} className="google-signin-slot" />
      {error ? <p className="upload-feedback error-text">{error}</p> : null}
    </div>
  )
}

export default GoogleSignInButton