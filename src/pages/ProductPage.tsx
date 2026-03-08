import { Link, useParams } from "react-router-dom"
import { useState } from "react"
import { products, type Product } from "../data/products"

type ProductPageProps = {
  addToCart: (product: Product, quantity?: number) => void
}

function ProductPage({ addToCart }: ProductPageProps) {
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return <div className="page-container">Товар не найден</div>
  }

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
        <img
          src={product.image}
          alt={product.title}
          className="product-page-image"
        />

        <div>
          <h1 className="product-page-title">{product.title}</h1>

          <div className="product-page-price">{product.price} ₽</div>

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
            onClick={() => addToCart(product, quantity)}
          >
            Добавить в корзину
          </button>
        </div>
      </section>
    </main>
  )
}

export default ProductPage