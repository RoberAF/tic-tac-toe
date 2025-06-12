// App.jsx
import { useState, useEffect } from 'react'
import LobbyScreen from './components/LobbyScreen'
import WaitingRoom from './components/WaitingRoom'
import GameScreen from './components/GameScreen'
import { useFirebaseGame } from './hooks/useFirebaseGame'
import './App.css'

function App() {
  const [gamePhase, setGamePhase] = useState('lobby')
  const {
    gameState,
    connectionStatus,
    createRoom,
    joinRoom,
    makeMove,
    startGame,
    leaveRoom
  } = useFirebaseGame()

  const handleCreateRoom = async (playerName) => {
    const result = await createRoom(playerName)
    if (result.success) {
      setGamePhase('waiting')
    } else {
      alert('Error al crear sala: ' + result.error)
    }
  }

  const handleJoinRoom = async (roomCode, playerName) => {
    const result = await joinRoom(roomCode, playerName)
    if (result.success) {
      setGamePhase('waiting')
    } else {
      alert('Error al unirse a sala: ' + result.error)
    }
  }

  const handleStartGame = () => {
    startGame()
    setGamePhase('playing')
  }

  const handleLeaveRoom = () => {
    leaveRoom()
    setGamePhase('lobby')
  }

  // Actualizar fase del juego basado en el estado
  useEffect(() => {
    if (gameState?.status === 'playing') {
      setGamePhase('playing')
    } else if (gameState?.status === 'waiting') {
      setGamePhase('waiting')
    }
  }, [gameState?.status])

  return (
    <main className='board'>
      {connectionStatus === 'connecting' && (
        <div className="loading">Conectando...</div>
      )}
      
      {gamePhase === 'lobby' && (
        <LobbyScreen 
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
      )}
      
      {gamePhase === 'waiting' && gameState && (
        <WaitingRoom 
          gameState={gameState}
          onStartGame={handleStartGame}
          onLeaveRoom={handleLeaveRoom}
        />
      )}
      
      {gamePhase === 'playing' && gameState && gameState.game && (
        <GameScreen 
          gameState={gameState}
          onMove={makeMove}
          onLeaveGame={handleLeaveRoom}
        />
      )}
    </main>
  )
}

export default App