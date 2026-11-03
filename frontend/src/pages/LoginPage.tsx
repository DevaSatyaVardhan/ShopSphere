import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, ShieldCheck, UserCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, register, loginAsDemoCustomer, loginAsDemoAdmin } = useAuth()

  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isRegister) {
        await register(name, email, password)
      } else {
        await login(email, password)
      }

      const isAdmin = email.toLowerCase().includes('admin')
      navigate(isAdmin ? '/admin' : '/account')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoCustomer = () => {
    loginAsDemoCustomer()
    navigate('/account')
  }

  const handleDemoAdmin = () => {
    loginAsDemoAdmin()
    navigate('/admin')
  }

  return (
    <main className="auth-page auth-page-root">
      {/* Left Editorial Copy */}
      <div className="auth-copy">
        <p className="eyebrow">Welcome to ShopSphere</p>
        <h1>
          Make room for<br />
          <em>better things.</em>
        </h1>
        <p>
          Sign in to access your personal curation, track orders in real time, and enjoy early access to seasonal capsule drops.
        </p>

        {/* Quick Demo Access Pills */}
        <div className="demo-credentials-box">
          <span className="demo-box-label">Instant Demo Evaluation Access:</span>
          <div className="demo-pills-row">
            <button
              type="button"
              className="demo-pill-btn customer"
              onClick={handleDemoCustomer}
            >
              <UserCheck size={15} /> Sign in as Customer (Alex)
            </button>
            <button
              type="button"
              className="demo-pill-btn admin"
              onClick={handleDemoAdmin}
            >
              <ShieldCheck size={15} /> Sign in as Admin
            </button>
          </div>
          <small className="demo-note">
            Tip: Or sign in with any email containing "admin" for administrator privileges.
          </small>
        </div>
      </div>

      {/* Right Form Card */}
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">{isRegister ? 'New Member' : 'Member Access'}</p>
        <h2>{isRegister ? 'Start your collection.' : 'Welcome back.'}</h2>

        {isRegister && (
          <div className="auth-field">
            <input
              type="text"
              name="name"
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="auth-field">
          <input
            type="email"
            name="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-field password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            placeholder="Password (minimum 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button className="primary-button auth-submit-btn" type="submit" disabled={loading}>
          {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          <ArrowRight size={16} />
        </button>

        <div className="auth-footer-toggle">
          <button
            type="button"
            className="text-link"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? 'Already a member? Sign in here'
              : 'New to ShopSphere? Create an account'}
          </button>
        </div>
      </form>
    </main>
  )
}
