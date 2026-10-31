import { Component, type ReactNode } from 'react'
import { Button } from './Button'

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="page-container py-20" role="alert">
          <h1 className="mb-3 text-3xl">Səhifə açıla bilmədi</h1>
          <p className="mb-6 text-muted">
            Gözlənilməz xəta baş verdi. Səhifəni yeniləyib təkrar cəhd edin.
          </p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Səhifəni yenilə
          </Button>
        </main>
      )
    }
    return this.props.children
  }
}
