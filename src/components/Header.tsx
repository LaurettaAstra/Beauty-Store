import { Link } from "react-router-dom"

type HeaderProps = {
  cartCount: number
}

function Header({ cartCount }: HeaderProps) {
  return (
    <header className="header">
      <Link to="/" className="logo">
        Beauty Store
      </Link>

      <input
        type="text"
        className="search-input"
        placeholder="Поиск товаров..."
      />

      <div className="header-icons">
        <Link to="/login">👤</Link>
        <span>
          🛒 {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </span>
      </div>
    </header>
  )
}

export default Header