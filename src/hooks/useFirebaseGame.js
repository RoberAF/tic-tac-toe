// hooks/useFirebaseGame.js
import { useState, useEffect } from 'react'
import { database } from '../secrets/firebase'
import { ref, onValue, set, get, serverTimestamp, off } from 'firebase/database'
import { checkWinner } from '../utils/gameLogic'

export const useFirebaseGame = () => {
  const [gameState, setGameState] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')

  const createRoom = async (playerName) => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    
    const initialGameState = {
      roomCode,
      status: 'waiting',
      players: {
        player1: {
          name: playerName,
          symbol: 'X',
          isHost: true,
          connected: true
        }
      },
      game: {
        board: Array(9).fill(null),
        currentTurn: 'X',
        winner: null,
        movesHistory: { X: [], O: [] }
      },
      createdAt: serverTimestamp()
    }

    try {
      await set(ref(database, `rooms/${roomCode}`), initialGameState)
      setGameState({ ...initialGameState, playerName, isHost: true })
      setConnectionStatus('connected')
      return { success: true, roomCode }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const joinRoom = async (roomCode, playerName) => {
    try {
      const roomSnapshot = await get(ref(database, `rooms/${roomCode}`))
      if (!roomSnapshot.exists()) {
        return { success: false, error: 'Sala no encontrada' }
      }

      const roomData = roomSnapshot.val()
      if (Object.keys(roomData.players).length >= 2) {
        return { success: false, error: 'Sala llena' }
      }

      await set(ref(database, `rooms/${roomCode}/players/player2`), {
        name: playerName,
        symbol: 'O',
        isHost: false,
        connected: true
      })
      
      // Asegurar que el gameState esté completo
      const completeRoomData = {
        ...roomData,
        playerName,
        isHost: false,
        game: {
          board: Array(9).fill(null),
          currentTurn: 'X',
          winner: null, // Explícitamente null
          movesHistory: { X: [], O: [] },
          ...roomData.game
        }
      }
      
      setGameState(completeRoomData)
      setConnectionStatus('connected')
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const makeMove = async (index) => {
    // Validación simple como tu código original
    if (!gameState?.game?.board || gameState.game.board[index] || gameState.game.winner) return
    
    try {
      const mySymbol = gameState.playerName === gameState.players.player1?.name ? 'X' : 'O'
      
      // Copia simple del board - como tu código original
      const newBoard = [...gameState.game.board]
      const newMovesHistory = { 
        X: [...(gameState.game.movesHistory?.X || [])],
        O: [...(gameState.game.movesHistory?.O || [])]
      }
      
      // Lógica de sobreescritura (tu nueva funcionalidad)
      if (newMovesHistory[mySymbol].length >= 3) {
        const oldestMove = newMovesHistory[mySymbol].shift()
        newBoard[oldestMove] = null
      }
      
      // Colocar la nueva ficha - como tu código original
      newBoard[index] = mySymbol
      newMovesHistory[mySymbol].push(index)
      
      // Cambiar turno - como tu código original
      const newTurn = mySymbol === 'X' ? 'O' : 'X'
      
      // Verificar ganador - como tu código original
      const newWinner = checkWinner(newBoard)
      let winner = null
      if (newWinner) {
        winner = newWinner
      } else if (newBoard.every(square => square !== null)) {
        winner = false // Empate
      }
      
      // CLAVE: Convertir nulls a cadenas vacías para Firebase
      const firebaseBoard = newBoard.map(cell => cell === null ? "" : cell)
      
      const updatedGame = {
        board: firebaseBoard,
        currentTurn: newTurn,
        winner: winner,
        movesHistory: newMovesHistory
      }
      
      await set(ref(database, `rooms/${gameState.roomCode}/game`), updatedGame)
    } catch (error) {
      console.error('Error al hacer movimiento:', error)
    }
  }

  const startGame = async () => {
    try {
      // Inicializar el estado completo del juego - usando cadenas vacías en lugar de null
      const initialGameState = {
        board: Array(9).fill(""), // Cadenas vacías en lugar de null
        currentTurn: 'X',
        winner: null,
        movesHistory: { X: [], O: [] }
      }
      
      // Actualizar primero el game state, luego el status
      await set(ref(database, `rooms/${gameState.roomCode}/game`), initialGameState)
      await set(ref(database, `rooms/${gameState.roomCode}/status`), 'playing')
      
      // También actualizar el estado local inmediatamente (convertir de vuelta a null para lógica local)
      setGameState(prev => ({
        ...prev,
        status: 'playing',
        game: {
          ...initialGameState,
          board: Array(9).fill(null) // null en estado local
        }
      }))
    } catch (error) {
      console.error('Error al iniciar juego:', error)
    }
  }

  const leaveRoom = () => {
    if (gameState?.roomCode) {
      const roomRef = ref(database, `rooms/${gameState.roomCode}`)
      off(roomRef)
    }
    setGameState(null)
    setConnectionStatus('disconnected')
  }

  useEffect(() => {
    if (!gameState?.roomCode) return

    const roomRef = ref(database, `rooms/${gameState.roomCode}`)
    
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val()
      
      if (data) {
        // Convertir cadenas vacías de vuelta a null para la lógica del juego
        if (data.game && data.game.board) {
          data.game.board = data.game.board.map(cell => cell === "" ? null : cell)
        }
        
        setGameState(prev => ({ ...prev, ...data }))
      }
    })

    return () => off(roomRef, 'value', unsubscribe)
  }, [gameState?.roomCode])

  return {
    gameState,
    connectionStatus,
    createRoom,
    joinRoom,
    makeMove,
    startGame,
    leaveRoom
  }
}