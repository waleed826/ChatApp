const AVATARS = [
  require('../assets/images/user1.png'),
  require('../assets/images/user2.png'),
  require('../assets/images/user3.png'),
  require('../assets/images/user4.png'),
  require('../assets/images/user5.png'),
  require('../assets/images/user6.png'),
  require('../assets/images/user7.png'),
  require('../assets/images/user8.png'),
  require('../assets/images/user9.png'),
]

export const getAvatarById = (id = '') => {
  if (!id) {
    return AVATARS[0]
  }
  let hash = 0
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % AVATARS.length
  }
  return AVATARS[hash]
}

export const formatMessageTime = timestamp => {
  if (!timestamp) {
    return ''
  }

  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) {
    return 'Just now'
  }
  if (diffMins < 60) {
    return `${diffMins} min ago`
  }

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  }

  return date.toLocaleDateString()
}
