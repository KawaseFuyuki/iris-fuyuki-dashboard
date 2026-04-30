import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function GuildDashboard() {
  const router = useRouter()
  const { id } = router.query
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!id) return

    fetch(`/api/guilds/${id}/settings`)
   .then(res => res.json())
   .then(data => {
        setSettings(data || {})
        setLoading(false)
      })
   .catch(err => {
        console.log('Failed to load:', err)
        setSettings({})
        setLoading(false)
      })
  }, [id])

  const saveSettings = async () => {
    if (!settings) return
    setSaving(true)
    try {
      await fetch(`/api/guilds/${id}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.log('Save failed:', err)
    }
    setSaving(false)
  }

  const updateTicketType = (index, field, value) => {
    const newTypes = [...(settings?.ticketTypes || [])]
    if (newTypes[index]) {
      newTypes[index][field] = value
      setSettings({...settings, ticketTypes: newTypes})
    }
  }

  const addTicketType = () => {
    const newType = {
      id: `ticket_${Date.now()}`,
      name: 'New Ticket',
      emoji: '📝',
      emojiCustom: '',
      emojiType: 'unicode',
      buttonColor: 'SECONDARY',
      categoryId: '',
      supportRoleId: '',
      description: 'Custom ticket type'
    }
    setSettings({...settings, ticketTypes: [...(settings?.ticketTypes || []), newType]})
  }

  const removeTicketType = (index) => {
    const newTypes = (settings?.ticketTypes || []).filter((_, i) => i!== index)
    setSettings({...settings, ticketTypes: newTypes})
  }

  if (loading ||!router.isReady) {
    return (
      <div style={{ background: '#1a1a1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'system-ui' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '20px' }}>Loading Dashboard...</div>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div style={{ background: '#1a1a1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'system-ui' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>😿</div>
          <div style={{ fontSize: '20px', marginBottom: '20px' }}>Failed to load settings</div>
          <button onClick={() => router.push('/')} style={{ background: '#ff69b4', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>← Back to Servers</button>
        </div>
      </div>
    )
  }

  const inputStyle = { width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #444', borderRadius: '8px', color: 'white', marginBottom: '20px', boxSizing: 'border-box' }
  const labelStyle = { color: 'white', display: 'block', marginBottom: '8px', fontWeight: '600' }
  const sectionStyle = { marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #444' }

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button onClick={() => router.push('/')} style={{ background: '#333', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px' }}>← Back</button>

        <h1 style={{ color: '#ff69b4', marginBottom: '30px' }}>Server Settings</h1>

        <div style={{ background: '#2a2a2a', padding: '25px', borderRadius: '12px', border: '1px solid #ff69b4' }}>

          <h2 style={{ color: '#ff69b4', marginBottom: '20px' }}>👋 Welcome Settings</h2>

          <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <input type="checkbox" checked={settings.welcomeEnabled || false} onChange={(e) => setSettings({...settings, welcomeEnabled: e.target.checked})} style={{ width: '20px', height: '20px' }} />
            Enable Welcome Messages
          </label>

          <label style={labelStyle}>Embed Title</label>
          <input type="text" value={settings.welcomeEmbedTitle || ''} onChange={(e) => setSettings({...settings, welcomeEmbedTitle: e.target.value})} style={inputStyle} />

          <label style={labelStyle}>Embed Description - Use {'{user}'} and {'{server}'}</label>
          <textarea value={settings.welcomeMessage || ''} onChange={(e) => setSettings({...settings, welcomeMessage: e.target.value})} style={{...inputStyle, minHeight: '100px', resize: 'vertical' }} />

          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div>
              <label style={labelStyle}>Embed Color</label>
              <input type="color" value={settings.welcomeEmbedColor || '#ff69b4'} onChange={(e) => setSettings({...settings, welcomeEmbedColor: e.target.value})} style={{ width: '100px', height: '50px', background: '#1a1a1a', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer' }} />
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={labelStyle}>Welcome Emoji</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select value={settings.welcomeEmojiType || 'unicode'} onChange={(e) => setSettings({...settings, welcomeEmojiType: e.target.value})} style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #444', borderRadius: '8px', color: 'white' }}>
                  <option value="unicode">Unicode 😎</option>
                  <option value="custom">Custom <:name:id></option>
                </select>
                {(settings.welcomeEmojiType || 'unicode') === 'unicode'? (
                  <input type="text" value={settings.welcomeEmoji || ''} onChange={(e) => setSettings({...settings, welcomeEmoji: e.target.value})} style={{ width: '80px', padding: '12px', background: '#1a1a1a', border: '1px solid #444', borderRadius: '8px', color: 'white', fontSize: '20px', textAlign: 'center' }} maxLength="2" />
                ) : (
                  <input type="text" value={settings.welcomeEmojiCustom || ''} onChange={(e) => setSettings({...settings, welcomeEmojiCustom: e.target.value})} style={{ flex: 1, padding: '12px', background: '#1a1a1a', border: '1px solid #444', borderRadius: '8px', color: 'white' }} placeholder="<:uki_wave:123456789>" />
                )}
              </div>
            </div>
          </div>

          <label style={labelStyle}>Welcome Image URL</label>
          <input type="text" value={settings.welcomeImageUrl || ''} onChange={(e) => setSettings({...settings, welcomeImageUrl: e.target.value})} style={inputStyle} placeholder="https://i.imgur.com/example.png" />

          <label style={labelStyle}>Welcome Channel ID</label>
          <input type="text" value={settings.welcomeChannel || ''} onChange={(e) => setSettings({...settings, welcomeChannel: e.target.value})} style={inputStyle} placeholder="123456789012345678" />

          <label style={labelStyle}>Auto Role ID</label>
          <input type="text" value={settings.autoRole || ''} onChange={(e) => setSettings({...settings, autoRole: e.target.value})} style={inputStyle} placeholder="123456789012345678" />

          <label style={labelStyle}>Command Prefix</label>
          <input type="text" value={settings.prefix || '+'} onChange={(e) => setSettings({...settings, prefix: e.target.value})} style={inputStyle} placeholder="+" />

          <div style={sectionStyle}>
            <h2 style={{ color: '#ff69b4', marginBottom: '20px' }}>🎫 Ticket System</h2>

            <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <input type="checkbox" checked={settings.ticketEnabled || false} onChange={(e) => setSettings({...settings, ticketEnabled: e.target.checked})} style={{ width: '20px', height: '20px' }} />
              Enable Ticket System
            </label>

            {settings.ticketEnabled && <>
              <label style={labelStyle}>Panel Title</label>
              <input type="text" value={settings.ticketPanelTitle || ''} onChange={(e) => setSettings({...settings, ticketPanelTitle: e.target.value})} style={inputStyle} />

              <label style={labelStyle}>Panel Description</label>
              <textarea value={settings.ticketPanelDesc || ''} onChange={(e) => setSettings({...settings, ticketPanelDesc: e.target.value})} style={{...inputStyle, minHeight: '80px', resize: 'vertical' }} />

              <label style={labelStyle}>Ticket Types</label>
              {(settings.ticketTypes || []).map((type, i) => (
                <div key={type.id || i} style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #444' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                    <span style={{ color: '#ff69b4', fontWeight: '600' }}>#{i + 1}</span>
                    <button onClick={() => removeTicketType(i)} style={{ marginLeft: 'auto', background: '#f44336', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px', gap: '10px', marginBottom: '10px' }}>
                    <select value={type.emojiType || 'unicode'} onChange={(e) => updateTicketType(i, 'emojiType', e.target.value)} style={{ padding: '10px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: 'white' }}>
                      <option value="unicode">Unicode</option>
                      <option value="custom">Custom</option>
                    </select>
                    <input type="text" value={type.name || ''} onChange={(e) => updateTicketType(i, 'name', e.target.value)} style={{ padding: '10px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: 'white' }} placeholder="Button Name" />
                    <select value={type.buttonColor || 'PRIMARY'} onChange={(e) => updateTicketType(i, 'buttonColor', e.target.value)} style={{ padding: '10px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: 'white' }}>
                      <option value="PRIMARY">Blue</option>
                      <option value="SUCCESS">Green</option>
                      <option value="DANGER">Red</option>
                      <option value="SECONDARY">Gray</option>
                    </select>
                  </div>

                  {(type.emojiType || 'unicode') === 'unicode'? (
                    <input type="text" value={type.emoji || ''} onChange={(e) => updateTicketType(i, 'emoji', e.target.value)} style={{...inputStyle, marginBottom: '10px', padding: '10px', width: '80px', fontSize: '20px', textAlign: 'center' }} placeholder="🎫" maxLength="2" />
                  ) : (
                    <input type="text" value={type.emojiCustom || ''} onChange={(e) => updateTicketType(i, 'emojiCustom', e.target.value)} style={{...inputStyle, marginBottom: '10px', padding: '10px' }} placeholder="<:name:123456789>" />
                  )}

                  <input type="text" value={type.description || ''} onChange={(e) => updateTicketType(i, 'description', e.target.value)} style={{...inputStyle, marginBottom: '10px', padding: '10px' }} placeholder="Description" />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input type="text" value={type.categoryId || ''} onChange={(e) => updateTicketType(i, 'categoryId', e.target.value)} style={{ padding: '10px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: 'white' }} placeholder="Category ID" />
                    <input type="text" value={type.supportRoleId || ''} onChange={(e) => updateTicketType(i, 'supportRoleId', e.target.value)} style={{ padding: '10px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: 'white' }} placeholder="Support Role ID" />
                  </div>
                </div>
              ))}

              <button onClick={addTicketType} style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginBottom: '20px' }}>+ Add Ticket Type</button>
            </>}
          </div>

          <button onClick={saveSettings} disabled={saving} style={{ background: saved? '#4CAF50' : '#ff69b4', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: saving? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '16px', marginTop: '30px' }}>
            {saving? 'Saving...' : saved? 'Saved! ✓' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  )
    }
