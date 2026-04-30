import { useRouter } from 'next/router'
import { useSession } from "next-auth/react"
import { useEffect, useState } from 'react'

export default function ServerDashboard() {
  const router = useRouter()
  const { data: session } = useSession()
  const { id } = router.query
  const [settings, setSettings] = useState({
    welcomeMessage: '',
    welcomeChannel: '',
    welcomeEmbedTitle: '',
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
    .then(data => setSettings(data))
    }
  }, [id])

  const saveSettings = async () => {
    setSaving(true)
    await fetch(`/api/guilds/${id}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!session) {
    return (
      <div style={{
        padding: 50,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{ fontSize: '60px' }}>🐱</div>
          <h1>Please login first</h1>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      padding: 30,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'system-ui'
    }}>
      <button
        onClick={() => router.push('/')}
        style={{
          padding: '10px 20px',
          background: 'white',
          color: '#764ba2',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          marginBottom: '20px',
          fontWeight: '600'
        }}
      >
        ← Back to Servers
      </button>

      <div style={{
        background: 'white',
        color: '#333',
        padding: '30px',
        borderRadius: '20px',
        maxWidth: '700px'
      }}>
        <h1 style={{ color: '#764ba2', marginTop: 0 }}>Server Settings 🐾</h1>
        <p style={{ color: '#999', marginTop: '-10px', marginBottom: '30px' }}>
          Server ID: {id}
        </p>

        {/* WELCOME MESSAGE SECTION */}
        <div style={{
          background: '#f8f9ff',
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '25px',
          border: '2px solid #e0e0ff'
        }}>
          <h2 style={{ color: '#764ba2', marginTop: 0, fontSize: '18px' }}>
            Welcome Message Settings 👋
          </h2>

          {/* Embed Title */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#764ba2' }}>
              Embed Title
            </label>
            <input
              type="text"
              value={settings.welcomeEmbedTitle}
              onChange={(e) => setSettings({...settings, welcomeEmbedTitle: e.target.value})}
              placeholder="Welcome to the server!"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #f0f0f0',
                borderRadius: '10px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Embed Description */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#764ba2' }}>
              Embed Description
            </label>
            <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0' }}>
              Use {'{user}'} for member mention, {'{server}'} for server name
            </p>
            <textarea
              value={settings.welcomeMessage}
              onChange={(e) => setSettings({...settings, welcomeMessage: e.target.value})}
              placeholder="Hey {user}! Welcome to {server} 🐱"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #f0f0f0',
                borderRadius: '10px',
                fontSize: '14px',
                minHeight: '80px',
                fontFamily: 'system-ui',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Embed Color */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#764ba2' }}>
              Embed Color 🎨
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="color"
                value={settings.welcomeEmbedColor}
                onChange={(e) => setSettings({...settings, welcomeEmbedColor: e.target.value})}
                style={{
                  width: '60px',
                  height: '40px',
                  border: '2px solid #f0f0f0',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              />
              <input
                type="text"
                value={settings.welcomeEmbedColor}
                onChange={(e) => setSettings({...settings, welcomeEmbedColor: e.target.value})}
                placeholder="#ff69b4"
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '2px solid #f0f0f0',
                  borderRadius: '10px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Image URL */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#764ba2' }}>
              Welcome Image URL 🖼️
            </label>
            <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0' }}>
              Paste image link from Imgur, Discord, etc.
            </p>
            <input
              type="text"
              value={settings.welcomeImageUrl}
              onChange={(e) => setSettings({...settings, welcomeImageUrl: e.target.value})}
              placeholder="https://i.imgur.com/example.png"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #f0f0f0',
                borderRadius: '10px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            {settings.welcomeImageUrl && (
              <img
                src={settings.welcomeImageUrl}
                alt="Preview"
                style={{
                  marginTop: '10px',
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '10px',
                  border: '2px solid #f0f0f0'
                }}
              />
            )}
          </div>

          {/* Welcome Channel */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#764ba2' }}>
              Welcome Channel ID 📢
            </label>
            <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0' }}>
              Right-click channel → Copy ID (Developer Mode on)
            </p>
            <input
              type="text"
              value={settings.welcomeChannel}
              onChange={(e) => setSettings({...settings, welcomeChannel: e.target.value})}
              placeholder="1234567890123456789"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #f0f0f0',
                borderRadius: '10px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* AUTO ROLE */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#764ba2' }}>
            Auto Role ID 🎭
          </label>
          <p style={{ fontSize: '12px', color: '#999', margin: '0 0 8px 0' }}>
            Role given automatically when someone joins
          </p>
          <input
            type="text"
            value={settings.autoRole}
            onChange={(e) => setSettings({...settings, autoRole: e.target.value})}
            placeholder="1234567890123456789"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #f0f0f0',
              borderRadius: '10px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* PREFIX */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#764ba2' }}>
            Bot Prefix 🤖
          </label>
          <input
            type="text"
            value={settings.prefix}
            onChange={(e) => setSettings({...settings, prefix: e.target.value})}
            placeholder="+"
            maxLength="3"
            style={{
              width: '100px',
              padding: '12px',
              border: '2px solid #f0f0f0',
              borderRadius: '10px',
              fontSize: '14px'
            }}
          />
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          style={{
            padding: '12px 30px',
            background: saved
           ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
              : 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '16px',
            boxShadow: '0 4px 10px rgba(255,20,147,0.3)',
            transition: 'all 0.3s'
          }}
        >
          {saving? 'Saving...' : saved? 'Saved! ✓' : 'Save Settings 🌸'}
        </button>

        <div style={{ marginTop: '30px', fontSize: '30px', textAlign: 'center' }}>
          ฅ^•ﻌ•^ฅ
        </div>
      </div>
    </div>
  )
          }
