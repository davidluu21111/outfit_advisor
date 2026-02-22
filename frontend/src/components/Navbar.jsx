import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-brand-600' : 'text-neutral-500 hover:text-neutral-900'
    }`

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-neutral-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-display text-xl text-neutral-900 tracking-tight">
          Outfit<span className="text-brand-600">AI</span>
        </Link>
        <div className="flex gap-6">
          <NavLink to="/"        className={linkClass} end>Home</NavLink>
          <NavLink to="/history" className={linkClass}>History</NavLink>
        </div>
      </div>
    </nav>
  )
}
