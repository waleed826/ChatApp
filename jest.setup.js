jest.mock('@react-native-firebase/auth', () => {
  const auth = () => ({
    onAuthStateChanged: jest.fn(callback => {
      callback(null)
      return jest.fn()
    }),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  })
  return auth
})

jest.mock('@react-native-firebase/firestore', () => {
  const firestore = () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(async () => ({exists: false})),
        set: jest.fn(),
        update: jest.fn(),
        collection: jest.fn(() => ({
          doc: jest.fn(() => ({})),
          orderBy: jest.fn(() => ({
            limit: jest.fn(() => ({
              onSnapshot: jest.fn(() => jest.fn()),
            })),
          })),
        })),
      })),
      where: jest.fn(() => ({
        onSnapshot: jest.fn(() => jest.fn()),
      })),
      limit: jest.fn(() => ({
        get: jest.fn(async () => ({docs: []})),
      })),
    })),
    batch: jest.fn(() => ({
      set: jest.fn(),
      update: jest.fn(),
      commit: jest.fn(),
    })),
    FieldValue: {
      serverTimestamp: jest.fn(),
    },
  })
  firestore.FieldValue = {
    serverTimestamp: jest.fn(),
  }
  return firestore
})

jest.mock('react-native-vector-icons/Feather', () => 'Icon')
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon')
jest.mock('react-native-vector-icons/Foundation', () => 'Icon')
jest.mock('react-native-safe-area-context', () => {
  return {
    SafeAreaProvider: ({children}) => children,
    useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
  }
})

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}))

jest.mock('@react-navigation/native', () => {
  const React = require('react')
  return {
    NavigationContainer: ({children}) =>
      React.createElement(React.Fragment, null, children),
    useNavigation: () => ({navigate: jest.fn(), goBack: jest.fn()}),
    useRoute: () => ({params: {}}),
  }
})

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({children}) => children,
    Screen: () => null,
  }),
}))

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({children}) => children,
    Screen: () => null,
  }),
}))

