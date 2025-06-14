const Square = ({ value, index, isOldest, isDisabled, onClick, isSelected }) => {
  const valueClass = value === 'X' ? 'x' : value === 'O' ? 'o' : ''
  const className = `square ${valueClass} ${isSelected ? 'is-selected' : ''} ${isOldest ? 'oldest' : ''} ${isDisabled ? 'disabled' : ''}`

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick(index)
    }
  }

  return (
    <div onClick={handleClick} className={className}>
      {value}
    </div>
  )
}

export default Square