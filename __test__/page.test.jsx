import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../app/page'
import TODO from '@/app/components/TODO'
 
describe('Page', () => {
  it('renders a heading', () => {
    render(<TODO />)
 
    const heading = screen.getByRole('heading', { level: 1 })
 
    expect(heading).toBeInTheDocument()
  })
})