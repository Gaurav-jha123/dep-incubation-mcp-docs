import './App.css'
import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router";
import Dashboard from './features/dashboard/dashboard';
import { QueryProvider } from './providers/query-provider';
import { useUsers } from './services/hooks/query/useDummy';

function AppWrapper() {
  return <BrowserRouter>
    <QueryProvider>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </QueryProvider>
  </BrowserRouter>
}

function App() {
  const { data, isLoading, error } = useUsers();

  console.log("Users data:", { data, isLoading, error });
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
