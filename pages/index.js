import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const [guilds, setGuilds] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/guilds')
      .then(res => res.json())
      .then(data => {
        console.log('Guilds data:', data)
        setGuilds(data.guilds || [])
        setLoading(false)
      })
      .catch(err => {
        console.log('Failed to load guilds:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{ background: '#1a1a1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'system-ui' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🐱</div>
          <div style={{ fontSize: '20px' }}>Loading your servers...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b2e 100%)', minHeight: '100vh', padding: '40px 20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ color: '#ff69b4', marginBottom: '10px', fontSize: '48px', fontWeight: '800' }}>
            Ukiyo Bot Dashboard
          </h1>
          <p style={{ color: '#aaa', fontSize: '18px' }}>
            Manage your Discord server with style ✨
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {guilds.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', background: '#2a2a2a', padding: '60px 20px', borderRadius: '16px', border: '2px dashed #444' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>😿</div>
              <div style={{ fontSize: '20px', marginBottom: '10px' }}>No servers found</div>
              <div style={{ fontSize: '14px' }}>Make sure the bot is in your server</div>
            </div>
          ) : (
            guilds.map(guild => (
              <div 
                key={guild.id} 
                style={{ 
                  background: 'linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%)', 
                  padding: '25px', 
                  borderRadius: '16px', 
                  border: '2px solid #ff69b4',
                  boxShadow: '0 8px 32px rgba(255, 105, 180, 0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  {guild.icon ? (
                    <img 
                      src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`} 
                      alt={guild.name}
                      style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid #ff69b4' }}
                    />
                  ) : (
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #ff69b4, #ff1493)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', border: '3px solid #ff69b4' }}>
                      {guild.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ color: 'white', margin: 0, fontSize: '20px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {guild.name}
                    </h3>
                    <p style={{ color: '#888', margin: '5px 0 0 0', fontSize: '14px' }}>
                      👥 {guild.memberCount || 0} members
                    </p>
                  </div>
                </div>
                
                {/* YE HAI FIX - window.location.href USE KIYA */}
                <button 
                  onClick={() => {
                    console.log('Opening dashboard for:', guild.id)
                    window.location.href = `/dashboard/${guild.id}`
                  }}
                  style={{ 
                    width: '100%', 
                    background: 'linear-gradient(135deg, #ff69b4, #ff1493)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '14px', 
                    borderRadius: '10px', 
                    cursor: 'pointer', 
                    fontWeight: '700',
                    fontSize: '16px',
                    boxShadow: '0 4px 15px rgba(255, 105, 180, 0.4)'
                  }}
                >
                  ⚙️ Manage Server
                </button>
              </div>
            ))
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '60px', color: '#666', fontSize: '14px' }}>
          Made with 💖 for Ukiyo Bot
        </div>
      </div>
    </div>
  )
                    }
