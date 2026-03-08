import { Routes, Route } from "react-router-dom"
import { useState } from "react"
import "./App.css"

import Header from "./components/Header"
import ProductCard from "./components/ProductCard"
import LoginPage from "./pages/LoginPage"
import CodePage from "./pages/CodePage"
import ProductPage from "./pages/ProductPage"
import { products, type Product } from "./data/products"

function App() {
  const [cartCount, setCartCount] = useState(0)

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartCount((prev) => prev + quantity)
    console.log("Добавлен товар:", product, quantity)
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/code" element={<CodePage />} />
        <Route
          path="/product/:id"
          element={<ProductPage addToCart={addToCart} />}
        />
      </Routes>
    </div>
  )
}

export default App