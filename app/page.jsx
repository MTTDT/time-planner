"use client"

import React, { useState, useEffect } from "react";
import DayCard from "./components/DayCard"
import TopMenu from "./components/TopMenu";
import HomeMenu from "./components/HomeMenu";
import DayView from "./components/DayView";
import ModernCalendar from "./components/ModernCalendar";

export default function Home() {
  const [theme, setTheme] = useState('light');
  const [currentView, setCurrentView] = useState('home'); // 'home', 'day', 'week', 'month'

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const renderView = () => {
    switch(currentView) {
      case 'home':
        return <HomeMenu setView={setCurrentView} />;
      case 'day':
        return <DayView />;
      case 'week':
        return <div>Week View Coming Soon</div>;
      case 'month':
        return <Calendar />;
      default:
        return <HomeMenu setView={setCurrentView} />;
    }
  };

  return (
    <div className={`container ${theme}`}>
      <TopMenu 
        theme={theme} 
        setTheme={setTheme}
        onHomeClick={() => setCurrentView('home')}
      />
      {renderView()}
    </div>
  );
}
