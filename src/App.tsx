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
  return (
     <nav>
      {/* NavLink makes it easy to show active states */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "active" : ""
        }
      >
        Home
      </NavLink>

      <Link to="/dashboard">Dashboard</Link>
    </nav>
  )
}

export default AppWrapper
