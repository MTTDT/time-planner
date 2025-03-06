"use client"

// Global variable to store the callback function
let notificationCallback = null

// Notification type definition (matching the one in notification-container)
export const NotificationType = {
  INFO: "info",
  WARNING: "warning",
  SUCCESS: "success",
}

// Register a callback function to handle notifications
export const registerNotificationHandler = (callback) => {
  notificationCallback = callback
}

// Send a notification through the registered callback
export const sendNotification = (title, description, type = NotificationType.INFO) => {
  if (notificationCallback) {
    const notification = {
      title,
      description,
      type,
      time: new Date(),
      id: Date.now(),
    }

    notificationCallback(notification)
    return true
  }

  console.warn("No notification handler registered. Call registerNotificationHandler first.")
  return false
}

