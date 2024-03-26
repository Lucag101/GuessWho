import { View, Text} from 'react-native';
import Abyss from './Abyss';
import { useEffect, useState, useCallback, useRef } from 'react';
import styles from './Styles'
import { useNavigation, useFocusEffect, useRoute, useIsFocused } from '@react-navigation/native';
import { axiosCheckGamePage, axiosRetrieveGameRounds, axiosRetrievePlayerAnswers, axiosRetrieveAllPlayers, axiosCheckGuessRound, axiosRetrievePlayerScores } from '../services/api_connection';
import { useGame } from '../context/GameContext';

//add functionality that checks game for round if we are in stage 1
const WaitingRoom = () => {
    const { gameId, pageNumber, setPageNumber, setRounds, setRoundNumber, playerId, guessRound, setGuessRound, allPlayers, setAllPlayers} = useGame();
    const route = useRoute();
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const isFirstRender = useRef(true);

    useFocusEffect(
        useCallback(() => {
            const intervalId = setInterval(() => {
                console.log('checking game page')
                checkGamePage();
            }, 10000);
            return () => clearInterval(intervalId);
        },[pageNumber, guessRound])
    );

    
    const checkGamePage = async () => {
        console.log('currentGamePage is ' + pageNumber)

        // if (pageNumber != 2 && pageNumber != 4){
            const {pageChanged, currentPage} = await axiosCheckGamePage(pageNumber, gameId);
            // console.log('player count is: ' + playerCount)
            console.log('game page might change from  ' + pageNumber + ' to ' + currentPage)
            console.log('isFocused: ' + isFocused)
            if (pageChanged){
                console.log('page is indeed different!')
                let newPage = currentPage;
                setPageNumber(newPage);
            } else {
        // } else {
        //     console.log('Instead of checking page, we will instead check guess round change')
        //     console.log('current guessround is: ' + guessRound)
                if (pageNumber === 2 || pageNumber === 4){
                    let {guessRoundChanged, newGuessRound} = await axiosCheckGuessRound(guessRound, gameId);
                    console.log('guess round changing from  ' + guessRound + ' to ' + newGuessRound)
                    if (guessRoundChanged){
                        console.log('guess round is indeed different!')
                        setGuessRound(newGuessRound);
                    }
                };
            };

        // }
    }

    useEffect(() => {
        console.log("working just fine **wink**")
        console.log('routeName :' + route.name)
        const performGuessRoundOperation = async () => {
            if (isFocused && (pageNumber === 2 || pageNumber === 4)){
            
                const {scoresRetrieved, playerScores} = await axiosRetrievePlayerScores(gameId, (guessRound-1));

                if (scoresRetrieved) {
                    navigation.navigate("DisplayScores", {finalResults: playerScores, scoresForRound: guessRound-1});
                }
            };
        }

        performGuessRoundOperation().catch(console.error);
    },[guessRound])

    useEffect(() => {

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const performPageSpecificOperations = async () => {
            console.log('currentGamePage is ' + pageNumber); 
            
            if (isFocused){
                if (pageNumber === 1){
                    const {roundsRetrieved, rounds} = await axiosRetrieveGameRounds(gameId);
                    if (roundsRetrieved) {
                        setRounds(rounds);
                        
                        //also get list of all players
                        const playerList = await axiosRetrieveAllPlayers(gameId, playerId);
                        setAllPlayers(playerList);

                        //finally move to start of game
                        navigation.navigate("Instructions");
                    }
                }
                if (pageNumber === 2 || pageNumber === 4){
                    const {roundAnswers, roundPrompt} = await axiosRetrievePlayerAnswers(gameId, playerId);
                    // add an axios function here that retrieves All player names, all answers for the rounds and
                    if (roundAnswers){
                        console.log('roundPrompt: ' + roundPrompt)
                        console.log('roundAnswers: ' + roundAnswers)
                        console.log('ddooddddooo, pageNumber: ' + pageNumber)
                        // setGuessRound(1);
                        navigation.navigate("QuestionGuesser", {roundAnswers: roundAnswers, roundPrompt: roundPrompt});
                    }
                }
                if (pageNumber === 3) { // for second set of questions
                    //first I need to show a custom point results
                    const {scoresRetrieved, playerScores} = await axiosRetrievePlayerScores(gameId, (guessRound));
                    if (scoresRetrieved) {
                        navigation.navigate("DisplayScores", {finalResults: playerScores, scoresForRound: guessRound});
                    }
                    // const {roundsRetrieved, rounds} = await axiosRetrieveGameRounds(gameId);
                    // if (roundsRetrieved) {
                    //     setRoundNumber(0);
                    //     setRounds(rounds);
                    //     navigation.navigate("QuestionAnswer");
                    // }
                }
                if (pageNumber === 5){
                    const {scoresRetrieved, playerScores} = await axiosRetrievePlayerScores(gameId, (guessRound));
                    if (scoresRetrieved) {
                        navigation.navigate("DisplayScores", {finalResults: playerScores, scoresForRound: guessRound});
                    }
                }
            };
        };

        performPageSpecificOperations().catch(console.error);
    },[pageNumber])
    
    const [waitDots, setWaitDots] = useState('.');
    useEffect(() => {
        const interval = setInterval(() => {
            setWaitDots(currentDots => currentDots.length > 2 ? '.' : currentDots + '.');
        }, 800);
        return () => clearInterval(interval);
    },[])

    return(
        <Abyss mode={'dark'}>
            <View style={styles.main}>
                <View style={{width: 80, marginLeft: 10}}>
                    <Text style={{fontSize: 100, color: "white", marginTop: -70}}>{waitDots}</Text>
                </View>
            </View>
        </Abyss>
    )
};

export default WaitingRoom;