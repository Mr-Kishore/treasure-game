import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from '../pages/Index'

// Mock API functions
const mockRegisterStudent = vi.fn()
const mockLoginStudent = vi.fn()
const mockGetStoredStudent = vi.fn()
const mockPlayClickSound = vi.fn()
const mockPlaySuccessSound = vi.fn()
const mockPlayErrorSound = vi.fn()

vi.mock('../lib/api', () => ({
  registerStudent: mockRegisterStudent,
  loginStudent: mockLoginStudent,
  getStoredStudent: mockGetStoredStudent,
  setSession: vi.fn(),
  clearSession: vi.fn(),
}))

vi.mock('../lib/sounds', () => ({
  playClickSound: mockPlayClickSound,
  playSuccessSound: mockPlaySuccessSound,
  playErrorSound: mockPlayErrorSound,
}))

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={testQueryClient}>
      <TooltipProvider>
        <BrowserRouter>
          {ui}
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

describe('Authentication Flow E2E Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetStoredStudent.mockReturnValue(null)
  })

  describe('Student Registration Flow', () => {
    it('should complete full registration flow successfully', async () => {
      const mockResponse = {
        token: 'test-token',
        student: { id: 1, username: 'testuser', name: 'Test User', age: 10 }
      }
      mockRegisterStudent.mockResolvedValue(mockResponse)

      renderWithProviders(<Index />)

      // Should start in login mode
      expect(screen.getByText(/login/i)).toBeInTheDocument()
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()

      // Switch to signup mode
      fireEvent.click(screen.getByText(/sign up/i))
      expect(mockPlayClickSound).toHaveBeenCalled()

      // Fill registration form
      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: 'testuser' }
      })
      fireEvent.change(screen.getByPlaceholderText(/full name/i), {
        target: { value: 'Test User' }
      })
      fireEvent.change(screen.getByPlaceholderText(/age/i), {
        target: { value: '10' }
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'password123' }
      })

      // Submit registration
      fireEvent.click(screen.getByText(/create account/i))

      await waitFor(() => {
        expect(mockRegisterStudent).toHaveBeenCalledWith({
          username: 'testuser',
          name: 'Test User',
          age: 10,
          password: 'password123'
        })
      })

      await waitFor(() => {
        expect(mockPlaySuccessSound).toHaveBeenCalled()
      })
    })

    it('should show validation errors for incomplete registration', async () => {
      renderWithProviders(<Index />)

      // Switch to signup mode
      fireEvent.click(screen.getByText(/sign up/i))

      // Submit without filling form
      fireEvent.click(screen.getByText(/create account/i))

      await waitFor(() => {
        expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument()
        expect(mockPlayErrorSound).toHaveBeenCalled()
      })

      expect(mockRegisterStudent).not.toHaveBeenCalled()
    })

    it('should validate age range during registration', async () => {
      renderWithProviders(<Index />)

      // Switch to signup mode
      fireEvent.click(screen.getByText(/sign up/i))

      // Fill form with invalid age
      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: 'testuser' }
      })
      fireEvent.change(screen.getByPlaceholderText(/full name/i), {
        target: { value: 'Test User' }
      })
      fireEvent.change(screen.getByPlaceholderText(/age/i), {
        target: { value: '25' }
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'password123' }
      })

      // Submit registration
      fireEvent.click(screen.getByText(/create account/i))

      await waitFor(() => {
        expect(screen.getByText(/age must be between 4 and 18/i)).toBeInTheDocument()
        expect(mockPlayErrorSound).toHaveBeenCalled()
      })

      expect(mockRegisterStudent).not.toHaveBeenCalled()
    })
  })

  describe('Student Login Flow', () => {
    it('should complete full login flow successfully', async () => {
      const mockResponse = {
        token: 'test-token',
        student: { id: 1, username: 'testuser', name: 'Test User', age: 10 }
      }
      mockLoginStudent.mockResolvedValue(mockResponse)

      renderWithProviders(<Index />)

      // Fill login form
      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: 'testuser' }
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'password123' }
      })

      // Submit login
      fireEvent.click(screen.getByText(/login/i))

      await waitFor(() => {
        expect(mockLoginStudent).toHaveBeenCalledWith('testuser', 'password123')
      })

      await waitFor(() => {
        expect(mockPlaySuccessSound).toHaveBeenCalled()
      })
    })

    it('should show validation errors for incomplete login', async () => {
      renderWithProviders(<Index />)

      // Submit without filling form
      fireEvent.click(screen.getByText(/login/i))

      await waitFor(() => {
        expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument()
        expect(mockPlayErrorSound).toHaveBeenCalled()
      })

      expect(mockLoginStudent).not.toHaveBeenCalled()
    })

    it('should handle login errors gracefully', async () => {
      mockLoginStudent.mockRejectedValue(new Error('Invalid credentials'))

      renderWithProviders(<Index />)

      // Fill login form
      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: 'testuser' }
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'wrongpassword' }
      })

      // Submit login
      fireEvent.click(screen.getByText(/login/i))

      await waitFor(() => {
        expect(mockLoginStudent).toHaveBeenCalledWith('testuser', 'wrongpassword')
      })

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
        expect(mockPlayErrorSound).toHaveBeenCalled()
      })
    })
  })

  describe('Mode Switching', () => {
    it('should switch between login and signup modes', () => {
      renderWithProviders(<Index />)

      // Should start in login mode
      expect(screen.getByText(/login/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/full name/i)).not.toBeInTheDocument()

      // Switch to signup mode
      fireEvent.click(screen.getByText(/sign up/i))
      expect(mockPlayClickSound).toHaveBeenCalled()

      expect(screen.getByText(/create account/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/age/i)).toBeInTheDocument()

      // Switch back to login mode
      fireEvent.click(screen.getByText(/login/i))
      expect(mockPlayClickSound).toHaveBeenCalled()

      expect(screen.getByText(/login/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/full name/i)).not.toBeInTheDocument()
      expect(screen.getByPlaceholderText(/age/i)).not.toBeInTheDocument()
    })

    it('should clear form fields when switching modes', () => {
      renderWithProviders(<Index />)

      // Fill login form
      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: 'testuser' }
      })
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'password123' }
      })

      // Switch to signup mode
      fireEvent.click(screen.getByText(/sign up/i))

      // Fields should be cleared
      expect(screen.getByPlaceholderText(/username/i)).toHaveValue('')
      expect(screen.getByPlaceholderText(/password/i)).toHaveValue('')

      // Fill signup form
      fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: 'newuser' }
      })
      fireEvent.change(screen.getByPlaceholderText(/full name/i), {
        target: { value: 'New User' }
      })

      // Switch back to login mode
      fireEvent.click(screen.getByText(/login/i))

      // Fields should be cleared again
      expect(screen.getByPlaceholderText(/username/i)).toHaveValue('')
      expect(screen.getByPlaceholderText(/password/i)).toHaveValue('')
    })
  })

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', () => {
      renderWithProviders(<Index />)

      const passwordInput = screen.getByPlaceholderText(/password/i)
      const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i })

      // Password should be hidden by default
      expect(passwordInput).toHaveAttribute('type', 'password')

      // Click to show password
      fireEvent.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')

      // Click to hide password
      fireEvent.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'password')
    })
  })
})
