// Temporary storage - later we can connect MongoDB
let serverSettings = {}

export default async function handler(req, res) {
  const { id } = req.query

  // GET - Load settings
  if (req.method === 'GET') {
    const settings = serverSettings[id] || {
      welcomeMessage: 'Welcome {user} to {server}! 🐱',
      welcomeChannel: '',
      welcomeEmbedTitle: 'Welcome! 👋',
      welcomeEmbedColor: '#ff69b4',
      welcomeImageUrl: '',
      autoRole: '',
      prefix: '+'
    }
    return res.status(200).json(settings)
  }

  // POST - Save settings
  if (req.method === 'POST') {
    const {
      welcomeMessage,
      welcomeChannel,
      welcomeEmbedTitle,
      welcomeEmbedColor,
      welcomeImageUrl,
      autoRole,
      prefix
    } = req.body

    serverSettings[id] = {
      welcomeMessage,
      welcomeChannel,
      welcomeEmbedTitle,
      welcomeEmbedColor,
      welcomeImageUrl,
      autoRole,
      prefix
    }
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
