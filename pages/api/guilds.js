import { getToken } from "next-auth/jwt"

export default async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  if (!token?.accessToken) {
    return res.status(401).json({ error: 'No access token' })
  }

  const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${token.accessToken}` }
  })
  
  if (!guildsRes.ok) {
    return res.status(500).json({ error: 'Failed to fetch guilds' })
  }
  
  const guilds = await guildsRes.json()
  const adminGuilds = guilds.filter(g => (g.permissions & 0x8) === 0x8)
  
  res.status(200).json(adminGuilds)
}
