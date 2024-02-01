import {Text, View, Button, TouchableOpacity, TouchableHighlight, TextInput  } from 'react-native';
import styles from './Styles'
import React, { useCallback, useMemo, useRef, useState } from 'react';
import Popup from './Popup'
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, interpolateColor } from "react-native-reanimated";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetBackgroundProps
} from '@gorhom/bottom-sheet';


export default function Main() {
  const [pageType, setPageType] = useState(null)

  //____POPUPMODAL Methods____
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['25%', '90%'], []);
  const handlePresentModalPress = useCallback((type) => {
    console.log('open New Game Modal');
    setPageType(type)
    setInputText(''); 
    setGameCode('');
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


  const makeNewGame = () => {
    if (inputText.length > 0) {
      console.log("new game with name: " + inputText)

      //First backend call to send name to database and save it.
      
      //Next backend call to create a new game and recieve game code
      
      //display game code in new page and opent that page
      setIsOpenGameCodePage(true);

    }
  };

  const joinGame = () => {
    //check if game code in database
    //if yes, then add name and player and join game
    console.log(inputText + " is joining game")

  };

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
        onChangeText={setGameCode}
        value={gameCode}
        placeholder="Game Code..."
        placeholderTextColor="white"
        maxLength={4}
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
          ( <View style={[styles.newGamePopup,styles.main]}>
              <Text style={styles.textInput}>Game Code</Text>
              <Text style={[ styles.header, styles.gameCode,]}>4G6Y</Text>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.slightButton} onPress={makeNewGame}>
                    <Text style={[styles.buttonText]}>Start</Text>
                </TouchableOpacity>
              </View>

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
        <LinearGradient
          colors={['#080a2b', '#370a4a']}
          style={styles.background}
          >

          <Text style={styles.header}>Guess Who?</Text>
          <TouchableOpacity style={[styles.button, styles.newButton]} onPress={() => handlePresentModalPress("newGame")}>
              <Text style={[styles.buttonText, styles.newText]}>New Game</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.joinButton]} onPress={() => handlePresentModalPress("joinGame")}>
              <Text style={[styles.buttonText, styles.joinText]}>Join Game</Text>
          </TouchableOpacity>

          {newGamePopUp()}

        </LinearGradient>
    </BottomSheetModalProvider>
  );

}