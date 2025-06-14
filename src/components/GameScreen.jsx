// components/GameScreen.jsx
import Square from './Square'

const GameScreen = ({ gameState, onMove, onLeaveGame }) => {
  const { game, players, playerName } = gameState
  
  // Validación simple
  if (!game) {
    return (
      <div className="game-screen">
        <div className="loading">Cargando juego...</div>
      </div>
    )
  }
  
  if (!players) {
    return (
      <div className="game-screen">
        <div className="loading">Cargando juego...</div>
      </div>
    )
  }
  
  if (!game.board) {
    return (
      <div className="game-screen">
        <div className="loading">Cargando juego...</div>
      </div>
    )
  }
  
  // Extraer datos - simple como tu código original
  const { board, currentTurn, winner, movesHistory } = game
  
  const playersArray = Object.values(players)
  const myPlayer = playersArray.find(p => p.name === playerName)
  const opponent = playersArray.find(p => p.name !== playerName)
  const isMyTurn = myPlayer && currentTurn === myPlayer.symbol

  const isOldestPiece = (index) => {
    if (!board[index] || board[index] !== myPlayer?.symbol) return false
    const myMoves = movesHistory?.[myPlayer.symbol] || []
    return myMoves.length >= 3 && myMoves[0] === index
  }

  const canPlaySquare = (index) => {
    return isMyTurn && !winner && (!board[index] || board[index] === myPlayer.symbol)
  }

  return (
    <div className="game-screen">
      <div className="game-header">
        <h2>Tic Tac Toe Online</h2>
        <button onClick={onLeaveGame} className="leave-game">Salir</button>
      </div>

      <div className="players-display">
        <div className={`player-card ${myPlayer?.symbol === currentTurn ? 'active' : ''}`}>
          <span className="player-name">{myPlayer?.name} (Tú)</span>
          <span className="player-symbol">{myPlayer?.symbol}</span>
        </div>
        <div className="vs">VS</div>
        <div className={`player-card ${opponent?.symbol === currentTurn ? 'active' : ''}`}>
          <span className="player-name">{opponent?.name}</span>
          <span className="player-symbol">{opponent?.symbol}</span>
        </div>
      </div>

      <div className="turn-indicator">
        {isMyTurn ? "¡Tu turno!" : `Turno de ${opponent?.name}`}
      </div>

      <div className="game-info">
        <p>Después de 3 fichas, la más antigua se elimina automáticamente</p>
        <p>Fichas - {myPlayer?.symbol}: {movesHistory?.[myPlayer?.symbol]?.length || 0} | {opponent?.symbol}: {movesHistory?.[opponent?.symbol]?.length || 0}</p>
      </div>

      <section className='game'>
          {board.map((square, index) => (
            <Square
              key={index}
              index={index}
              value={square}
              isOldest={isOldestPiece(index)}
              isDisabled={!canPlaySquare(index)}
              onClick={onMove}
            />
          ))}
        </section>

      {(winner === 'X' || winner === 'O' || winner === false) && (
        <div className='winner'>
          <div className='text'>
            <h2>
              {winner === false 
                ? 'Empate' 
                : winner === myPlayer?.symbol 
                  ? '¡Ganaste!' 
                  : `Ganó ${opponent?.name}`
              }
            </h2>
             {winner && winner !== false && (
                <div className='win'>
                  <Square value={winner} />
                </div>
              )}
            <div className="winner-actions">
              <button onClick={onLeaveGame}>Salir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameScreen