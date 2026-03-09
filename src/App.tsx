import { Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import "./App.css"

import Header from "./components/Header"
import ProductCard from "./components/ProductCard"
import LoginPage from "./pages/LoginPage"
import CodePage from "./pages/CodePage"
import ProfilePage from "./pages/ProfilePage"
import ProductPage from "./pages/ProductPage"
import CartPage, { type CartItem } from "./pages/CartPage"
import OrdersPage from "./pages/OrdersPage"
import PaymentPage from "./pages/PaymentPage"
import { products, type Product } from "./data/products"

const FAVORITES_KEY = "favorites"
const CART_KEY = "cart"

function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]")
    } catch {
      return []
    }
  })
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]")
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds))
  }, [favoriteIds])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: Math.min(product.stock, i.quantity + quantity) }
            : i
        )
      }
      return [...prev, { productId: product.id, quantity: Math.min(product.stock, quantity) }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId))
  }

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.productId !== productId))
      return
    }
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    )
  }

  const toggleFavorite = (productId: number) => {
    setFavoriteIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const clearCart = () => setCart([])

  type Cat = "Уход за лицом" | "Уход за волосами" | "Макияж" | "Скидки" | null
  const [cat, setCat] = useState<Cat>(null)
  const list =
    !cat ? products : cat === "Скидки" ? products.filter((p) => p.discount_percent != null) : products.filter((p) => p.category === cat)

  return (
    <div className="page-container">
      <Header cartCount={cartCount} />

      <Routes>
        <Route
          path="/"
          element={
            <main>
              <h2 className="catalog-title">Каталог</h2>
              <section className="categories">
                {(["Уход за лицом", "Уход за волосами", "Макияж", "Скидки"] as const).map((c) => (
                  <span key={c} onClick={() => setCat((p) => (p === c ? null : c))} style={{ cursor: "pointer", textDecoration: cat === c ? "underline" : "none" }}>
                    {c}
                  </span>
                ))}
              </section>
              <section className="products-grid">
                {list.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    isFavorite={favoriteIds.includes(product.id)}
                    onToggleFavorite={() => toggleFavorite(product.id)}
                  />
                ))}
              </section>
            </main>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/code" element={<CodePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/profile" element={<ProfilePage favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />} />
        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              removeFromCart={removeFromCart}
              updateCartQuantity={updateCartQuantity}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
              onCreateOrder={() => clearCart()}
            />
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProductPage
              addToCart={addToCart}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App