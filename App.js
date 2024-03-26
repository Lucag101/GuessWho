import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

//Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './components/Main';
import QuestionAdder from './components/QuestionAdder';
import WaitingRoom from './components/WaitingRoom';
import QuestionAnswer from './components/QuestionAnswer';
import Instructions from './components/Instructions';
import QuestionGuesser from './components/QuestionGuesser';
import DisplayScores from './components/DisplayScores';
import { GameProvider } from './context/GameContext'; 
import Toast from 'react-native-toast-message'; //https://www.npmjs.com/package/react-native-toast-message


const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
      //<GestureHandlerRootView  style={globalStyles.mainBody}>
      <GameProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Main" component={Main} />
                    <Stack.Screen name="QuestionAdder" component={QuestionAdder} />
                    <Stack.Screen name="WaitingRoom"  component={WaitingRoom} />
                    <Stack.Screen name="QuestionAnswer" component={QuestionAnswer} />
                    <Stack.Screen name="QuestionGuesser" component={QuestionGuesser} />
                    <Stack.Screen name="Instructions" component={Instructions} />
                    <Stack.Screen name="DisplayScores" component={DisplayScores} />
                </Stack.Navigator>
            </NavigationContainer>
          {/* <StatusBar style="auto" /> */}
        </GestureHandlerRootView>
        <Toast />
      </GameProvider>
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
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    paddingVertical : '10%',
},

});
