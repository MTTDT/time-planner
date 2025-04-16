"use client"

import { useState, useEffect } from "react"
import { Bell, Trash2, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { Button, Badge, Card, CardBody, Popover, PopoverTrigger, PopoverContent } from "@heroui/react"
import { ScrollArea } from "@radix-ui/react-scroll-area"

export const NotificationType = {
  INFO: "info",
  WARNING: "warning",
  SUCCESS: "success",
}

export default function NotificationContainer({ newNotification }) {
  // Load notifications from localStorage when component mounts
  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("notifications")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [expandedIds, setExpandedIds] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [notificationsSupported, setNotificationsSupported] = useState(false)
  const [permission, setPermission] = useState(null)

  // Initialize notification support and permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationsSupported(true)
      setPermission(Notification.permission)
      
      // Request permission if not already set
      if (Notification.permission === "default") {
        Notification.requestPermission().then(setPermission)
      }
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("notifications", JSON.stringify(notifications))
    }
  }, [notifications])

  // Handle new notification from props
  useEffect(() => {
    if (newNotification) {
      addNotification({
        ...newNotification,
        id: newNotification.id || Date.now(),
        time: newNotification.time || new Date(),
        read: false,
      })
    }
  }, [newNotification])

  // Add a new notification
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev])
    setIsOpen(true)
    
    if (notificationsSupported && permission === "granted") {
      new Notification(notification.title, { 
        body: notification.description 
      })
    }
  }

  // Delete a notification
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    )
  }

  // Toggle expanded state
  const toggleExpand = (id) => {
    setExpandedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    )
    markAsRead(id)
  }

  // Remind later - adds 1 hour to the time
  const remindLater = (id) => {
    setNotifications(prev =>
      prev.map(n => 
        n.id === id 
          ? { 
              ...n, 
              time: new Date(Date.now() + 3600000), 
              read: false 
            } 
          : n
      )
    )
  }

  // Clear all notifications
  const clearAll = () => {
    setNotifications([])
  }

  // Format time to relative format
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return "Ką tik"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min.`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} val.`
    return `${Math.floor(diffInSeconds / 86400)} d.`
  }

  // Get badge color based on type
  const getBadgeVariant = (type) => {
    switch (type) {
      case NotificationType.WARNING: return "warning"
      case NotificationType.SUCCESS: return "success"
      default: return "default"
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button size="icon" className="relative bg-transparent hover:bg-gray-600 hover:bg-opacity-20 p-1 rounded-xl">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <Card>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">Pranešimai</h3>
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Išvalyti visus
                </Button>
              )}
            </div>
            <CardBody className="p-0">
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">Nėra pranešimų</div>
              ) : (
                <ScrollArea className="h-[400px]">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 ${notification.read ? "" : "bg-muted/30"}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{notification.title}</h4>
                            <Badge variant={getBadgeVariant(notification.type)}>
                              {notification.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatRelativeTime(notification.time)}
                          </p>

                          <div className="mt-2">
                            {expandedIds.includes(notification.id) ? (
                              <p className="text-sm">{notification.description}</p>
                            ) : (
                              <p className="text-sm line-clamp-1">{notification.description}</p>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => remindLater(notification.id)}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Priminti vėliau
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => toggleExpand(notification.id)}
                        >
                          {expandedIds.includes(notification.id) ? (
                            <>
                              <ChevronUp className="h-3 w-3 mr-1" />
                              Sutraukti
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              Išplėsti
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              )}
            </CardBody>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  )
}