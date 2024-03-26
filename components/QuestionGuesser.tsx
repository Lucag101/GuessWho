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

//add functionality that checks game for round if we are in stage 1
const QuestionGuesser = ({route}) => {
    let { roundAnswers, roundPrompt } = route.params;
    let { guessRound, setGuessRound, allPlayers, setAllPlayers, playerId, gameId } = useGame();
    let [allResponses, setAllResponses] = useState(roundAnswers || []);
    const navigation = useNavigation();

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

    const [selectedResponse, setSelectedResponse] = useState(null); 
    const guessContainer = (response, index) => {
        return(
            <Animatable.View
            key={response.answerId}
            // animation="slideInUp"
            animation={ customSlideInUp}
            iterationCount={1} 
            direction="normal" 
            duration={1000}
            delay={index * 200}
            useNativeDriver={true}
            >
                { response.guessPlayerName && (
                    <View style={[styles.nameTag, index % 2 === 0 ? styles.nameLeft : styles.nameRight]}>
                        <Text style={[styles.nameTagText]} key={response.answerId}> {response.guessPlayerName}</Text>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.voteBox}
                    onPress={() => voteFor(response)}
                >
                    <Icon 
                        name = {response.favorite ? "thumbs-up" : "thumbs-o-up"} 
                        size={35} 
                        color="#395dfa"
                     />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setSelectedResponse(response)}
                    style={styles.guessBox}
                >
                    <Text style={[styles.question, { color: 'black'}]} key={response.answerId}> {response.response} </Text>
                </TouchableOpacity>
            </Animatable.View>
        )
    };

    const voteFor = (response) => {
    
        // Update the response with the new favorite status
        setAllResponses(currentResponses => currentResponses.map(currentResponse => {
            if (currentResponse.answerId === response.answerId) {
                return { ...currentResponse, favorite: !currentResponse.favorite };
            } else if (currentResponse.favorite) {
                return { ...currentResponse, favorite: false };
            }
            return currentResponse;
        }));
    
    };
    
    const closeOutRound = async () => {
        //send allResponses to the server
        //*******  last issue is that both this and the answer submitter incrment round number */
        const guessesWereSent = await axiosSendGuesses(allResponses, playerId, gameId);

        if(guessesWereSent){
            
            //reset AllPlayers to have taken be false
            setAllPlayers(currentPlayers => {
                return currentPlayers.map(player => {
                    return { ...player, taken: false };
                });
            });

            //set round up one ahead and go to waiting room
            navigation.navigate("WaitingRoom");
        } else {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error sending in your guesses.',
                text2: 'Wait and try again.',
                visibilityTime: 4000,
                autoHide: true,
            });
        }

    };

    const selectPlayer = (playerId) => {
        // Update the guessPlayerId for the response
        if (selectedResponse) {
            
            setAllPlayers(currentPlayers => {
                return currentPlayers.map(player => {
                    // Check if this player was previously selected and update accordingly
                    if (player.playerId === selectedResponse.guessPlayerId) {
                        return { ...player, taken: false };
                    } else if (player.playerId === playerId) {
                        // Mark the newly selected player as taken
                        return { ...player, taken: true };
                    }
                    return player; // No change for other players
                });
            });

            // Update the selected response with the new guessPlayerId
            setAllResponses(currentResponses => currentResponses.map(response => {
                if (response.answerId === selectedResponse.answerId) {
                    return { ...response, guessPlayerId: playerId, guessPlayerName: allPlayers.find(player => player.playerId === playerId).playerName};
                } else if (response.guessPlayerId === playerId) {
                    return { ...response, guessPlayerId: null, guessPlayerName: null };
                }
                return response;
            }));
        }

        // Close the modal
        setSelectedResponse(null);
    };

    return(
        <Abyss mode={'light'}>
            <View style={[styles.main,  {position: 'relative'}]}>
                <View style={[styles.promptHolder2]}>
                    <Text style={[styles.roundHeader]}>Round {guessRound}</Text>
                    <Animatable.View
                        style={[styles.titleBox]}
                        animation={customSlideInDown}
                        // iterationCount={1} 
                        direction="normal" 
                        duration={600} // Duration in milliseconds
                        useNativeDriver={true}
                        delay={200}
                    >
                        <Text style={[styles.instructionText]}> {roundPrompt} </Text>
                    </Animatable.View>


                    <ScrollView contentContainerStyle={[styles.allAnswersBox]} bounces={true} alwaysBounceVertical={true} >
                        {allResponses.map((response, index) => {
                            return guessContainer(response, index);
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
                                <TouchableOpacity
                                    style={styles.guessSubmitButton}
                                    onPress={() => closeOutRound()}
                                >
                                    <Text style={{fontSize: 30, color: 'white',}}>Submit</Text>
                                </TouchableOpacity>
                            </Animatable.View>
                        </View>
                    </ScrollView>
                </View>
            </View>

            <Modal
                animationType="none"
                transparent={true}
                visible={!!selectedResponse}
                onRequestClose={() => setSelectedResponse(null)}
            >
                <View style={styles.choosePlayerModal}>
                    <View style={styles.modalInnerContent}>
                        <Text  style={[styles.overheadText,{ fontSize: 22, marginLeft:20}]}>Who said</Text>
                        <Text style={[styles.overheadText]}>
                            "{selectedResponse?.response}"?
                            {/* <Text  style={[{ fontSize: 30}]}>?</Text> */}
                        </Text>
                        
                        <View style={styles.playersList}>
                            {allPlayers.map((player, index) => (
                                <TouchableOpacity
                                    key={player.playerId}
                                    onPress={() => selectPlayer(player.playerId)}
                                    // disabled={player.taken}
                                >
                                    <Text style={[styles.playerName, player.taken && styles.takenPlayer]}>
                                        {player.playerName}
                                    </Text>
                                    <View style={[styles.underliner, index % 2 == 0 && styles.underlinerShort]} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        </Abyss>
    )
};

export default QuestionGuesser;