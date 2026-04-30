import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function GuildDashboard() {
  const router = useRouter()
  const { id } = router.query
  const [settings, setSettings] = useState({
    welcomeMessage: 'Welcome {user} to {server}! 🐱',
    welcomeChannel: '',
    welcomeEmbedTitle: 'Welcome! 👋',
    welcomeEmbedColor: '#ff69b4',
    welcomeImageUrl: '',
    autoRole: '',
    prefix: '+'
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (id) {
      fetch(`/api/guilds/${id}/settings`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) setSettings(data)
        })
        .catch(err => console.log('Failed to load settings:', err))
    }
  }, [id])

  const saveSettings = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/guilds/${id}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (err) {
      console.log('Save failed:', err)
    }
    setSaving(false)
  }

  if (!id) return <div style={{ background: '#1a1a1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading...</div>

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button 
          onClick={() => router.push('/')} 
          style={{ 
            background: '#333', 
            color: 'white', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '8px', 
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Back
        </button>

        <h1 style={{ color: '#ff69b4', marginBottom: '30px' }}>Server Settings</h1>
        
        <div style={{ background: '#2a2a2a', padding: '25px', borderRadius: '12px', border: '1px solid #ff69b4' }}>
          
          <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Embed Title
          </label>
          <input
            type="text"
            value={settings.welcomeEmbedTitle}
            onChange={(e) => setSettings({...settings, welcomeEmbedTitle: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: '#1a1a1a', 
              border: '1px solid #444', 
              borderRadius: '8px', 
              color: 'white',
              marginBottom: '20px'
            }}
            placeholder="Welcome! 👋"
          />

          <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Embed Description - Use {'{user}'} and {'{server}'}
          </label>
          <textarea
            value={settings.welcomeMessage}
            onChange={(e) => setSettings({...settings, welcomeMessage: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: '#1a1a1a', 
              border: '1px solid #444', 
              borderRadius: '8px', 
              color: 'white',
              minHeight: '100px',
              marginBottom: '20px',
              resize: 'vertical'
            }}
            placeholder="Welcome {user} to {server}! 🐱"
          />

          <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Embed Color
          </label>
          <input
            type="color"
            value={settings.welcomeEmbedColor}
            onChange={(e) => setSettings({...settings, welcomeEmbedColor: e.target.value})}
            style={{ 
              width: '100px', 
              height: '50px', 
              background: '#1a1a1a', 
              border: '1px solid #444', 
              borderRadius: '8px', 
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          />

          <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Welcome Image URL
          </label>
          <input
            type="text"
            value={settings.welcomeImageUrl}
            onChange={(e) => setSettings({...settings, welcomeImageUrl: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: '#1a1a1a', 
              border: '1px solid #444', 
              borderRadius: '8px', 
              color: 'white',
              marginBottom: '10px'
            }}
            placeholder="https://i.imgur.com/example.png"
          />
          {settings.welcomeImageUrl && (
            <img 
              src={settings.welcomeImageUrl} 
              alt="Preview" 
              style={{ 
                maxWidth: '300px', 
                maxHeight: '200px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                border: '1px solid #444'
              }}
              onError={(e) => e.target.style.display = 'none'}
            />
          )}

          <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Welcome Channel ID
          </label>
          <input
            type="text"
            value={settings.welcomeChannel}
            onChange={(e) => setSettings({...settings, welcomeChannel: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: '#1a1a1a', 
              border: '1px solid #444', 
              borderRadius: '8px', 
              color: 'white',
              marginBottom: '20px'
            }}
            placeholder="123456789012345678"
          />

          <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Auto Role ID
          </label>
          <input
            type="text"
            value={settings.autoRole}
            onChange={(e) => setSettings({...settings, autoRole: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: '#1a1a1a', 
              border: '1px solid #444', 
              borderRadius: '8px', 
              color: 'white',
              marginBottom: '20px'
            }}
            placeholder="123456789012345678"
          />

          <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Command Prefix
          </label>
          <input
            type="text"
            value={settings.prefix}
            onChange={(e) => setSettings({...settings, prefix: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: '#1a1a1a', 
              border: '1px solid #444', 
              borderRadius: '8px', 
              color: 'white',
              marginBottom: '25px'
            }}
            placeholder="+"
          />

          <button 
            onClick={saveSettings} 
            disabled={saving}
            style={{ 
              background: saved ? '#4CAF50' : '#ff69b4', 
              color: 'white', 
              border: 'none', 
              padding: '12px 30px', 
              borderRadius: '8px', 
              cursor: saving ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.3s'
            }}
          >
            {saving ? 'Saving...' : saved ? 'Saved! ✓' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
                }
