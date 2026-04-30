let serverSettings = {}

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    const settings = serverSettings[id] || {
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
    }
    return res.status(200).json(settings)
  }

  if (req.method === 'POST') {
    serverSettings[id] = req.body
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
