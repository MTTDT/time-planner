'use client'

import { useEffect, useState } from 'react';

const NotificationButton = () => {
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    // Check if Notifications API is supported and update the permission state
    if (typeof window !== 'undefined' && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleNotification = async () => {
    // Request permission if not already granted
    if (permission !== 'granted') {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== 'granted') {
        alert('Notification permission is not granted.');
        return;
      }
    }
    
    // Create and show the notification
    new Notification('Hello');
  };

  return (
    <div>
      <button onClick={handleNotification}>Ping</button>
    </div>
  );
};

export default NotificationButton;