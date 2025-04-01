"use client"

import { useState, useEffect } from "react"
import { Bell, Trash2, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { Button, Badge, Card, CardBody, Popover, PopoverTrigger,PopoverContent } from "@heroui/react"
import { ScrollArea } from "@radix-ui/react-scroll-area"

export const NotificationType = {
  INFO: "info",
  WARNING: "warning",
  SUCCESS: "success",
}

// Initial notifications for testing
const initialNotifications = [
  {
    id: 1,
    title: "Naujas pranešimas",
    description:
      "Šis pranešimas yra svarbus ir jums reikėtų jį perskaityti. Čia yra daugiau informacijos apie šį pranešimą, kurią galite pamatyti išplėtę pranešimą.",
    time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    type: NotificationType.INFO,
  },
  {
    id: 2,
    title: "Sėkmingai atlikta",
    description: "Jūsų užklausa buvo sėkmingai įvykdyta. Dėkojame už jūsų kantrybę.",
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: true,
    type: NotificationType.SUCCESS,
  },
  {
    id: 3,
    title: "Dėmesio",
    description: "Jūsų paskyros nustatymai buvo atnaujinti. Prašome patikrinti, ar viskas veikia tinkamai.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    type: NotificationType.WARNING,
  },
]

export default function NotificationContainer({ newNotification }) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [expandedIds, setExpandedIds] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // Check if browser supports notifications
  const [notificationsSupported, setNotificationsSupported] = useState(false)
  const [permission, setPermission] = useState(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  // Add new notification when prop changes
  useEffect(() => {
    if (newNotification) {
      // Add the new notification to the beginning of the list
      setNotifications((prev) => [
        {
          ...newNotification,
          id: newNotification.id || Date.now(), // Ensure it has an ID
          time: newNotification.time || new Date(), // Ensure it has a timestamp
          read: false, // Always mark new notifications as unread
        },
        ...prev,
      ])

      // Open the notification panel when a new notification arrives
      setIsOpen(true)

      // Send browser notification if supported
      if (notificationsSupported && permission === "granted") {
        new Notification(newNotification.title, { body: newNotification.description })
      }
    }
  }, [newNotification, notificationsSupported, permission])

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  // Format time to relative format (e.g., "5 min ago")
  const formatRelativeTime = (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return "Ką tik"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min.`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} val.`
    return `${Math.floor(diffInSeconds / 86400)} d.`
  }

  // Toggle expanded state for a notification
  const toggleExpand = (id) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((expandedId) => expandedId !== id) : [...prev, id]))
  }

  // Delete a notification
  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Mark as "remind later" - adds 1 hour to the time and marks as unread
  const remindLater = (id) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        if (notification.id === id) {
          return {
            ...notification,
            time: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
            read: false,
          }
        }
        return notification
      }),
    )
  }

  // Get badge color based on notification type
  const getBadgeVariant = (type) => {
    switch (type) {
      case NotificationType.WARNING:
        return "warning"
      case NotificationType.SUCCESS:
        return "success"
      default:
        return "default"
    }
  }

  return (
    <div className="relative ">
      {/* Bell icon with notification count badge */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button  size="icon" className="relative bg-transparent">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
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
                <Button variant="ghost" size="sm" onClick={() => setNotifications([])}>
                  Išvalyti visus
                </Button>
              )}
            </div>
            <CardBody className="p-0">
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">Nėra pranešimų</div>
              ) : (
                <ScrollArea className="h-[400px]">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 ${notification.read ? "" : "bg-muted/30"}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{notification.title}</h4>
                            <Badge variant={getBadgeVariant(notification.type)}>{notification.type}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(notification.time)}</p>

                          {/* Description - collapsed or expanded */}
                          <div className="mt-2">
                            {expandedIds.includes(notification.id) ? (
                              <p className="text-sm">{notification.description}</p>
                            ) : (
                              <p className="text-sm line-clamp-1">{notification.description}</p>
                            )}
                          </div>
                        </div>

                        {/* Delete button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Action buttons */}
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

