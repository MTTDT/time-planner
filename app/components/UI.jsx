import React from "react";

const UI = ({ themeColor, setThemeColor, secondaryColor, setSecondaryColor }) => {
  const handlePrimaryColorChange = (event) => {
    setThemeColor(event.target.value);
  };

  const handleSecondaryColorChange = (event) => {
    const newColor = event.target.value;
    setSecondaryColor(newColor);

    // Dynamically update CSS variables in :root (except for .dark mode)
    const root = document.documentElement;
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

  return (
    <div style={{ position: "fixed", bottom: "10px", left: "10px", zIndex: 1000 }}>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Choose Colors:
      </label>
      <div style={{ display: "flex", gap: "10px" }}>
        {/* Primary Color Picker */}
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
            transition: "transform 0.2s ease",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        />

        {/* Secondary Color Picker */}
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
            transition: "transform 0.2s ease",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        />
      </div>
    </div>
  );
};

export default UI;