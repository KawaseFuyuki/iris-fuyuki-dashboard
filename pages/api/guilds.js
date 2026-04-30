import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    })
    
    const guilds = await guildsRes.json()
    const adminGuilds = guilds.filter(g => (g.permissions & 0x20) === 0x20)
    
    res.status(200).json(adminGuilds)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guilds' })
  }
}
