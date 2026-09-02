import React, { Suspense } from 'react'
import { Outlet } from 'react-router'
import Header from './Header'
import Footer from './Footer'

const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <Header />

      <main>
        <Suspense fallback={<main>Завантаження…</main>}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}

export default Layout
