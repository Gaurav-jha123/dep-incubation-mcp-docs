import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import BeautifulModal from './components/BeautifulModal'
import './App.css'
import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router";
import Dashboard from './features/dashboard/dashboard';

function AppWrapper() {
  return <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
}

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
    <nav>
      {/* NavLink makes it easy to show active states */}
      <NavLink
        to="/"
        className={({ isActive }: { isActive: boolean }) =>
          isActive ? "active" : ""
        }
      >
        Home
      </NavLink>

      <Link to="/dashboard">Dashboard</Link>
    </nav>

    <div className="flex my-2 items-center justify-center">
        <Button variant={'outline'} onClick={() => setCount((count) => count + 1)}>
          Click me {count}
        </Button>
      </div>

      <BeautifulModal />
    </>
     
  )
}

export default AppWrapper
