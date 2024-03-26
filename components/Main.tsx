import {Text, View, Button, TouchableOpacity, TouchableHighlight, TextInput } from 'react-native';
import styles from './Styles'
import React, { useCallback, useMemo, useRef, useState, useEffect, } from 'react';
import Popup from './Popup'
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, interpolateColor } from "react-native-reanimated";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { axiosMakeNewGame, axiosAddNewPlayer, axiosGetPlayerCount, axiosStartGame } from '../services/api_connection'
import Abyss from './Abyss';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetBackgroundProps
} from '@gorhom/bottom-sheet';
import { useGame } from '../context/GameContext';
import Toast from 'react-native-toast-message';


export default function Main() {
  const [pageType, setPageType] = useState(null);
  const navigation = useNavigation();
  let { gameId, setGameId, setPlayerId } = useGame();
  
  //____POPUPMODAL Methods____
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['25%', '90%'], []);
  const handlePresentModalPress = useCallback((type) => {
    console.log('open New Game Modal');
    setPageType(type)
    setInputText(''); 
    setGameCode('');
    setPlayersJoined(1)
    setIsOpenGameCodePage(false);
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // _________NEW GAME POPUP_______
  const [newGameIsOpen, setNewGameIsOpen] = useState(false);
  const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
    style,
    animatedIndex,
  }) => {
    //#region styles
    const containerAnimatedStyle = useAnimatedStyle(() => ({
      // @ts-ignore
      backgroundColor: interpolateColor(
        animatedIndex.value,
        [0, 1],
        ['#45317d', '#2b1a59']
      ),
      borderRadius: 30,
    }));
    const containerStyle = useMemo(
      () => [style, containerAnimatedStyle],
      [style, containerAnimatedStyle]
    );
    return <Animated.View pointerEvents="none" style={containerStyle} />;
  };

  const [inputText, setInputText] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [isOpenGameCodePage, setIsOpenGameCodePage] = useState(false);
  const [newGameCode, setNewGameCode] = useState('');
  // const [gameId, setGameId] = useState(null);

  const makeNewGame = async () => {
    if (inputText.trim().length > 0) {
      const [currentGameCode, newGameId, playerId, success] = await axiosMakeNewGame(inputText);
      if (success){
        console.log('game code is: ' + currentGameCode)
        setNewGameCode(currentGameCode);
        console.log('real new game Id is' + newGameId)
        setGameId(newGameId);
        setPlayerId(playerId);
        setIsOpenGameCodePage(true);
      } else {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error creating new game',
          text2: 'Please try again',
          visibilityTime: 4000,
          autoHide: true,
      });
      }
    } else {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'You must enter your name',
        visibilityTime: 3000,
        autoHide: true,
    });
    }
  };

  //begins process that runs every 7 seconds to see how many players have joined
  useFocusEffect(
    useCallback(() => {
      if (gameId != null){
        const intervalId = setInterval(() => {
          checkPlayersJoined(gameId);
        }, 10000);
        return () => clearInterval(intervalId);
      }
    },[gameId])
  );

  const [playersJoined, setPlayersJoined] = useState(1);
  const checkPlayersJoined = async (gameId) => {
    const playerCount = await axiosGetPlayerCount(gameId);
    // console.log('player count is: ' + playerCount)
    if (playerCount != playersJoined){
      console.log(playerCount + ' player/s have joined the game')
      setPlayersJoined(playerCount);
    }
  };

  function setGameCodeWithAutoSpace(text){
    let newText = text
    if (text.length === 5 && text[4] !== ' ') {
      newText = text.slice(0, 4) + ' ' + text[4];
    }
    setGameCode(newText);
  }

  const joinGame = async () => {
    let stripGameName = inputText.replace(/ /g, '')
    if (stripGameName.length > 0 && (gameCode.length === 9)) {
      console.log(inputText + " wants to join game with code: " + gameCode);
      
      const {playerAdded, newGameId, playerId, error} = await axiosAddNewPlayer(gameCode, inputText);
      if (playerAdded) {
        //do something with gameId - save it to global!
        console.log('player added to game with id: ' + newGameId);
        setGameId(newGameId);
        setPlayerId(playerId);
        
        //navigation.navigate("QuestionAdder"); // actually open waiting page!
        navigation.navigate("WaitingRoom");
      } else {
        console.log('error while adding da player')
        console.log(error)
        Toast.show({
          type: 'error',
          position: 'top',
          text1: error,
          text2: 'Please try again',
          visibilityTime: 4000,
          autoHide: true,
      });
      }
      
    }
  };

  const startGame = async () => {
    console.log('!!!!!start game')
    const {gameStarted, error} = await axiosStartGame(gameId);
    if (gameStarted) {
      navigation.navigate("Instructions");
    } else {
      console.log(error)
      Toast.show({
        type: 'error',
        position: 'top',
        text1: error,
        visibilityTime: 4000,
        autoHide: true,
    });
      // also have it open a error message that pops down from the top of the screen for all incorrect things like too many players, etc
    }

  }

  //____________MINI VIEWS___________
  const nameInput = () => {
    return (
      <TextInput
        style={styles.inputBox}
        onChangeText={setInputText}
        value={inputText}
        placeholder="Enter (real) name..."
        placeholderTextColor="white"
        maxLength={25}
      />
    )
  }

  const codeInput = () => {
    return (
      <TextInput
        style={styles.inputBox}
        onChangeText={(text) =>{setGameCodeWithAutoSpace(text)}}
        value={gameCode}
        placeholder="Game Code..."
        placeholderTextColor="white"
        maxLength={9}
        autoCapitalize="characters"
      />
    )
  }

  //__________SUB VIEWS___________

  const newGamePopUp = () => {
    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundComponent={CustomBackground}
        >
        {/* this line is causing odd keyboard unselect */}
        {pageType == "newGame" ? newGameView() : joinGameView()}

      </BottomSheetModal>
    )
  }

  const newGameView = () => {
    return  (
      <View style={[styles.main]}>
         { !isOpenGameCodePage ?
          (<View style={styles.newGamePopup}>
            {nameInput()}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.slightButton, styles.slightButtonAdjust]} onPress={makeNewGame}>
                  <Text style={[styles.buttonText]}>&#8594;</Text>
              </TouchableOpacity>
            </View>
          </View>)
          : 
          ( <View style={[styles.newGamePopup, styles.main]}>
              
              <Text style={styles.textInput}>Game Code</Text>
              <Text style={[ styles.header, styles.gameCode,]}>{newGameCode}</Text>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.slightButton}>
                    <Text style={[styles.buttonText]} onPress={startGame}>Start</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.playerCountText]}>{playersJoined}/8 players</Text>
            </View>
          )
        }
      </View>
    )
  };

  const joinGameView = () => {
    return  (
      <View style={[styles.main]}>
        <View style={styles.newGamePopup}>
              {nameInput()}
              {codeInput()}
              
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.slightButton} onPress={joinGame}>
                    <Text style={[styles.buttonText]}>Join</Text>
                </TouchableOpacity>
              </View>
        </View>
      </View>
    )
  };

  // _______MAIN PAGE________
  return (
    <BottomSheetModalProvider>
      <Abyss mode={'dark'}>
        {/* <LinearGradient
          colors={['#080a2b', '#370a4a']}
          style={styles.background}
          > */}
          
          <View style={styles.background}>
            <Text style={styles.header}>Guess Who?</Text>
            <TouchableOpacity style={[styles.button, styles.newButton]} onPress={() => handlePresentModalPress("newGame")}>
                <Text style={[styles.buttonText, styles.newText]}>New Game</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.joinButton]} onPress={() => handlePresentModalPress("joinGame")}>
                <Text style={[styles.buttonText, styles.joinText]}>Join Game</Text>
            </TouchableOpacity>

            {newGamePopUp()}
          </View>
        </Abyss>
        {/* </LinearGradient> */}
    </BottomSheetModalProvider>
  );

}