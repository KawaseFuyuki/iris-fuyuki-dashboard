import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Home() {
  const { data: session } = useSession()
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      setLoading(true)
      fetch('/api/guilds')
      .then(res => res.json())
      .then(data => {
          setServers(data)
          setLoading(false)
        })
    }
  }, [session])

  if (!session) {
    return (
      <div style={{ padding: 50, textAlign: 'center', background: '#0a0a0a', color: 'white', minHeight: '100vh' }}>
        <h1>Iris Fuyuki Dashboard</h1>
        <button 
          onClick={() => signIn('discord')}
          style={{ padding: '15px 30px', fontSize: 18, background: '#5865F2', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}
        >
          Login with Discord
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: 50, background: '#0a0a0a', color: 'white', minHeight: '100vh' }}>
      <h1>Welcome {session.user.name}</h1>
      <button onClick={() => signOut()} style={{ padding: '10px 20px', background: '#ff006e', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
        Logout
      </button>
      
      <h2 style={{ marginTop: 40 }}>Your Admin Servers:</h2>
      {loading && <p>Loading servers...</p>}
      {servers.error && <p style={{ color: 'red' }}>Error: {servers.error}</p>}
      {servers.length === 0 &&!loading && <p>No admin servers found. Kisi server me Admin ho?</p>}
      {servers.map && servers.map(server => (
        <div key={server.id} style={{ border: '1px solid #333', padding: 20, margin: '10px 0', borderRadius: 8 }}>
          {server.icon && <img src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`} width="50" style={{ borderRadius: '50%' }} />}
          <h3>{server.name}</h3>
        </div>
      ))}
    </div>
  )
}
