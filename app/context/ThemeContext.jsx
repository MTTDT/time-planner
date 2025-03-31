"use client";

import { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState("#ffffff");
  const [secondaryColor, setSecondaryColor] = useState("#00bcd4");

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor, secondaryColor, setSecondaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);