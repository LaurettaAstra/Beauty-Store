import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import type { Product } from "../data/products"

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%23e5e7eb' width='800' height='400'/%3E%3Ctext x='50%25' y='50%25' fill='%236b7280' text-anchor='middle' dy='.3em' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E"

type ProductCardProps = {
  product: Product
  addToCart: (product: Product, quantity?: number) => void
  isInCart?: boolean
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

function ProductCard({ product, addToCart, isInCart = false, isFavorite = false, onToggleFavorite }: ProductCardProps) {
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)

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
    <article className="product-card">
      <div style={{ position: "relative", flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              onToggleFavorite()
            }}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
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
        )}
        <Link to={`/product/${product.id}`} className="product-link">
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
            onError={(e) => {
              const target = e.currentTarget
              if (target.src !== FALLBACK_IMAGE) {
                target.src = FALLBACK_IMAGE
              }
            }}
          />
          <h3 className="product-title">{product.title}</h3>
        </Link>
      </div>

      <p className="product-price">
        {product.old_price != null && product.old_price > product.price ? (
          <>
            <span style={{ textDecoration: "line-through", color: "#9ca3af", marginRight: 8 }}>{product.old_price} ₽</span>
            <span style={{ color: "#dc2626", fontWeight: 600 }}>-{product.old_price - product.price} ₽</span>
            <br />
          </>
        ) : null}
        <span style={{ fontWeight: 700 }}>{product.price} ₽</span>
      </p>
      <p className="product-stock">В наличии: {product.stock}</p>

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
        className="add-button"
        onClick={() => {
          if (isInCart) {
            navigate("/cart")
          } else {
            addToCart(product, quantity)
          }
        }}
        style={{
          marginTop: "auto",
          ...(isInCart && {
            background: "#22c55e",
            color: "white",
          }),
        }}
      >
        {isInCart ? "В корзине" : "Добавить в корзину"}
      </button>
    </article>
  )
}

export default ProductCard