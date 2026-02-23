const Button = (props) => {
  const {
    className = '',
    type = 'button',
    children,
    onClick,
    isdisable,
  } = props;

  return (
    <button 
      className={`button ${className}`}
      type={type}
      onClick={onClick}
      disabled={isdisable}
    >
    {children}
    </button>
  )
}

export default Button;