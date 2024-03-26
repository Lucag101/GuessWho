import { View, Text, ScrollView, TouchableOpacity, Modal} from 'react-native';
import Abyss from './Abyss';
import { useEffect, useState, useCallback } from 'react';
import styles from './Styles'
import { useNavigation } from '@react-navigation/native';
import { axiosSendGuesses } from '../services/api_connection';
import { useGame } from '../context/GameContext';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { axiosRetrieveGameRounds, axiosRetrievePlayerAnswers } from '../services/api_connection';

//add functionality that checks game for round if we are in stage 1
const DisplayScores = ({route}) => {
    let { finalResults, scoresForRound } = route.params;
    let { guessRound, setGuessRound, allPlayers, setAllPlayers, playerId, gameId, setRoundNumber, setRounds, pageNumber } = useGame();
    let [allScores, setAllScores] = useState(finalResults || []);

    //let [allScores, setallScores] = useState([{"answer": "Fake answer", "correctGuesses": 0, "favoriteVotes": 1, "isWinner": false, "playerId": 117, "playerName": "Saam", "pointTotal": 4}, {"answer": "Also a fake answer, but it's longer so might be useful", "correctGuesses": 3, "favoriteVotes": 4, "isWinner": false, "playerId": 118, "playerName": "J", "pointTotal": 11}, {"answer": "short answer (kinda)", "correctGuesses": 0, "favoriteVotes": 4, "isWinner": false, "playerId": 119, "playerName": "Stul", "pointTotal": 12}, {"answer": "To neverland and beyond", "correctGuesses": 1, "favoriteVotes": 0, "isWinner": false, "playerId": 120, "playerName": "Jebedi", "pointTotal": 0}, {"answer": "Call books boring and die", "correctGuesses": 3, "favoriteVotes": 0, "isWinner": false, "playerId": 121, "playerName": "Sassy pants", "pointTotal": 0}, {"answer": "Snoozer loozer", "correctGuesses": 2, "favoriteVotes": 2, "isWinner": false, "playerId": 123, "playerName": "Koolaid Sam", "pointTotal": 7}, {"answer": "The rhino queen", "correctGuesses": 0, "favoriteVotes": 0, "isWinner": false, "playerId": 129, "playerName": "Babe ruth's mother is me", "pointTotal": 1}, {"answer": "Sublime", "correctGuesses": 0, "favoriteVotes": 0, "isWinner": false, "playerId": 135, "playerName": "Skar", "pointTotal": 2}])
    console.log('allResults:' + allScores);
    const navigation = useNavigation();
    const [isFinalResults, setIsFinalResults] = useState(false);

    const customSlideInDown = {
        from: {
          translateY: -200,
        },
        to: {
          translateY: 0, 
        },
    };
    const customSlideInUp = {
        from: {
          translateY: 800,
        },
        to: {
          translateY: 0,
        },
    };

    const scoreContainer = (score, index) => {
        return(
            <Animatable.View
            key={score.playerId}
            // animation="slideInUp"
            animation={customSlideInUp}
            iterationCount={1} 
            direction="normal" 
            duration={1000}
            delay={index * 200}
            useNativeDriver={true}
            >
                <View style={[styles.nameTag, styles.nameLeft,{backgroundColor: "#b97fe3", borderColor: "#a36acc",}]}>
                    <Text style={[styles.nameTagText,]} key={score.answerId}> 
                        <Text style={{fontWeight:"bold"}}>Total Points: {score.pointTotal} </Text>
                    </Text>
                </View>

                { !isFinalResults && <View
                    style={styles.favoriteBox}
                    // onPress={() => voteFor(score)}
                >
                    <Text style={styles.favoriteText}>
                        + {score.favoriteVotes} votes
                    </Text>
                </View> }

                { !isFinalResults ?
                    (<TouchableOpacity
                        // onPress={() => setSelectedResponse(score)}
                        style={[styles.guessBox, {backgroundColor: "#b9b6fa", borderColor: "#9e9ae3",}]}
                    >
                        <Text  style={[styles.overheadText,{ fontSize: 30, marginLeft:20}]}>
                            <Text style={{fontWeight:"bold"}}>{score.playerName} </Text>said
                        </Text>
                        <Text style={[styles.question, { color: 'black'}]} key={score.answerId}> "{score.answer}" </Text>
                    </TouchableOpacity>) : (
                        <TouchableOpacity
                        // onPress={() => setSelectedResponse(score)}
                        style={[styles.guessBox, {backgroundColor: "#b9b6fa", borderColor: "#9e9ae3",}]}
                        >
                            <Text style={[styles.question, { color: 'black', fontWeight:"bold"}]} key={score.answerId}> {score.playerName} </Text>
                        </TouchableOpacity>
                    )
                }


                { !isFinalResults && <View
                    style={styles.guessedBox}
                >
                    <Text style={[styles.favoriteText,{color:"#b30b80"}]}> 
                        <Icon name = {"thumbs-down"} size={25}/>
                        <Text> Guessed by {score.correctGuesses} players </Text> 
                    </Text>
                </View> }
            </Animatable.View>
        )
    };
    
    const closeOutScore = async () => {
        if(pageNumber === 2 || pageNumber === 4){
            console.log('displayscore- round 2-4')
            const {roundAnswers, roundPrompt} = await axiosRetrievePlayerAnswers(gameId, playerId);
            if (roundAnswers){
                console.log('tester1%%%- ideally it is senidng me to question guesser')
                console.log('roundPrompt: ' + roundPrompt)
                console.log('roundAnswers: ' + roundAnswers)
                // setGuessRound(guessRound + 1);
                navigation.navigate("QuestionGuesser", {roundAnswers: roundAnswers, roundPrompt: roundPrompt});
            } else {
                    Toast.show({
                        type: 'error',
                        position: 'top',
                        text1: 'Error starting next round.',
                        text2: 'Wait and try again.',
                        visibilityTime: 4000,
                        autoHide: true,
                    });
                }
        } else if (pageNumber === 3){
            //if its round 3, then retrieve game Rounds and navigate to QuestionAnswer
            console.log('displayscore- round 3')
            const {roundsRetrieved, rounds} = await axiosRetrieveGameRounds(gameId);
            if (roundsRetrieved) {
                setRoundNumber(0);
                setRounds(rounds);
                navigation.navigate("QuestionAnswer");
            } else {
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: 'Error beggining next round.',
                    text2: 'Wait and try again.',
                    visibilityTime: 4000,
                    autoHide: true,
                });
            }
        } else if (pageNumber === 5){
           //show final game results  (so just this page all over again but with the final results)
           //*** make everything clear, and set Game to inactive */
           console.log('displayscore - round 5')
           setIsFinalResults(true);
        }


    };

    return(
        <Abyss mode={'light'}>
            <View style={[styles.main,  {position: 'relative'}]}>
                <View style={[styles.promptHolder2]}>
                    { !isFinalResults &&
                        <Text style={[styles.roundHeader]}>Round {scoresForRound}</Text>
                    } 
                    <Animatable.View
                        style={[styles.titleBox, {backgroundColor: "#6d67f0", borderColor: "#514bd1"}]}
                        animation={customSlideInDown}
                        // iterationCount={1} 
                        direction="normal" 
                        duration={600} // Duration in milliseconds
                        useNativeDriver={true}
                        delay={200}
                    >
                        <Text style={[styles.instructionText]}> {isFinalResults ? 'Final Scores' : 'Scores'} </Text>
                    </Animatable.View>


                    <ScrollView contentContainerStyle={[styles.allAnswersBox]} bounces={true} alwaysBounceVertical={true} >
                        {allScores.map((score, index) => {
                            return scoreContainer(score, index);
                        })}
                        
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Animatable.View
                            
                                // animation="slideInUp"
                                animation={ customSlideInUp}
                                iterationCount={1} 
                                direction="normal" 
                                duration={1000}
                                delay={800}
                                useNativeDriver={true}
                                >
                                
                                { !isFinalResults ? (
                                    <TouchableOpacity
                                        style={styles.guessSubmitButton}
                                        onPress={() => closeOutScore()}
                                    >
                                        <Text style={{fontSize: 30, color: 'white',}}>Next</Text>
                                    </TouchableOpacity>
                                    ) : (
                                    <TouchableOpacity
                                        style={styles.guessSubmitButton}
                                        onPress={() => {navigation.navigate("Main")}} //return home
                                    >
                                        <Text style={{fontSize: 30, color: 'white',}}>Finish</Text>
                                    </TouchableOpacity>
                                    )
                                }

                            </Animatable.View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Abyss>
    )
};

export default DisplayScores;