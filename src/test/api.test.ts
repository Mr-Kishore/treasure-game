import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { registerStudent, loginStudent, getMe, saveProgress, getProgress, setSession, getStoredStudent, clearSession } from '../lib/api'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('API Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorageMock.clear()
  })

  describe('Authentication', () => {
    it('should register a student successfully', async () => {
      const mockResponse = {
        token: 'test-token',
        student: { id: 1, username: 'testuser', name: 'Test User', age: 10 }
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await registerStudent({
        username: 'testuser',
        name: 'Test User',
        age: 10,
        password: 'password123'
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          name: 'Test User',
          age: 10,
          password: 'password123'
        })
      })
      expect(result).toEqual(mockResponse)
    })

    it('should login a student successfully', async () => {
      const mockResponse = {
        token: 'test-token',
        student: { id: 1, username: 'testuser', name: 'Test User', age: 10 }
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await loginStudent('testuser', 'password123')

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser', password: 'password123' })
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle authentication errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' })
      })

      await expect(loginStudent('testuser', 'wrongpassword')).rejects.toThrow('Invalid credentials')
    })

    it('should include auth token in headers when token exists', async () => {
      localStorageMock.getItem.mockReturnValue('test-token')
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ student: { id: 1, username: 'testuser', name: 'Test User', age: 10 } })
      })

      await getMe()

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      })
    })
  })

  describe('Progress Management', () => {
    it('should save progress successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })

      await saveProgress(1, 100)

      expect(mockFetch).toHaveBeenCalledWith('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: 1, score: 100 })
      })
    })

    it('should get progress successfully', async () => {
      const mockProgress = {
        progress: [
          { level: 1, score: 100, completed_at: '2023-01-01T00:00:00Z' },
          { level: 2, score: 80, completed_at: '2023-01-02T00:00:00Z' }
        ]
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProgress)
      })

      const result = await getProgress()

      expect(mockFetch).toHaveBeenCalledWith('/api/progress', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      expect(result).toEqual(mockProgress)
    })
  })

  describe('Session Management', () => {
    it('should set session in localStorage', () => {
      const mockStudent = { id: 1, username: 'testuser', name: 'Test User', age: 10 }
      const token = 'test-token'

      setSession(token, mockStudent)

      expect(localStorageMock.setItem).toHaveBeenCalledWith('student_token', token)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('student', JSON.stringify(mockStudent))
    })

    it('should get stored student from localStorage', () => {
      const mockStudent = { id: 1, username: 'testuser', name: 'Test User', age: 10 }
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'student') return JSON.stringify(mockStudent)
        if (key === 'student_token') return 'test-token'
        return null
      })

      const result = getStoredStudent()

      expect(result).toEqual({ student: mockStudent, token: 'test-token' })
    })

    it('should return null when no student is stored', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = getStoredStudent()

      expect(result).toBeNull()
    })

    it('should clear session from localStorage', () => {
      clearSession()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('student_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('student')
    })
  })
})
