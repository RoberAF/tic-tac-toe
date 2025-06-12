const Square = ({ children, index, isOldest, isDisabled, onClick, isSelected }) => {
  const className = `square ${isSelected ? 'is-selected' : ''} ${isOldest ? 'oldest' : ''} ${isDisabled ? 'disabled' : ''}`

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick(index)
    }
  }

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}

export default Square