import { AppHeader } from './components/layout/AppHeader'
import { ProductsPage } from './features/products/ProductsPage'

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Əsas məzmuna keç
      </a>
      <AppHeader />
      <ProductsPage />
    </>
  )
}
