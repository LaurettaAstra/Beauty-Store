import { Link, useLocation } from "react-router-dom"

type HeaderProps = {
  cartCount: number
}

function Header({ cartCount }: HeaderProps) {
  useLocation()
  const isLoggedIn = !!localStorage.getItem("name") && !!localStorage.getItem("phone")

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
        <Link to={isLoggedIn ? "/profile" : "/login"}>👤</Link>
        <Link to="/cart" style={{ textDecoration: "none" }}>
          🛒 {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
      </div>
    </header>
  )
}

export default Header