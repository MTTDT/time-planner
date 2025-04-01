"use client";

import React, { useState, useEffect } from "react";
import TopMenu from "./components/TopMenu";
import CalendarTriple from "./components/CalendarTriple";
import UI from "./components/UI";

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [currentView, setCurrentView] = useState("home"); // 'home', 'day', 'week', 'month'
  const [themeColor, setThemeColor] = useState("#ffffff"); // Default primary color is white
  const [secondaryColor, setSecondaryColor] = useState("#00bcd4"); // Default secondary color is cyan

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div
      className={` ${theme} w-screen`}
      style={{ backgroundColor: themeColor, minHeight: "100vh" }}
    >
      <TopMenu
        theme={theme}
        setTheme={setTheme}
        onHomeClick={() => setCurrentView("home")}
      />
      <CalendarTriple />
      <UI
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        secondaryColor={secondaryColor}
        setSecondaryColor={setSecondaryColor}
      />
    </div>
  );
}
 
