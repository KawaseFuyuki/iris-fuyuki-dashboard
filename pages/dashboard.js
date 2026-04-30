import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [guilds, setGuilds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (status === "authenticated") {
      fetch('/api/guilds')
    .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch servers')
        }
        return res.json()
      })
    .then(data => {
          setGuilds(Array.isArray(data)? data : [])
          setLoading(false)
        })
    .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
    } else if (status === "unauthenticated") {
      setLoading(false)
    }
  }, [status])

  if (status === "loading") {
    return (
      <div style={{
        minHeight:'100vh', 
        background:'linear-gradient(135deg, #831843, #581c87)', 
        color:'#fff', 
        display:'flex', 
        alignItems:'center', 
        justifyContent:'center',
        fontFamily:'system-ui'
      }}>
        Loading...
      </div>
    )
  }
  
  if (!session) {
    return (
      <div style={{
        minHeight:'100vh', 
        background:'linear-gradient(135deg, #831843, #581c87)', 
        color:'#fff', 
        display:'flex', 
        alignItems:'center', 
        justifyContent:'center', 
        flexDirection:'column', 
        gap:'1rem',
        fontFamily:'system-ui'
      }}>
        <p style={{fontSize:'1.25rem'}}>Please login first</p>
        <a href="/api/auth/signin" style={{
          background:'#db2777', 
          padding:'0.75rem 1.5rem', 
          borderRadius:'0.5rem', 
          color:'#fff', 
          textDecoration:'none',
          fontWeight:'600'
        }}>
          Login with Discord
        </a>
      </div>
    )
  }

  return (
    <div style={{
      minHeight:'100vh', 
      background:'linear-gradient(135deg, #831843, #581c87, #831843)', 
      color:'#fff', 
      padding:'2rem', 
      fontFamily:'system-ui'
    }}>
      <div style={{maxWidth:'1024px', margin:'0 auto'}}>
        <div style={{
          display:'flex', 
          alignItems:'center', 
          justifyContent:'space-between', 
          marginBottom:'2rem', 
          flexWrap:'wrap', 
          gap:'1rem'
        }}>
          <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
            {session.user?.image && (
              <img 
                src={session.user.image} 
                style={{
                  width:'64px', 
                  height:'64px', 
                  borderRadius:'50%', 
                  border:'2px solid #ec4899'
                }} 
                alt="Profile"
              />
            )}
            <div>
              <h1 style={{fontSize:'1.875rem', fontWeight:'bold', margin:0}}>
                Welcome, {session.user?.name || 'User'} 💜
              </h1>
              <p style={{color:'#f9a8d4', margin:0}}>Fuyuki Bot Dashboard</p>
            </div>
          </div>
          <button 
            onClick={() => signOut()} 
            style={{
              background:'#db2777', 
              padding:'0.5rem 1rem', 
              borderRadius:'0.5rem', 
              border:'none', 
              color:'#fff', 
              cursor:'pointer',
              fontWeight:'600'
            }}
          >
            Logout
          </button>
        </div>

        <h2 style={{fontSize:'1.5rem', fontWeight:'600', marginBottom:'1rem'}}>Your Servers</h2>
        
        {loading? (
          <p>Loading servers...</p>
        ) : error? (
          <div style={{
            background:'rgba(239,68,68,0.2)', 
            padding:'1rem', 
            borderRadius:'0.5rem',
            border:'1px solid rgba(239,68,68,0.5)'
          }}>
            <p style={{margin:0}}>Error: {error}</p>
            <p style={{margin:'0.5rem 0 0 0', fontSize:'0.875rem'}}>
              Make sure 'guilds' scope is enabled in Discord OAuth
            </p>
          </div>
        ) : guilds.length === 0? (
          <div style={{
            background:'rgba(0,0,0,0.3)', 
            padding:'2rem', 
            borderRadius:'0.75rem',
            textAlign:'center'
          }}>
            <p style={{margin:0}}>No admin servers found</p>
            <p style={{margin:'0.5rem 0 0 0', fontSize:'0.875rem', color:'#f9a8d4'}}>
              Make sure bot is in your server and you have admin permissions
            </p>
          </div>
        ) : (
          <div style={{
            display:'grid', 
            gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', 
            gap:'1rem'
          }}>
            {guilds.map(guild => (
              <div 
                key={guild.id} 
                style={{
                  background:'rgba(0,0,0,0.3)', 
                  padding:'1rem', 
                  borderRadius:'0.75rem', 
                  border:'1px solid rgba(236,72,153,0.3)',
                  backdropFilter:'blur(10px)'
                }}
              >
                <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
                  {guild.icon? (
                    <img 
                      src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} 
                      style={{width:'48px', height:'48px', borderRadius:'50%'}}
                      alt={guild.name}
                    />
                  ) : (
                    <div style={{
                      width:'48px', 
                      height:'48px', 
                      background:'#db2777', 
                      borderRadius:'50%', 
                      display:'flex', 
                      alignItems:'center', 
                      justifyContent:'center',
                      fontWeight:'bold',
                      fontSize:'1.25rem'
                    }}>
                      {guild.name?.[0] || '?'}
                    </div>
                  )}
                  <div>
                    <h3 style={{fontWeight:'bold', margin:0}}>{guild.name || 'Unknown Server'}</h3>
                    <p style={{fontSize:'0.875rem', color:'#f9a8d4', margin:0}}>Admin</p>
                  </div>
                </div>
                <button style={{
                  marginTop:'0.75rem', 
                  width:'100%', 
                  background:'#db2777', 
                  padding:'0.5rem', 
                  borderRadius:'0.5rem', 
                  border:'none', 
                  color:'#fff', 
                  cursor:'pointer',
                  fontWeight:'600'
                }}>
                  Manage
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
            }
