import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Home from '../app/page'
import TODO from '@/app/components/TODO'
 
describe('Page', () => {
  it('renders TODO with 0 items in list', () => {
    render(<TODO />) 
  
    const emptyStateMessage = screen.getByText("No tasks yet. Add one above!")
    expect(emptyStateMessage).toBeInTheDocument()
  })
  it('adds new task to the TODO list when the ame is entered and add button is clicked', () => {
    render(<TODO />) 

       // Find the input field
       const inputField = screen.getByPlaceholderText("Add a new task...")

       // Type a task name
      const taskName = "Test Task"
      fireEvent.change(inputField, { target: { value: taskName } })

        // Find and click the add button (it has the PlusCircle icon)
      const addButton = screen.getByTestId("add-task-button") // The button doesn't have text, just an icon
      fireEvent.click(addButton)

      // Check if the task was added to the list
    const addedTask = screen.getByText(taskName)
    expect(addedTask).toBeInTheDocument()

    expect(screen.queryByText("No tasks yet. Add one above!")).not.toBeInTheDocument()

  })
})