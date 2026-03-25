import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import App from '../App'

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

describe('App Routing', () => {
  test('renders login page at root route', () => {
    renderWithProviders(<App />)
    expect(screen.getByText(/treasure hunt/i)).toBeInTheDocument()
  })

  test('redirects /student-auth to root', () => {
    renderWithProviders(<App />)
    // Navigate to /student-auth and verify it redirects
    window.history.pushState({}, '', '/student-auth')
    expect(window.location.pathname).toBe('/')
  })

  test('renders 404 page for unknown routes', () => {
    renderWithProviders(<App />)
    window.history.pushState({}, '', '/unknown-route')
    expect(screen.getByText(/page not found/i)).toBeInTheDocument()
  })
})

describe('App Component Structure', () => {
  test('renders without crashing', () => {
    renderWithProviders(<App />)
    expect(document.body).toBeInTheDocument()
  })

  test('has proper routing structure', () => {
    renderWithProviders(<App />)
    // Check that main navigation elements exist
    expect(document.querySelector('nav')).toBeInTheDocument()
  })
})
