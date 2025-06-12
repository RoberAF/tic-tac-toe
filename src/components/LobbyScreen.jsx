import { useState } from 'react'

const LobbyScreen = ({ onCreateRoom, onJoinRoom }) => {
  const [playerName, setPlayerName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [isCreating, setIsCreating] = useState(true)

  const handleSubmit = () => {
    if (!playerName.trim()) {
      alert('Por favor ingresa tu nombre')
      return
    }

    if (isCreating) {
      onCreateRoom(playerName.trim())
    } else {
      if (!roomCode.trim()) {
        alert('Por favor ingresa el código de sala')
        return
      }
      onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim())
    }
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
          onClick={() => setIsCreating(true)}
        >
          Crear Sala
        </button>
        <button 
          className={!isCreating ? 'active' : ''}
          onClick={() => setIsCreating(false)}
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

      <button onClick={handleSubmit} disabled={!playerName.trim() || (!isCreating && !roomCode.trim())}>
        {isCreating ? 'Crear Sala' : 'Unirse a Sala'}
      </button>
    </div>
  )
}

export default LobbyScreen