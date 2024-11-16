// Create a new file for the Neynar component
import { useEffect } from 'react'

interface NeynarSignInProps {
  clientId: string;
  onSuccess: (data: NeynarSignInResponse) => void;
  theme?: 'dark' | 'light';
}

export function NeynarSignIn({ clientId, onSuccess, theme = 'light' }: NeynarSignInProps) {
  useEffect(() => {
    // Load Neynar script
    const script = document.createElement('script')
    script.src = 'https://neynarxyz.github.io/siwn/raw/1.2.0/index.js'
    script.async = true
    document.body.appendChild(script)

    // Add callback to window object
    window.onSignInSuccess = (data) => {
      console.log('Raw Neynar sign-in data:', data); // Debug log
      onSuccess(data);
    }

    return () => {
      document.body.removeChild(script)
      delete window.onSignInSuccess
    }
  }, [onSuccess])

  return (
    <div
      className="neynar_signin"
      data-client_id={clientId}
      data-success-callback="onSignInSuccess"
      data-theme={theme}
    />
  )
}