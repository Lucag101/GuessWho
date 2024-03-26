import { View, Text, TextInput, TouchableOpacity} from 'react-native';
import Abyss from './Abyss';
import { useNavigation, useFocusEffect,  } from '@react-navigation/native';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import styles from './Styles'
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useGame } from '../context/GameContext';
import {axiosSendAnswers} from '../services/api_connection';
import { Answer } from '../types/types';
import Toast from 'react-native-toast-message';

const QuestionAnswer = () => {
    const navigation = useNavigation();
    let { gameId, rounds, roundNumber, setRoundNumber, answers, setAnswers, playerId, guessRound, setGuessRound} = useGame();
    
    const [timer, setTimer] = useState(45);
    useFocusEffect(
        useCallback(() => {
            const timerInterval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer < 1) {
                        clearInterval(timerInterval);
                        setTimeout(() => {
                            console.log('do end round')
                            endRound();
                        }, 3000); // 5000 milliseconds = 5 seconds
                        return prevTimer; // Return the current timer value without decrementing
                    }
                    return prevTimer - 1; // Decrement the timer
                });
            }, 1000);
            return () => {
                clearInterval(timerInterval);
            };
        },[])
    );

    const endRound = async () => {
        console.log('end round functin')
        //set reponse for that round as the text
        let newAnswer: Answer = {
            gameId: gameId,
            playerId: playerId, 
            roundNumber : rounds[roundNumber].RoundNumber,
            answer : promptResponse,
        };
        console.log(newAnswer);
        let fullAnswerList = [...answers, newAnswer]
        setAnswers(fullAnswerList);
        
        //if not last round then, sets round number to next
        let roundCount = rounds.length - 1;
        let finalRound = rounds[roundCount].RoundNumber;
        let currentRoundId = rounds[roundNumber].RoundNumber;
        const nextRoundNumber = roundNumber + 1;

        if (currentRoundId >= finalRound) {
            //*** axios function here that sends answer list to database and changes activepage to '2' if all players have submitted.
            let answersSent = await axiosSendAnswers(fullAnswerList, playerId, gameId);
            if(answersSent){
                //set the guessRound to 1
                let nextGuessRound = guessRound + 1
                setGuessRound(nextGuessRound)
                setAnswers([])
                console.log('waiting room')
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'WaitingRoom' }],
                });
            } else {
                console.log('didnt work')
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: 'Error submitting answers',
                    text2: 'Please try again in a couple seconds',
                    visibilityTime: 4000,
                    autoHide: true,
                });
            }
        } else {
            setRoundNumber(nextRoundNumber);
            console.log('Questioner')
            navigation.reset({
                index: 0,
                routes: [{ name: 'QuestionAnswer' }],
            });
        }
        
    }

    //Response:
    let [promptResponse, setPromptResponse] = useState('')
    const newResponseInput = useRef(null);
    function submitResponse(){
        console.log('response is:' + promptResponse)
        newResponseInput.current.blur()
    }

    const customSlideInDown = {
        from: {
          translateY: -200, // Start off-screen
        },
        to: {
          translateY: 0, // End at its natural position
        },
    };

    return(
        <Abyss mode={'light'} >
            <View style={[styles.main]}>
                <View style={styles.promptHolder}>
                    <Text style={[styles.promptRoundHeader]}>Prompt {rounds[roundNumber].RoundNumber}</Text>
                    <View style={[styles.timerBox]}>
                            <Text style={[styles.timer]}>{timer}</Text>
                    </View>
                    <Animatable.View
                            style={[styles.titleBox]}
                            // animation={customSlideInDown}
                            // iterationCount={1} 
                            direction="normal" 
                            duration={600} // Duration in milliseconds
                            useNativeDriver={true}
                            delay={200}
                        >
                            <Text style={[styles.instructionText]} >{rounds[roundNumber]?.Prompt ? rounds[roundNumber].Prompt : ""} </Text>
                    </Animatable.View>
                
                </View>
                <View style={styles.adderBox}>
                    <TextInput
                        ref = {newResponseInput}
                        style={[styles.inputBox, styles.inputBoxQuestion]}
                        onChangeText={setPromptResponse}
                        value={promptResponse}
                        placeholder="Response..."
                        placeholderTextColor="white"
                        maxLength={120}
                        autoCapitalize="sentences"
                        autoFocus={true}
                        // returnKeyType="done"
                        // onKeyPress={(newQuestion) => console.log(newQuestion)}
                        onSubmitEditing={() => submitResponse()}
                    />
                    <TouchableOpacity style={styles.promptSubmitButton} onPress={endRound}>
                        <Text style={{color:'blue'}} >
                            <Icon name="check" size={30} color="white" />
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Abyss>
    )
};

export default QuestionAnswer;