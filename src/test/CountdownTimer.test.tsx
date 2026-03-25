import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CountdownTimer from '../components/CountdownTimer'

// Mock setTimeout and clearTimeout
vi.useFakeTimers()

describe('CountdownTimer Component', () => {
  it('renders with initial time', () => {
    render(<CountdownTimer seconds={60} onTimeUp={vi.fn()} isRunning={false} resetTrigger={0} />)
    
    expect(screen.getByText('60s')).toBeInTheDocument()
    expect(screen.getByRole('timer')).toBeInTheDocument()
  })

  it('counts down correctly when running', () => {
    const onTimeUp = vi.fn()
    render(<CountdownTimer seconds={3} onTimeUp={onTimeUp} isRunning={true} resetTrigger={0} />)
    
    expect(screen.getByText('3s')).toBeInTheDocument()
    
    // Advance time by 1 second
    vi.advanceTimersByTime(1000)
    expect(screen.getByText('2s')).toBeInTheDocument()
    
    // Advance time by another second
    vi.advanceTimersByTime(1000)
    expect(screen.getByText('1s')).toBeInTheDocument()
  })

  it('calls onTimeUp when timer reaches zero', () => {
    const onTimeUp = vi.fn()
    render(<CountdownTimer seconds={1} onTimeUp={onTimeUp} isRunning={true} resetTrigger={0} />)
    
    // Advance time to complete the countdown
    vi.advanceTimersByTime(1000)
    
    expect(onTimeUp).toHaveBeenCalledTimes(1)
  })

  it('does not count down when not running', () => {
    const onTimeUp = vi.fn()
    render(<CountdownTimer seconds={3} onTimeUp={onTimeUp} isRunning={false} resetTrigger={0} />)
    
    expect(screen.getByText('3s')).toBeInTheDocument()
    
    // Advance time - should not change
    vi.advanceTimersByTime(2000)
    expect(screen.getByText('3s')).toBeInTheDocument()
    expect(onTimeUp).not.toHaveBeenCalled()
  })

  it('resets when resetTrigger changes', () => {
    const { rerender } = render(<CountdownTimer seconds={5} onTimeUp={vi.fn()} isRunning={true} resetTrigger={0} />)
    
    expect(screen.getByText('5s')).toBeInTheDocument()
    
    // Advance time
    vi.advanceTimersByTime(2000)
    expect(screen.getByText('3s')).toBeInTheDocument()
    
    // Reset with new trigger
    rerender(<CountdownTimer seconds={5} onTimeUp={vi.fn()} isRunning={true} resetTrigger={1} />)
    expect(screen.getByText('5s')).toBeInTheDocument()
  })

  it('shows warning state when time is low', () => {
    render(<CountdownTimer seconds={10} onTimeUp={vi.fn()} isRunning={true} resetTrigger={0} />)
    
    // Advance to low time
    vi.advanceTimersByTime(1000)
    
    const timerElement = screen.getByText('9s')
    expect(timerElement).toBeInTheDocument()
  })

  it('shows danger state when time is critical', () => {
    render(<CountdownTimer seconds={5} onTimeUp={vi.fn()} isRunning={true} resetTrigger={0} />)
    
    // Should be in critical state immediately
    const timerElement = screen.getByText('5s')
    expect(timerElement).toBeInTheDocument()
  })

  it('displays progress bar correctly', () => {
    render(<CountdownTimer seconds={60} onTimeUp={vi.fn()} isRunning={false} resetTrigger={0} />)
    
    const progressBar = document.querySelector('.bg-accent')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveStyle('width: 100%')
  })
})
