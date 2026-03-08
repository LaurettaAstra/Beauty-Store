import { Link } from "react-router-dom"
import { useState } from "react"
import type { Product } from "../data/products"

type ProductCardProps = {
  product: Product
  addToCart: (product: Product, quantity?: number) => void
}

function ProductCard({ product, addToCart }: ProductCardProps) {
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
      <Link to={`/product/${product.id}`} className="product-link">
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
        />
        <h3 className="product-title">{product.title}</h3>
      </Link>

      <p className="product-price">{product.price} ₽</p>
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
        onClick={() => addToCart(product, quantity)}
      >
        Добавить в корзину
      </button>
    </article>
  )
}

export default ProductCard