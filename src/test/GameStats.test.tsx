import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GameStats from '../components/GameStats'

describe('GameStats Component', () => {
  it('renders lives and coins correctly', () => {
    render(<GameStats lives={3} coins={100} />)
    
    expect(screen.getByText('100')).toBeInTheDocument()
    
    // Check for heart icons (lives)
    const hearts = screen.getAllByRole('img', { hidden: true })
    expect(hearts).toHaveLength(3) // Default maxLives is 3
  })

  it('shows correct number of filled hearts', () => {
    render(<GameStats lives={2} coins={50} />)
    
    const hearts = screen.getAllByRole('img', { hidden: true })
    const filledHearts = hearts.filter(heart => 
      heart.classList.contains('fill-destructive')
    )
    const emptyHearts = hearts.filter(heart => 
      heart.classList.contains('text-muted-foreground')
    )
    
    expect(filledHearts).toHaveLength(2)
    expect(emptyHearts).toHaveLength(1)
  })

  it('respects custom maxLives', () => {
    render(<GameStats lives={3} coins={50} maxLives={5} />)
    
    const hearts = screen.getAllByRole('img', { hidden: true })
    expect(hearts).toHaveLength(5)
    
    const filledHearts = hearts.filter(heart => 
      heart.classList.contains('fill-destructive')
    )
    expect(filledHearts).toHaveLength(3)
  })

  it('displays zero lives correctly', () => {
    render(<GameStats lives={0} coins={0} />)
    
    const hearts = screen.getAllByRole('img', { hidden: true })
    const filledHearts = hearts.filter(heart => 
      heart.classList.contains('fill-destructive')
    )
    const emptyHearts = hearts.filter(heart => 
      heart.classList.contains('text-muted-foreground')
    )
    
    expect(filledHearts).toHaveLength(0)
    expect(emptyHearts).toHaveLength(3)
  })

  it('displays zero coins correctly', () => {
    render(<GameStats lives={3} coins={0} />)
    
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('handles large coin values', () => {
    render(<GameStats lives={3} coins={9999} />)
    
    expect(screen.getByText('9999')).toBeInTheDocument()
  })

  it('has proper CSS classes for styling', () => {
    render(<GameStats lives={2} coins={75} />)
    
    const container = document.querySelector('.flex.items-center.gap-4')
    expect(container).toBeInTheDocument()
    
    const livesContainer = document.querySelector('.px-3.py-1\\.5.rounded-xl')
    expect(livesContainer).toBeInTheDocument()
    
    const coinsContainer = screen.getByText('75').closest('.px-3.py-1\\.5.rounded-xl')
    expect(coinsContainer).toBeInTheDocument()
  })
})
