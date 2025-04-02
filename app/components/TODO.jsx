"use client"

import { useState, useEffect } from "react"
import { 
  PlusCircle,
  Trash2,
  X,
  Check,
  ClipboardList,
  Clock,
  Bell,
  ChevronUp,
  ChevronDown,
  Settings,
  Volume2,
  VolumeX,
  BellRing,
 } from "lucide-react"
import PointsNumber from "./PointsNumber"
import { getPoints, addPoint, subscribe, clearPoints } from "./pointsStorage";


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
  // Track tasks that have already had notifications shown
  const [notifiedTasks, setNotifiedTasks] = useState({
    tenMinWarning: new Set(),
    timeUp: new Set(),
  })

  // Settings state
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [notificationMinutes, setNotificationMinutes] = useState(10)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Simple beep function that works in most browsers
  const playBeep = () => {
    if (!soundEnabled) return // Skip if sound is disabled

    const audio = new Audio("/soundEffects/beep.wav")
    audio.play();
  }

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
      const warningTimeInMs = notificationMinutes * 60 * 1000

      // Skip if notifications are disabled
      if (!notificationsEnabled) return

      tasks.forEach((task) => {
        if (task.timeLimit && task.timeLimit > 0 && !task.completed) {
          const timeRemaining = task.timeLimit - now

          // If warning time or less remaining and notification hasn't been shown yet
          if (
            timeRemaining <= warningTimeInMs && timeRemaining >= warningTimeInMs - 1.5 *60*1000 &&
            timeRemaining > 0 &&
            !notifiedTasks.tenMinWarning.has(task.id) &&
            !notifications.some((n) => n.taskId === task.id)
          ) {
            // Add to notified tasks set
            setNotifiedTasks((prev) => ({
              ...prev,
              tenMinWarning: new Set([...prev.tenMinWarning, task.id]),
            }))

            // Add notification
            setNotifications((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                taskId: task.id,
                taskText: task.text,
                timestamp: now,
                isEarlyWarning: true,
              },
            ])

            // Play notification sound (same as test sound)
            playBeep()
          }
          // If time is up and notification hasn't been shown yet
          else if (
            timeRemaining <= 0 &&
            !notifiedTasks.timeUp.has(task.id) &&
            !notifications.some((n) => n.taskId === task.id)
          ) {
            // Add to notified tasks set
            setNotifiedTasks((prev) => ({
              ...prev,
              timeUp: new Set([...prev.timeUp, task.id]),
            }))

            // Add notification
            setNotifications((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                taskId: task.id,
                taskText: task.text,
                timestamp: now,
                isEarlyWarning: false,
              },
            ])

            // Play notification sound (same as test sound)
            playBeep()
          }
        }
      })
    }, 1000) // Check every second

    return () => clearInterval(interval)
  }, [tasks, notifications, notifiedTasks, notificationMinutes, notificationsEnabled, soundEnabled])

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

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
    // Remove any notifications for this task
    setNotifications(notifications.filter((notification) => notification.taskId !== id))

    // Remove from notified tasks sets
    setNotifiedTasks((prev) => {
      const newTenMinWarning = new Set(prev.tenMinWarning)
      const newTimeUp = new Set(prev.timeUp)
      newTenMinWarning.delete(id)
      newTimeUp.delete(id)
      return {
        tenMinWarning: newTenMinWarning,
        timeUp: newTimeUp,
      }
    })
  }

  // Remove all completed tasks
  const removeCompletedTasks = () => {
    const completedTaskIds = tasks.filter((task) => task.completed).map((task) => task.id)
    setTasks(tasks.filter((task) => !task.completed))
    // Remove notifications for completed tasks
    setNotifications(notifications.filter((notification) => !completedTaskIds.includes(notification.taskId)))

    // Remove completed tasks from notified tasks sets
    setNotifiedTasks((prev) => {
      const newTenMinWarning = new Set(prev.tenMinWarning)
      const newTimeUp = new Set(prev.timeUp)

      completedTaskIds.forEach((id) => {
        newTenMinWarning.delete(id)
        newTimeUp.delete(id)
      })

      return {
        tenMinWarning: newTenMinWarning,
        timeUp: newTimeUp,
      }
    })
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

      // When setting a new time limit, reset the notification status
      setNotifiedTasks((prev) => {
        const newTenMinWarning = new Set(prev.tenMinWarning)
        const newTimeUp = new Set(prev.timeUp)
        newTenMinWarning.delete(timeLimitModal.taskId)
        newTimeUp.delete(timeLimitModal.taskId)
        return {
          tenMinWarning: newTenMinWarning,
          timeUp: newTimeUp,
        }
      })

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

  // Add 10 minutes to a task
  const add10Minutes = (taskId) => {
    // Find the task
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    // Calculate new deadline
    const newDeadline = task.timeLimit + 10 * 60 * 1000

    // Update the task
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            timeLimit: newDeadline,
          }
        }
        return task
      }),
    )

    // Reset notification status for this task
    setNotifiedTasks((prev) => {
      const newTenMinWarning = new Set(prev.tenMinWarning)
      const newTimeUp = new Set(prev.timeUp)
      newTenMinWarning.delete(taskId)
      newTimeUp.delete(taskId)
      return {
        tenMinWarning: newTenMinWarning,
        timeUp: newTimeUp,
      }
    })

    // Play a sound when adding time
  }

  // Toggle settings modal
  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen)
  }

  return (
    <>
      {/* Fixed button to toggle the todo list with clock animation */}
      <div className="relative">
        <div className="flex items-center">
          <div>
          <button
            onClick={toggleTodoList}
            className="z-40 text-primary-black p-4 rounded-full hover:bg-gray-300 hover:bg-opacity-20 transition-all"
            aria-label="Toggle Todo List"
          >
            <ClipboardList className="h-6 w-6" />

          </button>
          {hasActiveTimeLimitTasks && (
          <div className="absolute  top-1 ml-7 animate-pulse">
            <div className="relative">
              <Clock className="h-5 w-5 text-primary" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </div>
          </div>
        )}
        </div>
          <PointsNumber/>
        </div>

        {/* Clock animation that appears when there are active tasks with time limits */}
        
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
                data-testid="add-task-button"
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
                     aria-label="Toggle Task"
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
                      <button onClick={() => removeTask(task.id)} aria-label="Remove Task" className="ml-2 text-gray-500 hover:text-gray-700">
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
                className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 mb-4"
              >
                <Trash2 className="h-4 w-4" />
                Remove Completed Tasks
              </button>
            )}

            {/* Settings button */}
            <button
              onClick={toggleSettings}
              className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              <BellRing className="h-4 w-4" />
              Timer notification settings
            </button>

            {/* Settings panel */}
            {settingsOpen && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium mb-3">Timer notification settings</h3>

                {/* Notification timing */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Notifications</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={notificationsEnabled}
                        onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                        className="sr-only"
                        id="toggle-notifications"
                      />
                      <label
                        htmlFor="toggle-notifications"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${notificationsEnabled ? "bg-primary" : "bg-gray-300"}`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${notificationsEnabled ? "translate-x-4" : "translate-x-0"}`}
                        ></span>
                      </label>
                    </div>
                  </div>

                  {notificationsEnabled && (
                    <div className="flex items-center">
                      <label className="text-sm text-gray-600 mr-2">Show notification</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={notificationMinutes}
                        onChange={(e) =>
                          setNotificationMinutes(Math.max(1, Math.min(60, Number.parseInt(e.target.value) || 10)))
                        }
                        className="w-16 px-2 py-1 border rounded text-center"
                      />
                      <span className="text-sm text-gray-600 ml-2">minutes before deadline</span>
                    </div>
                  )}
                </div>

                {/* Sound toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <label className="text-sm font-medium text-gray-700 mr-2">Notification Sound</label>
                    {soundEnabled ? (
                      <Volume2 className="h-4 w-4 text-gray-500" />
                    ) : (
                      <VolumeX className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={() => setSoundEnabled(!soundEnabled)}
                      className="sr-only"
                      id="toggle-sound"
                    />
                    <label
                      htmlFor="toggle-sound"
                      className={`block overflow-hidden h-6 rounded-full cursor-pointer ${soundEnabled ? "bg-primary" : "bg-gray-300"}`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${soundEnabled ? "translate-x-4" : "translate-x-0"}`}
                      ></span>
                    </label>
                  </div>
                </div>

                
              </div>
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
              <h3 className="font-bold text-lg">
                {notification.isEarlyWarning
                  ? `${notificationMinutes} minute${notificationMinutes !== 1 ? "s" : ""} left!`
                  : "Time's up!"}
              </h3>
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
                onClick={() => dismissNotification(notification.id)}
                className="flex-1 px-2 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Add 10 minutes to the task's time limit
                  add10Minutes(notification.taskId)
                  dismissNotification(notification.id)
                }}
                className="flex-1 px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                +10 min.
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}