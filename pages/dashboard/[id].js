import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function GuildDashboard() {
  const router = useRouter()
  const { id } = router.query
  const [settings, setSettings] = useState({
    welcomeEnabled: true,
    welcomeMessage: 'Welcome {user} to {server}! 🐱',
    welcomeChannel: '',
    welcomeEmbedTitle: 'Welcome! 👋',
    welcomeEmbedColor: '#ff69b4',
    welcomeImageUrl: '',
    welcomeEmoji: '👋',
    welcomeEmojiCustom: '',
    welcomeEmojiType: 'unicode',
    autoRole: '',
    prefix: '+',
    ticketEnabled: false,
    ticketPanelTitle: 'Support Center 🎫',
    ticketPanelDesc: 'Select a category below to create a ticket',
    ticketPanelColor: '#5865F2',
    ticketPanelChannelId: '',
    ticketTypes: [
      { id: 'help', name: 'General Help', emoji: '🎫', emojiCustom: '', emojiType: 'unicode', buttonColor: 'PRIMARY', categoryId: '', supportRoleId: '', description: 'Get help with general questions' },
      { id: 'prize', name: 'Prize Claim', emoji: '🎁', emojiCustom: '', emojiType: 'unicode', buttonColor: 'SUCCESS', categoryId: '', supportRoleId: '', description: 'Claim your giveaway prizes' }
    ],
    reactionRolesEnabled: false,
    reactionRolesChannelId: '',
    reactionRolesMessageId: '',
    reactionRolesData: [],
    autoModEnabled: false,
    autoModBadWords: '',
    autoModSpamLimit: 5,
    autoModCapsPercent: 70,
    autoModLinkBlock: true,
    autoModPunishment: 'timeout',
    logsEnabled: false,
    logsChannelId: '',
    logJoins: true,
    logLeaves: true,
    logMessages: true,
    logBans: true,
    logKicks: true
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newReactionEmoji, setNewReactionEmoji] = useState('')
  const [newReactionEmojiCustom, setNewReactionEmojiCustom] = useState('')
  const [newReactionEmojiType, setNewReactionEmojiType] = useState('unicode')
  const [newReactionRoleId, setNewReactionRoleId] = useState('')

  useEffect(() => {
    if (id) {
      fetch(`/api/guilds/${id}/settings`)
    .then(res => res.json())
    .then(data => {
          if (data &&!data.error) setSettings(data)
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

  const addReactionRole = () => {
    if ((newReactionEmoji || newReactionEmojiCustom) && newReactionRoleId) {
      setSettings({...settings, reactionRolesData: [...settings.reactionRolesData, { 
        emoji: newReactionEmoji, 
        emojiCustom: newReactionEmojiCustom,
        emojiType: newReactionEmojiType,
        roleId: newReactionRoleId 
      }]})
      setNewReactionEmoji('')
      setNewReactionEmojiCustom('')
      setNewReactionRoleId('')
    }
  }

  const removeReactionRole = (index) => {
    const newData = settings.reactionRolesData.filter((_, i) => i!== index)
    setSettings({...settings, reactionRolesData: newData })
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
    setSettings({...settings, ticketTypes: [...settings.ticketTypes, newType]})
  }

  const updateTicketType = (index, field, value) => {
    const newTypes = [...settings.ticketTypes]
    newTypes[index][field] = value
    setSettings({...settings, ticketTypes: newTypes})
  }

  const removeTicketType = (index) => {
    const newTypes = settings.ticketTypes.filter((_, i) => i!== index)
    setSettings({...settings, ticketTypes: newTypes})
  }

  if (!id) return <div style={{ background: '#1a1a1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading...</div>

  const inputStyle = { width: '100%', padding: '12px', background: '#1a1a1a', border: '1px solid #444', borderRadius: '8px', color: 'white', marginBottom: '20px' }
  const labelStyle = { color: 'white', display: 'block', marginBottom: '8px', fontWeight: '600' }
  const sectionStyle = { marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #444' }

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button onClick={() => router.push('/')} style={{ background: '#333', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px' }}>
          ← Back
        </button>

        <h1 style={{ color: '#ff69b4', marginBottom: '30px' }}>Server Settings</h1>
        
        <div style={{ background: '#2a2a2a', padding: '25px', borderRadius: '12px', border: '1px solid #ff69b4' }}>
          
          {/* 1. WELCOME SECTION */}
          <h2 style={{ color: '#ff69b4', marginBottom: '20px' }}>👋 Welcome Settings</h2>
          
          <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <input type="checkbox" checked={settings.welcomeEnabled} onChange={(e) => setSettings({...settings, welcomeEnabled: e.target.checked})} style={{ width: '20px', height: '20px' }} />
            Enable Welcome Messages
          </label>

          {settings.welcomeEnabled && <>
            <label style={labelStyle}>Embed Title</label>
            <input type="text" value={settings.welcomeEmbedTitle} onChange={(e) => setSettings({...settings, welcomeEmbedTitle: e.target.value})} style={inputStyle} />

            <label style={labelStyle}>Embed Description - Use {'{user}'} and {'{server}'}</label>
            <textarea value={settings.welcomeMessage} onChange={(e) => setSettings({...settings, welcomeMessage: e.target.value})} style={{...inputStyle, minHeight: '100px', resize: 'vertical' }} />

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Embed Color</label>
                <input type="color" value={settings.welcomeEmbedColor} onChange={(e) => setSettings({...settings, welcomeEmbedColor: e.target.value})} style={{ width: '100px', height: '50px', background: '#1a1a1a', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Welcome Emoji</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select value={settings.welcomeEmojiType} onChange={(e) => setSettings({...settings, welcomeEmojiType: e.target.value})} style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #444', borderRadius: '8px', color: 'white' }}>
                    <option value="unicode">Unicode 😎</option>
                    <option value="custom">Custom <:name:id></option>
                  </select>
                  {settings.welcomeEmojiType === 'unicode'? (
                    <input type="text" value={settings.welcomeEmoji} onChange={(e) => setSettings({...settings, welcomeEmoji: e.target.value})} style={{ width: '80px', padding: '12px', background: '#1a1a1a', border: '1px solid #444', borderRadius: '8px', color: 'white', fontSize: '20px', textAlign: 'center' }} maxLength="2" />
                  ) : (
                    <input type="text" value={settings.welcomeEmojiCustom} onChange={(e) => setSettings({...settings, welcomeEmojiCustom: e.target.value})} style={{ flex: 1, padding: '12px', background: '#1a1a1a', border: '1px solid #444', borderRadius: '8px', color: 'white' }} placeholder="<:uki_wave:123456789>" />
                  )}
                </div>
              </div>
            </div>

            <label style={labelStyle}>Welcome Image URL</label>
            <input type="text" value={settings.welcomeImageUrl} onChange={(e) => setSettings({...settings, welcomeImageUrl: e.target.value})} style={{...inputStyle, marginBottom: '10px' }} placeholder="https://i.imgur.com/example.png" />
            {settings.welcomeImageUrl && <img src={settings.welcomeImageUrl} alt="Preview" style={{ maxWidth: '300px', maxHeight: '200px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #444' }} onError={(e) => e.target.style.display = 'none'} />}

            <label style={labelStyle}>Welcome Channel ID</label>
            <input type="text" value={settings.welcomeChannel} onChange={(e) => setSettings({...settings, welcomeChannel: e.target.value})} style={inputStyle} placeholder="123456789012345678" />

            <label style={labelStyle}>Auto Role ID</label>
            <input type="text" value={settings.autoRole} onChange={(e) => setSettings({...settings, autoRole: e.target.value})} style={inputStyle} placeholder="123456789012345678" />
          </>}

          <label style={labelStyle}>Command Prefix</label>
          <input type="text" value={settings.prefix} onChange={(e) => setSettings({...settings, prefix: e.target.value})} style={{...inputStyle, marginBottom: '0' }} placeholder="+" />

          {/* 2. TICKET SYSTEM - MULTIPLE BUTTONS WITH CUSTOM EMOJI */}
          <div style={sectionStyle}>
            <h2 style={{ color: '#ff69b4', marginBottom: '20px' }}>🎫 Ticket System</h2>
            
            <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <input type="checkbox" checked={settings.ticketEnabled} onChange={(e) => setSettings({...settings, ticketEnabled: e.target.checked})} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              Enable Ticket System
            </label>

            {settings.ticketEnabled && <>
              <label style={labelStyle}>Panel Embed Title</label>
              <input type="text" value={settings.ticketPanelTitle} onChange={(e) => setSettings({...settings, ticketPanelTitle: e.target.value})} style={inputStyle} />

              <label style={labelStyle}>Panel Embed Description</label>
              <textarea value={settings.ticketPanelDesc} onChange={(e) => setSettings({...settings, ticketPanelDesc: e.target.value})} style={{...inputStyle, minHeight: '80px', resize: 'vertical' }} />

              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Panel Embed Color</label>
                  <input type="color" value={settings.ticketPanelColor} onChange={(e) => setSettings({...settings, ticketPanelColor: e.target.value})} style={{ width: '100px', height: '50px', background: '#1a1a1a', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Send Panel to Channel ID</label>
                  <input type="text" value={settings.ticketPanelChannelId} onChange={(e) => setSettings({...settings, ticketPanelChannelId: e.target.value})} style={inputStyle} placeholder="Channel ID where ticket panel will be sent" />
                </div>
              </div>

              <label style={labelStyle}>Ticket Types - Buttons</label>
              {settings.ticketTypes.map((type, i) => (
                <div key={type.id} style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #444' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                    <span style={{ color: '#ff69b4', fontWeight: '600' }}>#{i + 1}</span>
                    <button onClick={() => removeTicketType(i)} style={{ marginLeft: 'auto', background: '#f44336', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px', gap: '10px', marginBottom: '10px' }}>
                    <select value={type.emojiType} onChange={(e) => updateTicketType(i, 'emojiType', e.target.value)} style={{ padding: '10px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: 'white' }}>
                      <option value="unicode">Unicode</option>
                      <option value="custom">Custom</option>
                    </select>
                    <input type="text" value={type.name} onChange={(e) => updateTicketType(i, 'name', e.target.value)} style={{ padding: '10px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: 'white' }} placeholder="Button Name" />
                    <select value={type.buttonColor} onChange={(e) => updateTicketType(i, 'buttonColor', e.target.value)} style={{ padding: '10px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: 'white' }}>
                      <option value="PRIMARY">Blue</option>
                      <option value="SUCCESS">Green</option>
                      <option value="DANGER">Red</option>
                      <option value="SECONDARY">Gray</option>
                    </select>
                  </div>

                  {type.emojiType === 'unicode'? (
                    <input type="text" value={type.emoji} onChange={(e) => updateTicketType(i, 'emoji', e.target.value)} style={{...inputStyle, marginBottom: '10px', padding: '10px', width: '80px', fontSize: '20px', textAlign: 'center' }} placeholder="🎫" maxLength="2" />
                  ) : (
                    <input type="text" value={type.emojiCustom} onChange={(e) => updateTicketType(i, 'emojiCustom', e.target.value)} style={{...inputStyle, marginBottom: '10px', padding: '10px' }} placeholder="<:name:123456789> or <a:name:123456789>" />
                  )}

                  <input type="text" value={type.description} onChange={(e) => updateTicketType(i, 'description', e.target.value)} style={{...inputStyle, marginBottom: '10px', padding: '10px' }} placeholder="Button description" />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input type="text" value={type.categoryId} onChange={(e) => updateTicketType(i, 'categoryId', e.target.value)} style={{ padding: '10px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: 'white' }} placeholder="Category ID" />
                    <input type="text" value={type.supportRoleId} onChange={(e) => updateTicketType(i, 'supportRoleId', e.target.value)} style={{ padding: '10px', background: '#2a2a2a', border: '1px solid #444', borderRadius: '6px', color: 'white' }} placeholder="Support Role ID" />
                  </div>
                </div>
              ))}

              <button onClick={addTicketType} style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginBottom: '20px' }}>
                + Add Ticket Type
              </button>

              <button onClick={() => alert('Bot connect hone ke baad ye chalega')} style={{ background: '#5865F2', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginBottom: '20px', display: 'block' }}>
                Send Ticket Panel
              </button>
            </>}
          </div>

          {/* 3. REACTION ROLES WITH CUSTOM EMOJI */}
          <div style={sectionStyle}>
            <h2 style={{ color: '#ff69b4', marginBottom: '20px' }}>🎭 Reaction Roles</h2>
            
            <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <input type="checkbox" checked={settings.reactionRolesEnabled} onChange={(e) => setSettings({...settings, reactionRolesEnabled: e.target.checked})} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              Enable Reaction Roles
            </label>

            {settings.reactionRolesEnabled && <>
              <label style={labelStyle}>Reaction Roles Channel ID</label>
              <input type="text" value={settings.reactionRolesChannelId} onChange={(e) => setSettings({...settings, reactionRolesChannelId: e.target.value})} style={inputStyle} placeholder="Channel ID for reaction roles message" />

              <label style={labelStyle}>Reaction Roles Message ID</label>
              <input type="text" value={settings.reactionRolesMessageId} onChange={(e) => setSettings({...settings, reactionRolesMessageId: e.target.value})} style={inputStyle} placeholder="Message ID to add reactions to" />

              <label style={labelStyle}>Add Reaction Role</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <select value={newReactionEmojiType} onChange={(e) => setNewReactionEmojiType(e.target.value)} style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #444', borderRadius: '8px', color: 'white' }}>
                  <option value="unicode">Unicode</option>
                  <option value="custom">Custom</option>
                </select>
                {newReactionEmojiType === 'unicode'? (
                  <input type="text" value={newReactionEmoji} onChange={(e) => setNewReactionEmoji(e.target.value)} style={{ width: '80px', padding: '12px', background: '#1a1a1a', border: '1px solid #444', borderRadius: '8px', color: 'white', fontSize: '20px', textAlign: 'center' }} placeholder="😎" maxLength="2" />
                ) : (
                  <input type="text" value={newReactionEmojiCustom} onChange={(e) => setNewReactionEmojiCustom(e.target.value)} style={{ flex: 1, minWidth: '200px', padding: '12px', background: '#1a1a1a', border: '1px solid #444', borderRadius: '8px', color: 'white' }} placeholder="<:name:123456789>" />
                )}
                <input type="text" value={newReactionRoleId} onChange={(e) => setNewReactionRoleId(e.target.value)} style={{ flex: 1, minWidth: '150px', padding: '12px', background: '#1a1a1a', border: '1px solid #444', borderRadius: '8px', color: 'white' }} placeholder="Role ID" />
                <button onClick={addReactionRole} style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Add</button>
              </div>

              {settings.reactionRolesData.map((rr, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#1a1a1a', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px', minWidth: '30px' }}>{rr.emojiType === 'unicode'? rr.emoji : '🎨'}</span>
                  <span style={{ flex: 1, color: '#aaa', fontSize: '12px' }}>{rr.emojiType === 'custom'? rr.emojiCustom : rr.roleId}</span>
                  <button onClick={() => removeReactionRole(i)} style={{ background: '#f44336', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
            </>}
          </div>

          {/* 4. AUTO MOD */}
          <div style={sectionStyle}>
            <h2 style={{ color: '#ff69b4', marginBottom: '20px' }}>🛡️ Auto Moderation</h2>
            
            <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <input type="checkbox" checked={settings.autoModEnabled} onChange={(e) => setSettings({...settings, autoModEnabled: e.target.checked})} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              Enable Auto Mod
            </label>

            {settings.autoModEnabled && <>
              <label style={labelStyle}>Bad Words (comma separated)</label>
              <input type="text" value={settings.autoModBadWords} onChange={(e) => setSettings({...settings, autoModBadWords: e.target.value})} style={inputStyle} placeholder="word1, word2, word3" />

              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Spam Limit (msgs/5sec)</label>
                  <input type="number" value={settings.autoModSpamLimit} onChange={(e) => setSettings({...settings, autoModSpamLimit: parseInt(e.target.value)})} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Caps Percent Limit</label>
                  <input type="number" value={settings.autoModCapsPercent} onChange={(e) => setSettings({...settings, autoModCapsPercent: parseInt(e.target.value)})} style={inputStyle} />
                </div>
              </div>

              <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <input type="checkbox" checked={settings.autoModLinkBlock} onChange={(e) => setSettings({...settings, autoModLinkBlock: e.target.checked})} style={{ width: '20px', height: '20px' }} />
                Block Links
              </label>

              <label style={labelStyle}>Punishment</label>
              <select value={settings.autoModPunishment} onChange={(e) => setSettings({...settings, autoModPunishment: e.target.value})} style={inputStyle}>
                <option value="warn">Warn</option>
                <option value="timeout">Timeout 10min</option>
                <option value="kick">Kick</option>
                <option value="ban">Ban</option>
              </select>
            </>}
          </div>

          {/* 5. LOGGING */}
          <div style={sectionStyle}>
            <h2 style={{ color: '#ff69b4', marginBottom: '20px' }}>📝 Logging</h2>
            
            <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <input type="checkbox" checked={settings.logsEnabled} onChange={(e) => setSettings({...settings, logsEnabled: e.target.checked})} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              Enable Logging
            </label>

            {settings.logsEnabled && <>
              <label style={labelStyle}>Logs Channel ID</label>
              <input type="text" value={settings.logsChannelId} onChange={(e) => setSettings({...settings, logsChannelId: e.target.value})} style={inputStyle} placeholder="Channel ID for logs" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={settings.logJoins} onChange={(e) => setSettings({...settings, logJoins: e.target.checked})} /> Log Joins
                </label>
                <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={settings.logLeaves} onChange={(e) => setSettings({...settings, logLeaves: e.target.checked})} /> Log Leaves
                </label>
                <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={settings.logMessages} onChange={(e) => setSettings({...settings, logMessages: e.target.checked})} /> Log Message Delete/Edit
                </label>
                <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={settings.logBans} onChange={(e) => setSettings({...settings, logBans: e.target.checked})} /> Log Bans
                </label>
                <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={settings.logKicks} onChange={(e) => setSettings({...settings, logKicks: e.target.checked})} /> Log Kicks
                </label>
              </div>
            </>}
          </div>

          <button onClick={saveSettings} disabled={saving} style={{ background: saved? '#4CAF50' : '#ff69b4', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: saving? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '16px', transition: 'all 0.3s', marginTop: '30px' }}>
            {saving? 'Saving...' : saved? 'Saved! ✓' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
