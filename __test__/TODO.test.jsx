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

  // Patikrina ar sukuriamas TODO sąrašas be užduočių
  it('renders TODO with 0 items in list', () => {
    render(<TODO />) 
    expect(screen.getByText("No tasks yet. Add one above!")).toBeInTheDocument()
  })

  // Patikrina ar nauja užduotis pridedama prie sąrašo, kai įvedamas pavadinimas ir paspaudžiamas mygtukas
  it('adds new task to the TODO list when the name is entered and add button is clicked', () => {
    render(<TODO />) 
    const inputField = screen.getByPlaceholderText("Add a new task...")
    const taskName = "Test Task"
    
    fireEvent.change(inputField, { target: { value: taskName } })
    fireEvent.click(screen.getByTestId("add-task-button"))
    
    expect(screen.getByText(taskName)).toBeInTheDocument()
    expect(screen.queryByText("No tasks yet. Add one above!")).not.toBeInTheDocument()
  })

  // Patikrina ar užduotis prideda spaudžiant Enter klavišą
  it('adds task when pressing Enter key', () => {
    render(<TODO />)
    const inputField = screen.getByPlaceholderText("Add a new task...")
    const taskName = "Enter Key Task"
    
    fireEvent.change(inputField, { target: { value: taskName } })
    fireEvent.keyPress(inputField, { key: 'Enter', charCode: 13 })
    
    expect(screen.getByText(taskName)).toBeInTheDocument()
  })

  // Patikrina ar nepridedama tuščia užduotis
  it('does not add empty task', () => {
    render(<TODO />)
    const inputField = screen.getByPlaceholderText("Add a new task...")
    
    fireEvent.change(inputField, { target: { value: '   ' } })
    fireEvent.click(screen.getByTestId("add-task-button"))
    
    expect(screen.getByText("No tasks yet. Add one above!")).toBeInTheDocument()
  })

  // Patikrina ar užduoties statusas (įvykdyta/neįvykdyta) keičiasi
  it('toggles task completion status', () => {
    render(<TODO />)
    const inputField = screen.getByPlaceholderText("Add a new task...")
    const taskName = "Task to Toggle"
    
    fireEvent.change(inputField, { target: { value: taskName } })
    fireEvent.click(screen.getByTestId("add-task-button"))
    
    const toggleButton = screen.getByRole('button', { name: /toggle task/i })
    fireEvent.click(toggleButton)
    
    expect(screen.getByText(taskName)).toHaveClass('line-through')
    
    // Statuso grąžinimas atgal
    fireEvent.click(toggleButton)
    expect(screen.getByText(taskName)).not.toHaveClass('line-through')
  })

  // Patikrina ar užduotis pašalinama iš sąrašo
  it('removes a task', () => {
    render(<TODO />)
    const inputField = screen.getByPlaceholderText("Add a new task...")
    const taskName = "Task to Remove"
    
    // Pridedama užduotis
    fireEvent.change(inputField, { target: { value: taskName } })
    fireEvent.click(screen.getByTestId("add-task-button"))
    
    // Užduoties pašalinimas
    const removeButton = screen.getByRole('button', { name: /remove task/i })
    fireEvent.click(removeButton)
    
    expect(screen.queryByText(taskName)).not.toBeInTheDocument()
    expect(screen.getByText("No tasks yet. Add one above!")).toBeInTheDocument()
  })

  // Patikrina ar pašalinamos visos įvykdytos užduotys
  it('removes all completed tasks', () => {
    render(<TODO />)
    const inputField = screen.getByPlaceholderText("Add a new task...")
    
    fireEvent.change(inputField, { target: { value: "Task 1" } })
    fireEvent.click(screen.getByTestId("add-task-button"))
    
    fireEvent.change(inputField, { target: { value: "Task 2" } })
    fireEvent.click(screen.getByTestId("add-task-button"))
    
    const toggleButtons = screen.getAllByRole('button', { name: /toggle task/i })
    fireEvent.click(toggleButtons[0])
    
    const removeCompletedButton = screen.getByText(/Remove Completed Tasks/i)
    fireEvent.click(removeCompletedButton)
    
    expect(screen.queryByText("Task 1")).not.toBeInTheDocument()
  })

  // Patikrina ar laiko limito modalas atsidaro ir užsidaro
  it('opens and closes the time limit modal', () => {
    render(<TODO />)
    
    // Pirmiausia pridedama užduotis
    fireEvent.change(screen.getByPlaceholderText("Add a new task..."), { target: { value: "Task with Time" } })
    fireEvent.click(screen.getByTestId("add-task-button"))
    
    // Laiko limito modalo atidarymas
    const timeLimitButton = screen.getByText(/Time Limit/i)
    fireEvent.click(timeLimitButton)
    
    expect(screen.getByText(/Set Time Limit/i)).toBeInTheDocument()
    
    // Modalo uždarymas
    const cancelButton = screen.getByText(/Cancel/i)
    fireEvent.click(cancelButton)
    
    expect(screen.queryByText(/Set Time Limit/i)).not.toBeInTheDocument()
  })

  // Patikrina ar nustatomas užduoties laiko limitas
  it('sets a time limit for a task', () => {
    render(<TODO />)
    
    fireEvent.change(screen.getByPlaceholderText("Add a new task..."), { target: { value: "Timed Task" } })
    fireEvent.click(screen.getByTestId("add-task-button"))
    
    const timeLimitButton = screen.getByText(/Time Limit/i)
    fireEvent.click(timeLimitButton)
    
    const minutesInput = screen.getAllByRole('spinbutton')[2]
    fireEvent.change(minutesInput, { target: { value: '30' } })
    
    const setLimitButton = screen.getByText(/Set Limit/i)
    fireEvent.click(setLimitButton)
    
    expect(screen.getByText(/30m.*remaining/i)).toBeInTheDocument()
  })

  // Patikrina ar nustatymų panelė atsidaro ir užsidaro
  it('toggles settings panel', () => {
    render(<TODO />)
    
    const settingsButton = screen.getByText(/Timer notification settings/i)
    fireEvent.click(settingsButton)
    
    expect(screen.getByText(/Notifications/i)).toBeInTheDocument()
    
    fireEvent.click(settingsButton)
    expect(screen.queryByText(/Notifications/i)).not.toBeInTheDocument()
  })
})