import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [gameId, setGameId] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [roundNumber, setRoundNumber] = useState(0);
  const [guessRound, setGuessRound] = useState(0);
  const [rounds, setRounds] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [playerId, setPlayerId] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]);

  // const [guessRound, setGuessRound] = useState(2);
  // const [playerId, setPlayerId] = useState(131);
  // const [gameId, setGameId] = useState(48);
  // const [pageNumber, setPageNumber] = useState(1);
  // const [allPlayers, setAllPlayers] = useState([{"playerId": 117, "playerName": "Saam", "taken": false}, {"playerId": 118, "playerName": "J", "taken": false}, {"playerId": 119, "playerName": "Stul", "taken": false}, {"playerId": 120, "playerName": "Jebedi", "taken": false}, {"playerId": 121, "playerName": "Sassy pants", "taken": false}, {"playerId": 123, "playerName": "Koolaid Sam", "taken": false}, {"playerId": 129, "playerName": "Babe ruth's mother is me", "taken": false}]);


  const value = {
    gameId,setGameId,
    pageNumber, setPageNumber,
    rounds, setRounds,
    roundNumber, setRoundNumber,
    answers, setAnswers,
    playerId, setPlayerId,
    guessRound, setGuessRound,
    allPlayers, setAllPlayers
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
