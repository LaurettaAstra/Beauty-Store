import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { products } from "../data/products"

const STORAGE_NAME = "name"
const STORAGE_PHONE = "phone"

type ProfilePageProps = {
  favoriteIds: number[]
  onToggleFavorite: (productId: number) => void
}

function ProfilePage({ favoriteIds, onToggleFavorite }: ProfilePageProps) {
  const navigate = useNavigate()
  const [name, setName] = useState<string | null>(null)
  const [phone, setPhone] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const favorites = products.filter((p) => favoriteIds.includes(p.id))

  useEffect(() => {
    const storedName = localStorage.getItem(STORAGE_NAME)
    const storedPhone = localStorage.getItem(STORAGE_PHONE)
    if (!storedName || !storedPhone) {
      navigate("/login", { replace: true })
      return
    }
    setName(storedName)
    setPhone(storedPhone)
    setEditName(storedName)
    setEditPhone(storedPhone)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_NAME)
    localStorage.removeItem(STORAGE_PHONE)
    navigate("/login")
  }

  if (name === null || phone === null) {
    return null
  }

  const noopAddToCart = () => {}

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 24,
    marginBottom: 56,
  }

  return (
    <main className="page-container">
      <h1 className="catalog-title">Личный кабинет</h1>

      <section style={{ marginBottom: 40 }}>
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: "24px 28px",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
            maxWidth: 420,
          }}
        >
          <label style={{ display: "block", marginBottom: 8, fontSize: 15, color: "#6b7280" }}>
            Имя
          </label>
          <input
            type="text"
            value={editName}
            onChange={(e) => {
              const v = e.target.value
              setEditName(v)
              setName(v)
              localStorage.setItem(STORAGE_NAME, v)
            }}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              fontSize: 16,
              marginBottom: 20,
              boxSizing: "border-box",
            }}
          />
          <label style={{ display: "block", marginBottom: 8, fontSize: 15, color: "#6b7280" }}>
            Телефон
          </label>
          <input
            type="tel"
            value={editPhone}
            onChange={(e) => {
              const v = e.target.value
              setEditPhone(v)
              setPhone(v)
              localStorage.setItem(STORAGE_PHONE, v)
            }}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              fontSize: 16,
              marginBottom: 24,
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "#374151",
                cursor: "pointer",
                fontSize: 14,
                textDecoration: "underline",
                padding: 0,
              }}
            >
              Выйти
            </button>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <Link to="/orders" style={{ textDecoration: "none", color: "inherit" }}>
          <h2 className="catalog-title" style={{ marginBottom: 16 }}>
            Мои заказы
          </h2>
        </Link>
      </section>

      <h2 className="catalog-title" style={{ marginBottom: 16 }}>
        Избранное
      </h2>
      {favorites.length === 0 ? (
        <p style={{ marginBottom: 48, color: "#6b7280", fontSize: 15 }}>
          Нет избранных товаров.{" "}
          <Link to="/" style={{ color: "#111827", textDecoration: "underline" }}>
            Перейти в каталог
          </Link>
        </p>
      ) : (
        <div style={gridStyle}>
          {favorites.map((product) => (
            <div key={product.id} style={{ display: "flex", height: 420 }}>
              <ProductCard
                product={product}
                addToCart={noopAddToCart}
                isFavorite={true}
                onToggleFavorite={() => onToggleFavorite(product.id)}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default ProfilePage
