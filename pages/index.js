import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'

export default function Home() {
  const { data: session, status } = useSession()
  const [guilds, setGuilds] = useState([])
  const [error, setError] = useState(null)
  const router = useRouter()

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
    return (
      <div style={{
        padding: 50,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui'
      }}>
        <div>
          <div style={{ fontSize: '60px' }}>🐾</div>
          <p style={{ fontSize: '20px' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div style={{
        padding: 50,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        minHeight: '100vh',
        fontFamily: 'system-ui',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🐱</div>
        <h1 style={{ fontSize: '36px', margin: '0 0 10px 0' }}>Iris Fuyuki Dashboard</h1>
        <p style={{ fontSize: '18px', marginBottom: '30px', opacity: 0.9 }}>Your kawaii server manager ฅ^•ﻌ•^ฅ</p>
        <button
          onClick={() => signIn('discord')}
          style={{
            padding: '14px 35px',
            fontSize: 18,
            cursor: 'pointer',
            background: 'white',
            color: '#764ba2',
            border: 'none',
            borderRadius: '25px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            fontWeight: '700'
          }}
        >
          🌸 Login with Discord
        </button>
      </div>
    )
  }

  return (
    <div style={{
      padding: '30px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      fontFamily: 'system-ui'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        background: 'rgba(255,255,255,0.1)',
        padding: '15px 25px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {session.user.image && (
            <img
              src={session.user.image}
              alt="Profile"
              style={{ width: 45, height: 45, borderRadius: '50%', border: '3px solid white' }}
            />
          )}
          <div>
            <h2 style={{ margin: 0, color: 'white', fontSize: '20px' }}>
              Welcome, {session.user.name} 💜
            </h2>
            <p style={{ margin: '2px 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
              ฅ^•ﻌ•^ฅ Manage your servers
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          style={{
            padding: '8px 20px',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid white',
            borderRadius: '20px',
            fontWeight: '600'
          }}
        >
          Logout
        </button>
      </div>

      {/* Servers Section */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '25px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#764ba2', margin: '0 0 20px 0', fontSize: '24px' }}>
          Your Servers 🐾
        </h2>

        {error && (
          <p style={{
            color: '#ff1493',
            background: '#ffe4e1',
            padding: '12px',
            borderRadius: '10px'
          }}>
            Error: {error}
          </p>
        )}

        {guilds.length === 0 &&!error && (
          <p style={{ fontSize: '18px', color: '#999', textAlign: 'center', padding: '40px 0' }}>
            No admin servers found... (｡•́︿•̀｡)
          </p>
        )}

        {/* Server Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {guilds.map(guild => (
            <div key={guild.id} style={{
              border: '2px solid #f0f0f0',
              padding: '20px',
              borderRadius: '15px',
              background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(118,75,162,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)'
            }}
            >
              {/* Server Icon + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                {guild.icon? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                    alt={guild.name}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '12px',
                      border: '2px solid #764ba2'
                    }}
                  />
                ) : (
                  <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>🐱</div>
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, color: '#333', fontSize: '16px' }}>{guild.name}</h3>
                  <span style={{
                    fontSize: '11px',
                    background: '#764ba2',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    display: 'inline-block',
                    marginTop: '4px'
                  }}>ADMIN</span>
                </div>
              </div>

              {/* Manage Button - This works now */}
              <button
                onClick={() => router.push(`/dashboard/${guild.id}`)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '14px',
                  boxShadow: '0 4px 10px rgba(255,20,147,0.3)'
                }}
              >
                Manage 🌸
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Cat */}
      <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '30px', color: 'white' }}>
        ฅ^•ﻌ•^ฅ ♡
      </div>
    </div>
  )
}
