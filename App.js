import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Main from './components/Main';

export default function App() {
  
  return (
    <View style={globalStyles.mainBody}>
        <GestureHandlerRootView  style={globalStyles.mainBody}>
          <Main/>
        </GestureHandlerRootView>
        <StatusBar style="auto" />
    </View>
  );

}

const globalStyles = StyleSheet.create({
  mainBody: {
    flex: 1,
    // backgroundColor: '#d7d7fc',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },

});
