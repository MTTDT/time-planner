"use client"

import React, { useState, useEffect } from "react";
import DayCard from "./components/DayCard"
import { Calendar } from "@heroui/react";
import TopMenu from "./components/TopMenu";

export default function Home() {

  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div className={`container ${theme }`}>
      <TopMenu theme={theme} setTheme={setTheme}/>
      <Calendar/>
      <DayCard/>
    </div>
);
}
