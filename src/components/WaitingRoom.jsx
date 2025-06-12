const WaitingRoom = ({ gameState, onStartGame, onLeaveRoom }) => {
  const { roomCode, players } = gameState
  const playersArray = Object.values(players || {})
  const isHost = gameState.isHost

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
    alert('Código copiado al portapapeles')
  }

  return (
    <div className="waiting-room">
      <h2>Sala: {roomCode}</h2>
      
      <div className="room-info">
        <button onClick={copyRoomCode} className="copy-code">
          📋 Copiar código
        </button>
        <p>Comparte este código con tu oponente</p>
      </div>

      <div className="players-list">
        <h3>Jugadores ({playersArray.length}/2)</h3>
        {playersArray.map((player, index) => (
          <div key={index} className="player-item">
            <span>{player.name}</span>
            <span className="player-symbol">{player.symbol}</span>
            {player.name === gameState.playerName && <span className="you-indicator">(Tú)</span>}
            {player.isHost && <span className="host-indicator">👑</span>}
          </div>
        ))}
        
        {playersArray.length < 2 && (
          <div className="empty-slot">
            <span>Esperando jugador...</span>
          </div>
        )}
      </div>

      <div className="room-actions">
        {isHost && playersArray.length === 2 && (
          <button onClick={onStartGame} className="start-game">
            Iniciar Partida
          </button>
        )}
        
        <button onClick={onLeaveRoom} className="leave-room">
          Salir de la Sala
        </button>
      </div>
    </div>
  )
}

export default WaitingRoom