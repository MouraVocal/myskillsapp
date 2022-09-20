import { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { sync } from '../../databases/sync'

export const SyncIndicator = () => {
  const [syncState, setSyncState] = useState('Syncing data...')

  useEffect(() => {
    sync()
      .then(() => setSyncState(''))
      .catch(() => setSyncState('Sync failed!'))
  }, [])

  if (!syncState) return null

  return (
    <View style={syncStyles.container}>
      <Text style={syncStyles.text}>{syncState}</Text>
    </View>
  )
}

export const syncStyles = {
  container: {
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#121214'
  },
  text: {
    color: '#FFFFFF'
  }
}
