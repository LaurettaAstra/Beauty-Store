import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { products, type Product } from "../data/products"
import { getUsersMe, patchUsersMe } from "../api/users"
import type { CartItem } from "./CartPage"

const STORAGE_NAME = "name"
const STORAGE_PHONE = "phone"
const STORAGE_EMAIL = "email"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(email: string): boolean {
  if (!email.trim()) return true
  return EMAIL_REGEX.test(email.trim())
}

type ProfilePageProps = {
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  favoriteIds: number[]
  onToggleFavorite: (productId: number) => void
}

function ProfilePage({ cart, addToCart, favoriteIds, onToggleFavorite }: ProfilePageProps) {
  const navigate = useNavigate()
  const [name, setName] = useState<string | null>(null)
  const [phone, setPhone] = useState<string | null>(null)
  const [email, setEmail] = useState<string>("")
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const favorites = products.filter((p) => favoriteIds.includes(p.id))

  useEffect(() => {
    getUsersMe().then((user) => {
      if (!user) {
        navigate("/login", { replace: true })
        return
      }
      setName(user.profile.name)
      setPhone(user.phone)
      setEmail(user.profile.email ?? "")
      setEditName(user.profile.name)
      setEditEmail(user.profile.email ?? "")
    })
  }, [navigate])

  const handleEdit = () => {
    setEmailError(null)
    setSaveError(null)
    setEditName(name ?? "")
    setEditPhone(phone ?? "")
    setEditEmail(email)
    setIsEditing(true)
  }

  const handleSave = async () => {
    setEmailError(null)
    setSaveError(null)

    if (!isValidEmail(editEmail)) {
      setEmailError("Введите корректный e-mail")
      return
    }

    try {
      await patchUsersMe({ name: editName, phone: editPhone.trim(), email: editEmail.trim() })
      setName(editName)
      setPhone(editPhone.trim())
      setEmail(editEmail.trim())
      setIsEditing(false)
    } catch (err) {
      setSaveError("Не удалось сохранить. Попробуйте позже.")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_NAME)
    localStorage.removeItem(STORAGE_PHONE)
    localStorage.removeItem(STORAGE_EMAIL)
    navigate("/login")
  }

  if (name === null || phone === null) {
    return null
  }

  const noopAddToCart = () => {}

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    fontSize: 16,
    marginBottom: 20,
    boxSizing: "border-box",
  }

  const inputDisabledStyle: React.CSSProperties = {
    ...inputStyle,
    background: "#f9fafb",
    color: "#6b7280",
    cursor: "not-allowed",
  }

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
            onChange={(e) => setEditName(e.target.value)}
            readOnly={!isEditing}
            disabled={!isEditing}
            style={isEditing ? inputStyle : inputDisabledStyle}
          />

          <label style={{ display: "block", marginBottom: 8, fontSize: 15, color: "#6b7280" }}>
            Телефон
          </label>
          <input
            type="tel"
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
            readOnly={!isEditing}
            disabled={!isEditing}
            style={isEditing ? inputStyle : inputDisabledStyle}
          />

          <label style={{ display: "block", marginBottom: 8, fontSize: 15, color: "#6b7280" }}>
            Email
          </label>
          <input
            type="email"
            value={editEmail}
            onChange={(e) => {
              setEditEmail(e.target.value)
              setEmailError(null)
            }}
            readOnly={!isEditing}
            disabled={!isEditing}
            placeholder={isEditing ? "email@example.com" : undefined}
            style={isEditing ? inputStyle : inputDisabledStyle}
          />
          {emailError && (
            <p style={{ margin: "-8px 0 12px", color: "#ef4444", fontSize: 14 }}>{emailError}</p>
          )}
          {saveError && (
            <p style={{ margin: "-8px 0 12px", color: "#ef4444", fontSize: 14 }}>{saveError}</p>
          )}

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            {isEditing ? (
              <button type="button" className="add-button" style={{ width: "auto", padding: "12px 24px" }} onClick={handleSave}>
                Сохранить
              </button>
            ) : (
              <button type="button" className="add-button" style={{ width: "auto", padding: "12px 24px" }} onClick={handleEdit}>
                Редактировать
              </button>
            )}
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
                addToCart={addToCart}
                isInCart={cart.some((i) => i.productId === product.id)}
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
