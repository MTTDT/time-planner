"use client"

import { useState } from "react"
import { PlusCircle, Trash2, X, Check, ClipboardList } from "lucide-react"

export default function TODO() {
  const [tasks, setTasks] = useState([])
  const [newTaskText, setNewTaskText] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  // Add a new task
  const addTask = () => {
    if (newTaskText.trim() === "") return

    const newTask = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
    }

    setTasks([...tasks, newTask])
    setNewTaskText("")
  }

  // Toggle task completion status
  const toggleTask = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  // Remove a single task
  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Remove all completed tasks
  const removeCompletedTasks = () => {
    setTasks(tasks.filter((task) => !task.completed))
  }

  // Handle key press for adding tasks
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask()
    }
  }

  // Toggle the todo list visibility
  const toggleTodoList = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Fixed button to toggle the todo list */}
      <button
        onClick={toggleTodoList}
        className="z-40  text-primary-black p-4 rounded-full hover:bg-gray-200 transition-all"
        aria-label="Toggle Todo List"
      >
        <ClipboardList className="h-6 w-6" />
      </button>

      {/* Overlay that appears when todo list is open */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={toggleTodoList} />}

      {/* Todo list container that slides in from above */}
      <div
        className={`fixed left-0 right-0 z-50 flex justify-center transition-transform duration-300 ease-in-out ${
          isOpen ? "top-4 transform translate-y-0" : "top-0 transform -translate-y-full"
        }`}
      >
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center p-4 border-b">
            <h1 className="text-2xl font-bold">Todo List</h1>
            <button onClick={toggleTodoList} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Add new task input */}
            <div className="flex mb-4">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={addTask}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-r-lg hover:bg-primary/90"
              >
                <PlusCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Task list */}
            <div className="space-y-2 mb-4 max-h-[60vh] overflow-y-auto">
              {tasks.length === 0 ? (
                <p className="text-center text-muted-foreground">No tasks yet. Add one above!</p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center p-3 rounded-lg ${
                      task.completed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mr-2 flex-shrink-0 h-5 w-5 rounded-full border ${
                        task.completed ? "border-green-500 bg-green-500 text-white" : "border-red-500"
                      } flex items-center justify-center`}
                    >
                      {task.completed && <Check className="h-3 w-3" />}
                    </button>
                    <span className={`flex-grow ${task.completed ? "line-through" : ""}`}>{task.text}</span>
                    <button onClick={() => removeTask(task.id)} className="ml-2 text-gray-500 hover:text-gray-700">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Remove completed tasks button */}
            {tasks.some((task) => task.completed) && (
              <button
                onClick={removeCompletedTasks}
                className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Remove Completed Tasks
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

