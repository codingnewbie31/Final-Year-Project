import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

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
    AUTH: { REGISTER: '/api/auth/register' },
  },
}))

// ── Mock uploadImage ─────────────────────────────────────────────────
vi.mock('../utils/uploadImage', () => ({
  default: vi.fn().mockResolvedValue({ imageUrl: 'http://test.com/avatar.jpg' }),
}))

import axiosInstance from '../utils/axiosInstance'
import SignUp from '../pages/Auth/SignUp'

// ── Helpers ──────────────────────────────────────────────────────────
const fillValidForm = async () => {
  await userEvent.type(screen.getByPlaceholderText('Enter your full name'), 'John Doe')
  await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'john@example.com')
  await userEvent.type(screen.getByPlaceholderText('Create a strong password'), 'Password123!')
  await userEvent.click(screen.getByText('Job Seeker'))
}

// ────────────────────────────────────────────────────────────────────
describe('SignUp Form', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ✅ Test 1: Form renders all fields
  test('renders all form fields and submit button', () => {
    render(<SignUp />)
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Create a strong password')).toBeInTheDocument()
    expect(screen.getByText('Job Seeker')).toBeInTheDocument()
    expect(screen.getByText('Employer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  // ✅ Test 2: User can type in all fields
  test('allows user to type in all input fields', async () => {
    render(<SignUp />)
    const nameInput = screen.getByPlaceholderText('Enter your full name')
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Create a strong password')

    await userEvent.type(nameInput, 'John Doe')
    await userEvent.type(emailInput, 'john@example.com')
    await userEvent.type(passwordInput, 'Password123!')

    expect(nameInput).toHaveValue('John Doe')
    expect(emailInput).toHaveValue('john@example.com')
    expect(passwordInput).toHaveValue('Password123!')
  })

  // ✅ Test 3: Shows validation errors on empty submit
  test('shows validation errors when form is submitted empty', async () => {
    render(<SignUp />)
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/enter full name/i)).toBeInTheDocument()
      expect(screen.getByText(/please select a role/i)).toBeInTheDocument()
    })
  })

  // ✅ Test 4: Role selection works
  test('selects job seeker and employer roles correctly', async () => {
    render(<SignUp />)

    await userEvent.click(screen.getByText('Job Seeker'))
    expect(screen.getByText('Job Seeker').closest('button')).toHaveClass('border-blue-500')

    await userEvent.click(screen.getByText('Employer'))
    expect(screen.getByText('Employer').closest('button')).toHaveClass('border-blue-500')
  })

  // ✅ Test 5: Password visibility toggle
  test('toggles password visibility when eye icon is clicked', async () => {
    render(<SignUp />)
    const passwordInput = screen.getByPlaceholderText('Create a strong password')
    const buttons = screen.getAllByRole('button')
    const toggleButton = buttons.find(b => b.getAttribute('type') === 'button' &&
      !b.textContent.includes('Job Seeker') &&
      !b.textContent.includes('Employer')
    )

    expect(passwordInput).toHaveAttribute('type', 'password')
    await userEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    await userEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  // ✅ Test 6: Shows loading state while submitting
  test('shows loading state when form is being submitted', async () => {
    axiosInstance.post.mockImplementation(() => new Promise(() => {}))

    render(<SignUp />)
    await fillValidForm()
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/creating account/i)).toBeInTheDocument()
    })
  })

  // ✅ Test 7: Shows error on failed registration
  test('shows error message when registration API fails', async () => {
    axiosInstance.post.mockRejectedValue({
      response: { data: { message: 'Email already exists' } },
    })

    render(<SignUp />)
    await fillValidForm()
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
    })
  })

  // ✅ Test 8: Login link is present
  test('renders a link to the login page', () => {
    render(<SignUp />)
    const link = screen.getByRole('link', { name: /sign in here/i })
    expect(link).toHaveAttribute('href', '/login')
  })

  // ✅ Test 9: Upload photo label is present
  test('renders the avatar upload button', () => {
    render(<SignUp />)
    expect(screen.getByText('Upload Photo')).toBeInTheDocument()
  })

})