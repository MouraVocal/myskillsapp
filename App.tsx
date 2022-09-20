import 'react-native-gesture-handler'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'

import { StatusBar } from 'expo-status-bar'
import { Home } from './src/screens/Home'
import { SyncIndicator } from './src/components/SyncIndicator'

function App() {
  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <SyncIndicator />
      <Home />
    </>
  )
}

export default gestureHandlerRootHOC(App)
