import { render } from '@testing-library/react'
import Page from '../app/page'
import CalendarTriple from '../app/components/CalendarTriple'
 
it('renders homepage unchanged', () => {
  const { container } = render(<CalendarTriple />)
  expect(container).toMatchSnapshot()
})