const Square = ({ value, index, isOldest, isDisabled, onClick, isSelected, children }) => {
  const symbolClass = value === 'X' ? 'x' : value === 'O' ? 'o' : ''
  const className = `square ${symbolClass} ${isSelected ? 'is-selected' : ''} ${isOldest ? 'oldest' : ''} ${isDisabled ? 'disabled' : ''}`

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick(index)
    }
  }

  return (
    <div onClick={handleClick} className={className}>
      <span className="symbol">{children}</span>
    </div>
  )
}

export default Square
