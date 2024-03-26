import axios from 'axios';
import { Answer } from '../types/types';

//For Production
//const API_BASE_URL = 'http://ec2-18-117-75-73.us-east-2.compute.amazonaws.com/';

//for Development
const API_BASE_URL = 'http://192.168.1.8:3000/'; //Ip might change, especially on campus
//const API_BASE_URL = 'http://10.37.137.218:3000/'

const defaultErrorCatcher = (error: any) => {
    if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    } else if (error.request) {
    // The request was made but no response was received
    console.log(error.request);
    } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
    }
    console.log(error.config);
}

export const axiosMakeNewGame = (playerName: string) => {
    console.log(playerName);
    return axios({
        method: 'post',
        url: API_BASE_URL + 'generategamecode',
        headers: { 'Content-Type': 'application/json' },
        data: { 'playerName': playerName },
    }).then((response) => {
        console.log('SUCCESS!!');
        console.log(response.data);
        return [response.data['newGameCode'], response.data['gameId'], response.data['playerId'], true];
        // return {currentGameCode: response.data['new_game_code'], gameId: response.data['game_id']};
    }).catch((error) => {
        console.log('FAILURE!!');
        defaultErrorCatcher(error);
        return [null, null, null, false];
    });
}

export const axiosAddNewPlayer = (gameCode: string, playerName: string) => {
    //axios then recieve back a true or false and
    return axios({
        method: 'post',
        url: API_BASE_URL + 'addplayer',
        headers: { 'Content-Type': 'application/json' },
        data: { 'playerName': playerName, 'gameCode': gameCode},
    }).then((response) => {
        console.log('Player Added!');
        console.log(response.data);
        return {playerAdded: true, newGameId: response.data['gameId'], playerId: response.data['playerId'], error: 'no errors!'};
    }).catch((error) => {
        console.log('Player failed to add!');
        defaultErrorCatcher(error);
        return {playerAdded: false, newGameId: 0, playerId: 0, error: error.response.data['error']};
    });
}

export const axiosGetPlayerCount = (gameId: number ) => {
    return axios({
        method: 'post',
        url: API_BASE_URL + 'checkplayercount',
        headers: { 'Content-Type': 'application/json' },
        data: { 'gameId': gameId},
    }).then((response) => {
        return response.data['player_count'];
    }).catch((error) => {
        console.log('Failed to check playerCount');
        defaultErrorCatcher(error);
        console.log(error.config);
    });
};

export const axiosStartGame = (gameId: number) => {
    return axios({
        method: 'post',
        url: API_BASE_URL + 'startgame',
        headers: { 'Content-Type': 'application/json' },
        data: { 'gameId': gameId},
    }).then(() => {
        return {gameStarted : true, error: 'no errors!'}
    }).catch((error) => {
        console.log('Failed to start game');
        defaultErrorCatcher(error);
        return {gameStarted : false, error: error.response.data['error']}
    });
};

export const axiosCheckGamePage = (pageNumber: number, gameId: number) =>{
    return axios({
        method: 'post',
        url: API_BASE_URL + 'checkgamepage',
        headers: { 'Content-Type': 'application/json' },
        data: {'pageNumber': pageNumber, 'gameId': gameId},
    }).then((response) => {
        console.log('Page changed is: ' + response.data['pageChanged']);
        return {pageChanged: response.data['pageChanged'], currentPage: response.data['currentPageNumber'] }
    }).catch((error) => {
        console.log('Failed to start game');
        defaultErrorCatcher(error);
        return {pageChanged: false, currentPage: 0 }
    });
}


export const axiosRetrieveGameRounds = (gameId: number) => {
    return axios({
        method: 'post',
        url: API_BASE_URL + 'retrieveGameRounds',
        headers: { 'Content-Type': 'application/json' },
        data: {'gameId': gameId},
    }).then((response) => {
        let rounds = response.data['allRounds'];
        console.log(rounds);
        return {roundsRetrieved: true, rounds: rounds}
    }).catch((error) => {
        console.log('Failed to start game');
        defaultErrorCatcher(error);
        return {roundsRetrieved: false, rounds: null}
    });
}

export const axiosSendAnswers = (answers: Answer[], playerId: number, gameId: number) => {
    return axios({
        method: 'post',
        url: API_BASE_URL + 'saveplayeranswers',
        headers: { 'Content-Type': 'application/json' },
        data: {'answers': answers, 'playerId': playerId, 'gameId': gameId},
    }).then(() => {
        console.log('answers retrieved');
        return true;
    }).catch((error) => {
        console.log('Failed to start game');
        defaultErrorCatcher(error);
        return false;
    });
}

export const axiosRetrievePlayerAnswers = (gameId: number, playerId: number) => {
    return axios({
        method: 'post',
        url: API_BASE_URL + 'retrieveplayeranswers',
        headers: { 'Content-Type': 'application/json' },
        data: {'gameId': gameId, 'playerId': playerId},
    }).then((response) => {
        console.log('answers recieved');
        console.log(response.data['roundAnswers']);
        console.log(response.data['roundPrompt']);
        return  {'roundAnswers':response.data['roundAnswers'], 'roundPrompt': response.data['roundPrompt']}
    }).catch((error) => {
        console.log('Failed to start game');
        defaultErrorCatcher(error);
        return null;
    });
};

export const axiosRetrieveAllPlayers = (gameId: number, playerId: number) => {
    return axios({
        method: 'post',
        url: API_BASE_URL + 'retrieveallplayers',
        headers: { 'Content-Type': 'application/json' },
        data: {'gameId': gameId, 'playerId': playerId},
    }).then((response) => {
        console.log('players recieved');
        console.log(response.data['allPlayers']);
        return response.data['allPlayers'];
    }).catch((error) => {
        console.log('Failed to start game');
        defaultErrorCatcher(error);
        return null;
    });
};

export const axiosSendGuesses = (allResponses: any, playerId: number, gameId: number) => {
    return axios({
        method: 'post',
        url: API_BASE_URL + 'saveplayerguesses',
        headers: { 'Content-Type': 'application/json' },
        data: {'allResponses': allResponses, 'playerId': playerId, 'gameId': gameId},
    }).then(() => {
        console.log('Guesses sent');
        return true;
    }).catch((error) => {
        console.log('Failed to start game');
        defaultErrorCatcher(error);
        return false;
    });
}

export const axiosCheckGuessRound = (guessRound: number, gameId: number) => {
    return axios({
        method: 'post',
        url: API_BASE_URL + 'checkguessround',
        headers: { 'Content-Type': 'application/json' },
        data: {'guessRound': guessRound, 'gameId': gameId},
    }).then((response) => {
        console.log('Guess round checked');
        return {guessRoundChanged: response.data['guessRoundChanged'], newGuessRound: response.data['newGuessRound'] }
    }).catch((error) => {
        console.log('Failed to start game');
        defaultErrorCatcher(error);
        return {guessRoundChanged: true, newGuessRound: null }
    });
};

export const axiosRetrievePlayerScores = (gameId: number, guessRound: number) => {
    return axios({
        method: 'post',
        url: API_BASE_URL + 'retrieveplayerscores',
        headers: { 'Content-Type': 'application/json' },
        data: {'guessRound': guessRound, 'gameId': gameId},
    }).then((response) => {
        console.log('player scores successfully retrieved &&&');
        console.log(response.data['playerScores']);
        return {scoresRetrieved: true, playerScores:response.data['playerScores']};
    }).catch((error) => {
        console.log('Failed to start game');
        defaultErrorCatcher(error);
        return {scoresRetrieved: false, playerScores: null}
    });
};