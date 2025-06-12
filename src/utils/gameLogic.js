// utils/gameLogic.js

export const checkWinner = (board) => {
  const winnerCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
    [0, 4, 8], [2, 4, 6]             // Diagonales
  ]
  
  for (const combo of winnerCombos) {
    const [a, b, c] = combo
    // Verificar que la casilla no sea null NI cadena vacía
    if (board[a] && board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return null
}

export const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export const isGameComplete = (board) => {
  return board.every(cell => cell !== null && cell !== "")
}