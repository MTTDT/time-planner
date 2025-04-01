import '@testing-library/jest-dom'
import { render, screen, fireEvent, act } from '@testing-library/react'
import TODO from '@/app/components/TODO'

describe('TODO Component', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders TODO with 0 items in list', () => {
    render(<TODO />) 
    expect(screen.getByText("No tasks yet. Add one above!")).toBeInTheDocument()
  })

  it('adds new task to the TODO list when the name is entered and add button is clicked', () => {
    render(<TODO />) 
    const inputField = screen.getByPlaceholderText("Add a new task...")
    const taskName = "Test Task"
    
    fireEvent.change(inputField, { target: { value: taskName } })
    fireEvent.click(screen.getByTestId("add-task-button"))
    
    expect(screen.getByText(taskName)).toBeInTheDocument()
    expect(screen.queryByText("No tasks yet. Add one above!")).not.toBeInTheDocument()
  })

  it('adds task when pressing Enter key', () => {
    render(<TODO />)
    const inputField = screen.getByPlaceholderText("Add a new task...")
    const taskName = "Enter Key Task"
    
    fireEvent.change(inputField, { target: { value: taskName } })
    fireEvent.keyPress(inputField, { key: 'Enter', charCode: 13 })
    
    expect(screen.getByText(taskName)).toBeInTheDocument()
  })

  it('does not add empty task', () => {
    render(<TODO />)
    const inputField = screen.getByPlaceholderText("Add a new task...")
    
    fireEvent.change(inputField, { target: { value: '   ' } })
    fireEvent.click(screen.getByTestId("add-task-button"))
    
    expect(screen.getByText("No tasks yet. Add one above!")).toBeInTheDocument()
  })

  it('toggles task completion status', () => {
    render(<TODO />)
    const inputField = screen.getByPlaceholderText("Add a new task...")
    const taskName = "Task to Toggle"
    
    // Add task
    fireEvent.change(inputField, { target: { value: taskName } })
    fireEvent.click(screen.getByTestId("add-task-button"))
    
    // Toggle completion
    const toggleButton = screen.getByRole('button', { name: /toggle task/i })
    fireEvent.click(toggleButton)
    
    expect(screen.getByText(taskName)).toHaveClass('line-through')
    
    // Toggle back
    fireEvent.click(toggleButton)
    expect(screen.getByText(taskName)).not.toHaveClass('line-through')
  })

  it('removes a task', () => {
    render(<TODO />)
    const inputField = screen.getByPlaceholderText("Add a new task...")
    const taskName = "Task to Remove"
    
    // Add task
    fireEvent.change(inputField, { target: { value: taskName } })
    fireEvent.click(screen.getByTestId("add-task-button"))
    
    // Remove task
    const removeButton = screen.getByRole('button', { name: /remove task/i })
    fireEvent.click(removeButton)
    
    expect(screen.queryByText(taskName)).not.toBeInTheDocument()
    expect(screen.getByText("No tasks yet. Add one above!")).toBeInTheDocument()
  })

  it('removes all completed tasks', () => {
    render(<TODO />)
    const inputField = screen.getByPlaceholderText("Add a new task...")
    
    // Add two tasks
    fireEvent.change(inputField, { target: { value: "Task 1" } })
    fireEvent.click(screen.getByTestId("add-task-button"))
    
    fireEvent.change(inputField, { target: { value: "Task 2" } })
    fireEvent.click(screen.getByTestId("add-task-button"))
    
    // Complete first task
    const toggleButtons = screen.getAllByRole('button', { name: /toggle task/i })
    fireEvent.click(toggleButtons[0])
    
    // Remove completed
    const removeCompletedButton = screen.getByText(/Remove Completed Tasks/i)
    fireEvent.click(removeCompletedButton)
    
    expect(screen.queryByText("Task 1")).not.toBeInTheDocument()
    //expect(screen.getByText("Task 2")).toBeInTheDocument()
  })

  it('opens and closes the time limit modal', () => {
    render(<TODO />)
    
    // Add a task first
    fireEvent.change(screen.getByPlaceholderText("Add a new task..."), { target: { value: "Task with Time" } })
    fireEvent.click(screen.getByTestId("add-task-button"))
    
    // Open time limit modal
    const timeLimitButton = screen.getByText(/Time Limit/i)
    fireEvent.click(timeLimitButton)
    
    expect(screen.getByText(/Set Time Limit/i)).toBeInTheDocument()
    
    // Close modal
    const cancelButton = screen.getByText(/Cancel/i)
    fireEvent.click(cancelButton)
    
    expect(screen.queryByText(/Set Time Limit/i)).not.toBeInTheDocument()
  })

  it('sets a time limit for a task', () => {
    render(<TODO />)
    
    // Add a task
    fireEvent.change(screen.getByPlaceholderText("Add a new task..."), { target: { value: "Timed Task" } })
    fireEvent.click(screen.getByTestId("add-task-button"))
    
    // Open time limit modal
    const timeLimitButton = screen.getByText(/Time Limit/i)
    fireEvent.click(timeLimitButton)
    
    // Set 30 minutes
    const minutesInput = screen.getAllByRole('spinbutton')[2]
    fireEvent.change(minutesInput, { target: { value: '30' } })
    
    // Set limit
    const setLimitButton = screen.getByText(/Set Limit/i)
    fireEvent.click(setLimitButton)
    
    // Check that time is displayed
    expect(screen.getByText(/30m.*remaining/i)).toBeInTheDocument()
  })

  // it('shows notification when time is almost up', () => {
  //   render(<TODO />)
    
  //   // Add a task with short time limit
  //   fireEvent.change(screen.getByPlaceholderText("Add a new task..."), { target: { value: "Urgent Task" } })
  //   fireEvent.click(screen.getByTestId("add-task-button"))
    
  //   // Open time limit modal and set 1 minute
  //   fireEvent.click(screen.getByText(/Time Limit/i))
  //   fireEvent.change(screen.getAllByRole('spinbutton')[2], { target: { value: '10' } })
  //   fireEvent.click(screen.getByText(/Set Limit/i))
    
  //   // Fast-forward time to trigger notification
  //   act(() => {
  //     jest.advanceTimersByTime(55 * 1000) // 55 seconds
  //   })
    
  //   expect(screen.getByText(/10 minutes left!/i)).toBeInTheDocument()
  // })

  it('toggles settings panel', () => {
    render(<TODO />)
    
    // Open settings
    const settingsButton = screen.getByText(/Timer notification settings/i)
    fireEvent.click(settingsButton)
    
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument()
    
    // Close settings
    fireEvent.click(settingsButton)
    expect(screen.queryByText(/Notifications/i)).not.toBeInTheDocument()
  })

  
})