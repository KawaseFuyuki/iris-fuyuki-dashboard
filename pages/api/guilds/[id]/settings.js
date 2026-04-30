let serverSettings = {}

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    const settings = serverSettings[id] || {
      // 1. WELCOME SETTINGS
      welcomeEnabled: true,
      welcomeMessage: 'Welcome {user} to {server}! 🐱',
      welcomeChannel: '',
      welcomeEmbedTitle: 'Welcome! 👋',
      welcomeEmbedColor: '#ff69b4',
      welcomeImageUrl: '',
      welcomeEmoji: '👋',
      welcomeEmojiCustom: '', // NEW: <:name:id> ya <a:name:id>
      welcomeEmojiType: 'unicode', // NEW: unicode ya custom
      autoRole: '',
      prefix: '+',
      
      // 2. TICKET SYSTEM - MULTIPLE BUTTONS WITH CUSTOM EMOJI
      ticketEnabled: false,
      ticketPanelTitle: 'Support Center 🎫',
      ticketPanelDesc: 'Select a category below to create a ticket',
      ticketPanelColor: '#5865F2',
      ticketPanelChannelId: '',
      ticketTypes: [
        {
          id: 'help',
          name: 'General Help',
          emoji: '🎫',
          emojiCustom: '', // NEW
          emojiType: 'unicode', // NEW
          buttonColor: 'PRIMARY',
          categoryId: '',
          supportRoleId: '',
          description: 'Get help with general questions'
        },
        {
          id: 'prize',
          name: 'Prize Claim',
          emoji: '🎁',
          emojiCustom: '',
          emojiType: 'unicode',
          buttonColor: 'SUCCESS',
          categoryId: '',
          supportRoleId: '',
          description: 'Claim your giveaway prizes'
        }
      ],
      
      // 3. REACTION ROLES WITH CUSTOM EMOJI
      reactionRolesEnabled: false,
      reactionRolesChannelId: '',
      reactionRolesMessageId: '',
      reactionRolesData: [], // [{emoji: '😎', emojiCustom: '', emojiType: 'unicode', roleId: '123'}]
      
      // 4. AUTO MOD
      autoModEnabled: false,
      autoModBadWords: '',
      autoModSpamLimit: 5,
      autoModCapsPercent: 70,
      autoModLinkBlock: true,
      autoModPunishment: 'timeout',
      
      // 5. LOGGING
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
