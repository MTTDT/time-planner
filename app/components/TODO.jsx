"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, X, Check, ClipboardList, Clock, Bell, ChevronUp, ChevronDown } from "lucide-react"
import PointsNumber from "./PointsNumber"
import { getPoints, addPoint, subscribe, clearPoints } from "./pointsNumber";

export default function TODO() {
  const [tasks, setTasks] = useState([])
  const [newTaskText, setNewTaskText] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [timeLimitModal, setTimeLimitModal] = useState({ isOpen: false, taskId: null })
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(30)
  const [notifications, setNotifications] = useState([])
  const [currentTime, setCurrentTime] = useState(Date.now())

  
  // Update current time every second to refresh time displays
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [])

  // Check for expired time limits every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()

      tasks.forEach((task) => {
        if (task.timeLimit && task.timeLimit > 0 && !task.completed) {
          const timeRemaining = task.timeLimit - now

          // If time limit has been reached and notification hasn't been shown yet
          if (timeRemaining <= 0 && !notifications.some((n) => n.taskId === task.id)) {
            setNotifications((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                taskId: task.id,
                taskText: task.text,
                timestamp: now,
              },
            ])
          }
        }
      })
    }, 1000) // Check every second

    return () => clearInterval(interval)
  }, [tasks, notifications])

  // Check if there are any active tasks with time limits
  const hasActiveTimeLimitTasks = tasks.some((task) => task.timeLimit && !task.completed)

  // Add a new task
  const addTask = () => {
    if (newTaskText.trim() === "") return

    const newTask = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      timeLimit: null,
    }

    setTasks([...tasks, newTask])
    setNewTaskText("")
  }


  // Toggle task completion status
  const toggleTask = (id) => {

 

  // Find the current task state before updating
  const currentTask = tasks.find((task) => task.id === id)
  const isCurrentlyCompleted = currentTask?.completed

  // Update tasks
  setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))

  // Remove notification if task is completed
  if (tasks.find((task) => task.id === id)?.completed === false) {
    setNotifications(notifications.filter((notification) => notification.taskId !== id))
  }

  // Only add points if the task is being marked as completed (not uncompleted)
  if (isCurrentlyCompleted === false) {
    console.log("Adding point...")
    addPoint()
  }
  }

  // Remove a single task
  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
    // Remove any notifications for this task
    setNotifications(notifications.filter((notification) => notification.taskId !== id))
  }

  // Remove all completed tasks
  const removeCompletedTasks = () => {
    const completedTaskIds = tasks.filter((task) => task.completed).map((task) => task.id)
    setTasks(tasks.filter((task) => !task.completed))
    // Remove notifications for completed tasks
    setNotifications(notifications.filter((notification) => !completedTaskIds.includes(notification.taskId)))
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

  // Open time limit modal for a task
  const openTimeLimitModal = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task && task.timeLimit) {
      // Calculate remaining time
      const timeRemaining = task.timeLimit - Date.now()
      if (timeRemaining > 0) {
        const remainingDays = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
        const remainingHours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const remainingMinutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
        setDays(remainingDays)
        setHours(remainingHours)
        setMinutes(remainingMinutes)
      } else {
        setDays(0)
        setHours(0)
        setMinutes(30)
      }
    } else {
      setDays(0)
      setHours(0)
      setMinutes(30)
    }

    setTimeLimitModal({ isOpen: true, taskId })
  }

  // Close time limit modal
  const closeTimeLimitModal = () => {
    setTimeLimitModal({ isOpen: false, taskId: null, fromNotification: false })
  }

  // Set time limit for a task
  const setTimeLimit = () => {
    if (timeLimitModal.taskId) {
      const timeInMilliseconds = days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000
      const deadline = Date.now() + timeInMilliseconds

      setTasks(tasks.map((task) => (task.id === timeLimitModal.taskId ? { ...task, timeLimit: deadline } : task)))

      // If this was opened from a notification, dismiss the notification
      if (timeLimitModal.fromNotification) {
        setNotifications(notifications.filter((notification) => notification.taskId !== timeLimitModal.taskId))
      }

      closeTimeLimitModal()
    }
  }

  // Format time remaining for display
  const formatTimeRemaining = (timeLimit) => {
    if (!timeLimit) return null

    const timeRemaining = timeLimit - currentTime

    if (timeRemaining <= 0) return "Time's up!"

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

    let formattedTime = ""
    if (days > 0) formattedTime += `${days}d `
    if (hours > 0) formattedTime += `${hours}h `
    if (minutes > 0) formattedTime += `${minutes}m `
    formattedTime += `${seconds}s remaining`

    return formattedTime
  }

  // Prolong time limit
  const prolongTimeLimit = (taskId) => {
    // Set default values for the time limit modal
    setDays(0)
    setHours(0)
    setMinutes(30)

    // Open the time limit modal for this task
    setTimeLimitModal({ isOpen: true, taskId, fromNotification: true })
  }

  // Dismiss notification
  const dismissNotification = (notificationId) => {
    setNotifications(notifications.filter((notification) => notification.id !== notificationId))
  }

  return (
    <>
      {/* Fixed button to toggle the todo list with clock animation */}
      <div className="relative">
        <div className="flex items-center">
        <button
          onClick={toggleTodoList}
          className="z-40 text-primary-black p-4 rounded-full hover:bg-gray-200 transition-all"
          aria-label="Toggle Todo List"
        >
          <ClipboardList className="h-6 w-6" />
        </button>
        <PointsNumber/>
        </div>

        {/* Clock animation that appears when there are active tasks with time limits */}
        {hasActiveTimeLimitTasks && (
          <div className="absolute -top-1 -right-1 animate-pulse">
            <div className="relative">
              <Clock className="h-5 w-5 text-primary animate-spin-slow" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </div>
          </div>
        )}
      </div>

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
                    <div className="flex-grow">
                      <span className={`${task.completed ? "line-through" : ""}`}>{task.text}</span>
                      {task.timeLimit && !task.completed && (
                        <div className="text-xs mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimeRemaining(task.timeLimit)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => openTimeLimitModal(task.id)}
                        className="ml-2 text-gray-500 hover:text-gray-700 px-2 py-1 text-xs rounded-md bg-gray-200 hover:bg-gray-300"
                      >
                        Time Limit
                      </button>
                      <button onClick={() => removeTask(task.id)} className="ml-2 text-gray-500 hover:text-gray-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
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

      {/* Time Limit Modal */}
      {timeLimitModal.isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={closeTimeLimitModal} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-80">
            <h2 className="text-xl font-bold mb-4">Set Time Limit</h2>

            <div className="flex flex-wrap justify-between mb-6 gap-y-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
                <div className="flex items-center">
                  <button
                    onClick={() => setDays((prev) => Math.max(0, prev - 1))}
                    className="p-1 bg-gray-200 rounded-l-md"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={days}
                    onChange={(e) => setDays(Math.max(0, Number.parseInt(e.target.value) || 0))}
                    className="w-full text-center border-y py-1"
                  />
                  <button onClick={() => setDays((prev) => prev + 1)} className="p-1 bg-gray-200 rounded-r-md">
                    <ChevronUp className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="w-1/2 pr-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                <div className="flex items-center">
                  <button
                    onClick={() => setHours((prev) => Math.max(0, prev - 1))}
                    className="p-1 bg-gray-200 rounded-l-md"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => setHours(Math.max(0, Math.min(23, Number.parseInt(e.target.value) || 0)))}
                    className="w-full text-center border-y py-1"
                  />
                  <button
                    onClick={() => setHours((prev) => Math.min(23, prev + 1))}
                    className="p-1 bg-gray-200 rounded-r-md"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="w-1/2 pl-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Minutes</label>
                <div className="flex items-center">
                  <button
                    onClick={() => setMinutes((prev) => Math.max(0, prev - 5))}
                    className="p-1 bg-gray-200 rounded-l-md"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    step="5"
                    value={minutes}
                    onChange={(e) => setMinutes(Math.max(0, Math.min(59, Number.parseInt(e.target.value) || 0)))}
                    className="w-full text-center border-y py-1"
                  />
                  <button
                    onClick={() => setMinutes((prev) => Math.min(59, prev + 5))}
                    className="p-1 bg-gray-200 rounded-r-md"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={closeTimeLimitModal} className="px-4 py-2 border rounded-md hover:bg-gray-100">
                Cancel
              </button>
              <button
                onClick={setTimeLimit}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Set Limit
              </button>
            </div>
          </div>
        </>
      )}

      {/* Notifications - positioned at 3/4 from the top */}
      <div className="fixed right-0 top-3/4 p-4 z-50 space-y-4 max-w-sm w-full">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-red-500 animate-slide-in-right"
          >
            <div className="flex items-center mb-2">
              <Bell className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="font-bold text-lg">Time's up!</h3>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-3">{notification.taskText}</p>

            <div className="flex justify-between gap-2">
              <button
                onClick={() => prolongTimeLimit(notification.taskId)}
                className="flex-1 px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                Prolong Limit
              </button>
              <button
                onClick={() => {
                  toggleTask(notification.taskId)
                  dismissNotification(notification.id)
                }}
                className="flex-1 px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
              >
                Completed
              </button>
              <button
                onClick={() => {
                  removeTask(notification.taskId)
                  dismissNotification(notification.id)
                }}
                className="flex-1 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

