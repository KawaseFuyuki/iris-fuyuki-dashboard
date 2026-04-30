import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Home() {
  const { data: session, status } = useSession()
  const [guilds, setGuilds] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (session) {
      fetch('/api/guilds')
       .then(res => res.json())
       .then(data => {
          if (data.error) {
            setError(data.error)
          } else {
            setGuilds(data)
          }
        })
       .catch(err => setError('Failed to fetch guilds'))
    }
  }, [session])

  if (status === "loading") {
    return <div style={{ padding: 50, textAlign: 'center', background: 'linear-gradient(135deg, #ffeef8 0%, #ffffff 100%)', minHeight: '100vh' }}>Loading... 🐾</div>
  }

  if (!session) {
    return (
      <div style={{
        padding: 50,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #ffeef8 0%, #ffffff 100%)',
        color: '#5a5a5a',
        minHeight: '100vh',
        fontFamily: 'system-ui'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🐱</div>
        <h1 style={{ color: '#ff69b4', fontSize: '32px' }}>Iris Fuyuki Dashboard</h1>
        <p style={{ fontSize: '16px', marginBottom: '30px' }}>Your kawaii server manager ✨</p>
        <button
          onClick={() => signIn('discord')}
          style={{
            padding: '12px 30px',
            fontSize: 18,
            cursor: 'pointer',
            background: '#ff69b4',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            boxShadow: '0 4px 15px rgba(255, 105, 180, 0.3)',
            fontWeight: '600'
          }}
        >
          🌸 Login with Discord
        </button>
      </div>
    )
  }

  return (
    <div style={{
      padding: 30,
      background: 'linear-gradient(135deg, #ffeef8 0%, #ffffff 100%)',
      color: '#5a5a5a',
      minHeight: '100vh',
      fontFamily: 'system-ui'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#ff69b4', margin: 0 }}>Welcome {session.user.name} 🐾</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>ฅ^•ﻌ•^ฅ Manage your servers!</p>
        </div>
        <button
          onClick={() => signOut()}
          style={{
            padding: '8px 20px',
            cursor: 'pointer',
            background: '#ff69b4',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontWeight: '600'
          }}
        >
          Logout
        </button>
      </div>

      <h2 style={{ color: '#ff69b4', fontSize: '22px' }}>Your Admin Servers: 🌸</h2>

      {error && <p style={{ color: '#ff1493', background: '#ffe4e1', padding: '10px', borderRadius: '10px' }}>Error: {error}</p>}

      {guilds.length === 0 &&!error && <p style={{ fontSize: '18px' }}>No admin servers found... (｡•́︿•̀｡)</p>}

      {guilds.map(guild => (
        <div key={guild.id} style={{
          border: '2px solid #ffb6c1',
          padding: 20,
          margin: '15px 0',
          borderRadius: 15,
          background: 'white',
          boxShadow: '0 4px 10px rgba(255, 182, 193, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          cursor: 'pointer',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {guild.icon? (
            <img
              src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
              alt={guild.name}
              style={{ width: 50, height: 50, borderRadius: '50%', border: '3px solid #ffb6c1' }}
            />
          ) : (
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: '#ffb6c1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>🐱</div>
          )}
          <div>
            <h3 style={{ margin: 0, color: '#ff69b4' }}>{guild.name}</h3>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>Click to manage ✨</p>
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '24px' }}>
        ฅ^•ﻌ•^ฅ ♡
      </div>
    </div>
  )
            }
