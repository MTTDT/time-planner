"use client"

import React, { useState, useEffect } from "react";
import TopMenu from "./components/TopMenu";
import CalendarTriple from "./components/CalendarTriple";

export default function Home() {
  const [theme, setTheme] = useState('light');
  const [currentView, setCurrentView] = useState('home'); // 'home', 'day', 'week', 'month'

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div className={`container ${theme} w-screen`}>
      <TopMenu 
        theme={theme} 
        setTheme={setTheme}
        onHomeClick={() => setCurrentView('home')}
      />
      <CalendarTriple />
    </div>
  );
}
