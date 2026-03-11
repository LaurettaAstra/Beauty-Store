import { Link, useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { products, type Product } from "../data/products"
import type { CartItem } from "./CartPage"

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%23e5e7eb' width='800' height='400'/%3E%3Ctext x='50%25' y='50%25' fill='%236b7280' text-anchor='middle' dy='.3em' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E"

type ProductPageProps = {
  addToCart: (product: Product, quantity?: number) => void
  cart: CartItem[]
  favoriteIds: number[]
  onToggleFavorite: (productId: number) => void
}

function ProductPage({ addToCart, cart, favoriteIds, onToggleFavorite }: ProductPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find((p) => p.id === Number(id))
  const [quantity, setQuantity] = useState(1)
  const isInCart = product ? cart.some((i) => i.productId === product.id) : false

  if (!product) {
    return <div className="page-container">Товар не найден</div>
  }

  const isFavorite = favoriteIds.includes(product.id)

  const increase = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <main className="page-container">
      <Link to="/" className="back-link">
        ← Назад в каталог
      </Link>

      <section className="product-page">
        <div style={{ position: "relative" }}>
          <img
            src={product.image}
            alt={product.title}
            className="product-page-image"
            onError={(e) => {
              const target = e.currentTarget
              if (target.src !== FALLBACK_IMAGE) {
                target.src = FALLBACK_IMAGE
              }
            }}
          />
          <button
            type="button"
            onClick={() => onToggleFavorite(product.id)}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              fontSize: 28,
              color: isFavorite ? "#111827" : "#fff",
              WebkitTextStroke: "1px #111827",
              zIndex: 1,
            }}
            aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
          >
            ❤
          </button>
        </div>

        <div>
          <h1 className="product-page-title">{product.title}</h1>

          <div className="product-page-price">
            {product.old_price != null && product.old_price > product.price ? (
              <>
                <span style={{ textDecoration: "line-through", color: "#9ca3af", marginRight: 8 }}>{product.old_price} ₽</span>
                <span style={{ color: "#dc2626", fontWeight: 600 }}>-{product.old_price - product.price} ₽</span>
                <br />
              </>
            ) : null}
            <span style={{ fontWeight: 700 }}>{product.price} ₽</span>
          </div>

          <div className="product-page-stock">В наличии: {product.stock}</div>

          <p className="product-page-description">{product.description}</p>

          <div className="quantity-controls">
            <button type="button" className="small-button" onClick={decrease}>
              -
            </button>

            <span className="quantity-value">{quantity}</span>

            <button type="button" className="small-button" onClick={increase}>
              +
            </button>
          </div>

          <button
            type="button"
            className="add-button add-button-wide"
            onClick={() => {
              if (isInCart) {
                navigate("/cart")
              } else {
                addToCart(product, quantity)
              }
            }}
            style={
              isInCart
                ? { background: "#22c55e", color: "white" }
                : undefined
            }
          >
            {isInCart ? "В корзине" : "Добавить в корзину"}
          </button>
        </div>
      </section>
    </main>
  )
}

export default ProductPage