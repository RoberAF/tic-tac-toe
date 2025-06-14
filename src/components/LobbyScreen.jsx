import { useState } from 'react'

const LobbyScreen = ({ onCreateRoom, onJoinRoom }) => {
  const [playerName, setPlayerName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [isCreating, setIsCreating] = useState(true)

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      alert('Por favor ingresa tu nombre')
      return
    }

    onCreateRoom(playerName.trim())
  }

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      alert('Por favor ingresa tu nombre')
      return
    }
    if (!roomCode.trim()) {
      alert('Por favor ingresa el código de sala')
      return
    }
    onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim())
  }

  return (
    <div className="lobby-screen">
      <h1>Tic Tac Toe Online</h1>
      
      <div className="player-input">
        <label>Tu nombre:</label>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Ingresa tu nombre"
          maxLength={20}
        />
      </div>

      <div className="game-mode-selector">
        <button
          className={isCreating ? 'active' : ''}
          onClick={() => {
            if (isCreating) {
              handleCreateRoom()
            } else {
              setIsCreating(true)
            }
          }}
        >
          Crear Sala
        </button>
        <button
          className={!isCreating ? 'active' : ''}
          onClick={() => {
            if (!isCreating) {
              handleJoinRoom()
            } else {
              setIsCreating(false)
            }
          }}
        >
          Unirse a Sala
        </button>
      </div>

      {!isCreating && (
        <div className="join-room">
          <label>Código de sala:</label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Ej: ABC123"
            maxLength={6}
          />
        </div>
      )}
      </div>
  )
}

export default LobbyScreen