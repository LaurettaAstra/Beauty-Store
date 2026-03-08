import { Routes, Route } from "react-router-dom"
import { useState } from "react"
import Header from "./components/Header"
import ProductCard from "./components/ProductCard"
import ProductPage from "./pages/ProductPage"
import LoginPage from "./pages/LoginPage"
import { products, type Product } from "./data/products"

function App() {
  const [cartCount, setCartCount] = useState(0)

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartCount((prev) => prev + quantity)
  }

  return (
    <div className="page-container">
      <Header cartCount={cartCount} />

      <Routes>
        <Route
          path="/"
          element={
            <main>
              <section className="categories">
                <span>Уход за лицом</span>
                <span>Уход за волосами</span>
                <span>Макияж</span>
                <span>Скидки</span>
              </section>

              <section className="products-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                  />
                ))}
              </section>
            </main>
          }
        />

        <Route
          path="/product/:id"
          element={<ProductPage addToCart={addToCart} />}
        />

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App