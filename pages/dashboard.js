import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [guilds, setGuilds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      fetch('/api/guilds')
      .then(res => res.json())
      .then(data => {
          setGuilds(data || [])
          setLoading(false)
        })
      .catch(() => setLoading(false))
    }
  }, [status])

  if (status === "loading") return <div style={{minHeight:'100vh', background:'linear-gradient(135deg, #831843, #581c87)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center'}}>Loading...</div>
  if (!session) return <div style={{minHeight:'100vh', background:'linear-gradient(135deg, #831843, #581c87)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center'}}>Please login first</div>

  return (
    <div style={{minHeight:'100vh', background:'linear-gradient(135deg, #831843, #581c87, #831843)', color:'#fff', padding:'2rem', fontFamily:'system-ui'}}>
      <div style={{maxWidth:'1024px', margin:'0 auto'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2rem'}}>
          <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
            <img src={session.user.image} style={{width:'64px', height:'64px', borderRadius:'50%', border:'2px solid #ec4899'}} />
            <div>
              <h1 style={{fontSize:'1.875rem', fontWeight:'bold', margin:0}}>Welcome, {session.user.name} 💜</h1>
              <p style={{color:'#f9a8d4', margin:0}}>Fuyuki Bot Dashboard</p>
            </div>
          </div>
          <button onClick={() => signOut()} style={{background:'#db2777', padding:'0.5rem 1rem', borderRadius:'0.5rem', border:'none', color:'#fff', cursor:'pointer'}}>Logout</button>
        </div>

        <h2 style={{fontSize:'1.5rem', fontWeight:'600', marginBottom:'1rem'}}>Your Servers</h2>
        {loading? <p>Loading servers...</p> : guilds.length === 0? <p>No admin servers found. Make sure bot is in your server.</p> : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'1rem'}}>
            {guilds.map(guild => (
              <div key={guild.id} style={{background:'rgba(0,0,0,0.3)', padding:'1rem', borderRadius:'0.75rem', border:'1px solid rgba(236,72,153,0.3)'}}>
                <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
                  {guild.icon? (
                    <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} style={{width:'48px', height:'48px', borderRadius:'50%'}} />
                  ) : <div style={{width:'48px', height:'48px', background:'#db2777', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>{guild.name[0]}</div>}
                  <div>
                    <h3 style={{fontWeight:'bold', margin:0}}>{guild.name}</h3>
                    <p style={{fontSize:'0.875rem', color:'#f9a8d4', margin:0}}>Admin</p>
                  </div>
                </div>
                <button style={{marginTop:'0.75rem', width:'100%', background:'#db2777', padding:'0.5rem', borderRadius:'0.5rem', border:'none', color:'#fff', cursor:'pointer'}}>Manage</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
    }
