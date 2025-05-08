"use client";
import React from "react";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/plugins/Sidebar";

export default function Settings() {
  const { themeColor, setThemeColor, secondaryColor, setSecondaryColor } = useTheme();

  const handlePrimaryColorChange = (e) => {
    const newColor = e.target.value;
    setThemeColor(newColor);

    // Dynamically update CSS variables in :root
    const root = document.documentElement;
    root.style.setProperty("--primary-color", newColor);

    // Calculate a slightly darker shade for .rbc-today
    const darkerColor = darkenColor(newColor, 0.1); // Darken by 10%
    root.style.setProperty("--rbc-today-bg", darkerColor);
  };

  const handleSecondaryColorChange = (e) => {
    const newColor = e.target.value;
    setSecondaryColor(newColor);

    // Dynamically update CSS variables in :root
    const root = document.documentElement;
    root.style.setProperty("--secondary-color", newColor);
    root.style.setProperty("--foreground", newColor);
    root.style.setProperty("--text-color", newColor);
    root.style.setProperty("--border-color", newColor);
    root.style.setProperty("--hover-bg", `${hexToRgba(newColor, 0.1)}`);
    root.style.setProperty("--shadow-color", `${hexToRgba(newColor, 0.2)}`);
    root.style.setProperty("--hover-shadow", `0 4px 8px ${hexToRgba(newColor, 0.5)}`);
  };

  // Helper function to convert HEX to RGBA
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Helper function to darken a HEX color
  const darkenColor = (hex, amount) => {
    const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - Math.round(255 * amount));
    const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - Math.round(255 * amount));
    const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - Math.round(255 * amount));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
      .toString(16)
      .padStart(2, "0")}`;
  };

  return (
    <div className="w-screen flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="p-6 bg-white shadow-md rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Choose Colors
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Primary Color Picker */}
            <div>
              <label
                htmlFor="primaryColorPicker"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Primary Color:
              </label>
              <input
                id="primaryColorPicker"
                type="color"
                value={themeColor}
                onChange={handlePrimaryColorChange}
                style={{
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>

            {/* Secondary Color Picker */}
            <div>
              <label
                htmlFor="secondaryColorPicker"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Secondary Color:
              </label>
              <input
                id="secondaryColorPicker"
                type="color"
                value={secondaryColor}
                onChange={handleSecondaryColorChange}
                style={{
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}