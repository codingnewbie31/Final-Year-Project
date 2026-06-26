import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

// ── Mock framer-motion ───────────────────────────────────────────────
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}))

// ── Mock AuthContext ─────────────────────────────────────────────────
const mockLogin = vi.fn()
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}))

// ── Mock axiosInstance ───────────────────────────────────────────────
vi.mock('../utils/axiosInstance', () => ({
  default: { post: vi.fn() },
}))

// ── Mock apiPaths ────────────────────────────────────────────────────
vi.mock('../utils/apiPaths', () => ({
  API_PATHS: {
    AUTH: { LOGIN: '/api/auth/login' },
  },
}))

import axiosInstance from '../utils/axiosInstance'
import Login from '../pages/Auth/Login'

// ── Helper to render with Router ─────────────────────────────────────
const renderLogin = () => render(
  <GoogleOAuthProvider clientId="test-client-id">
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  </GoogleOAuthProvider>
)

// ────────────────────────────────────────────────────────────────────
describe('Login Form', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ✅ Test 1: Form renders correctly
  test('renders email and password fields and submit button', () => {
    renderLogin()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  // ✅ Test 2: User can type in fields
  test('allows user to type in email and password fields', async () => {
    renderLogin()
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  // ✅ Test 3: Shows validation errors on empty submit
  test('shows validation errors when form is submitted empty', async () => {
    renderLogin()
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  // ✅ Test 4: Password visibility toggle
  test('toggles password visibility when eye icon is clicked', async () => {
    renderLogin()
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const buttons = screen.getAllByRole('button')
    const toggleButton = buttons.find(b => b.getAttribute('type') === 'button')

    expect(passwordInput).toHaveAttribute('type', 'password')
    await userEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    await userEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  // ✅ Test 5: Shows loading state
  test('shows loading spinner when form is being submitted', async () => {
    axiosInstance.post.mockImplementation(() => new Promise(() => {}))

    renderLogin()
    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/signing in/i)).toBeInTheDocument()
    })
  })

  // ✅ Test 6: Shows error on failed login
  test('shows error message when login API fails', async () => {
    axiosInstance.post.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    })

    renderLogin()
    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'wrongpassword')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  // ✅ Test 7: Sign up link
  test('renders a link to the signup page', () => {
    renderLogin()
    const link = screen.getByRole('link', { name: /create one here/i })
    expect(link).toHaveAttribute('href', '/signup')
  })

})