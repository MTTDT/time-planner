"use client";

import React, { useState, useEffect } from "react";
import TopMenu from "./components/TopMenu";
import CalendarTriple from "./components/CalendarTriple";
import UI from "./components/UI";
import Sidebar from "./components/plugins/Sidebar";
import { useTheme } from "./context/ThemeContext";

export default function Home() {
  const { themeColor, secondaryColor } = useTheme();
  const [theme, setTheme] = useState("light");
  const [currentView, setCurrentView] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    // Apply primary and secondary colors globally
    if (theme === "light") {
      document.documentElement.style.setProperty("--primary-color", themeColor);
    } else {
      document.documentElement.style.setProperty("--primary-color", "#000000"); // Black background for dark mode
    }
    document.documentElement.style.setProperty("--secondary-color", secondaryColor);
  }, [theme, themeColor, secondaryColor]); // Ensure the dependency array is consistent

  return (
    <div
      className={`${theme} w-screen flex relative`}
      style={{
        backgroundColor: theme === "dark" ? "#000000" : themeColor, // Black for dark mode
        minHeight: "100vh",
        color: secondaryColor,
      }}
    >
      <Sidebar onToggle={setIsSidebarOpen} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "pl-48" : "pl-16"}`}>
        <TopMenu
          theme={theme}
          setTheme={setTheme}
          onHomeClick={() => setCurrentView("home")}
        />
        <CalendarTriple />
        <UI
          themeColor={themeColor}
          setThemeColor={() => {}}
          secondaryColor={secondaryColor}
          setSecondaryColor={() => {}}
        />
      </div>
    </div>
  );
}

