import React from "react";

const UI = ({ themeColor, setThemeColor, secondaryColor, setSecondaryColor }) => {
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
        {/* Label can remain if needed */}
      </label>
      <div style={{ display: "flex", gap: "10px" }}>
        {/* Removed Primary and Secondary Color Pickers */}
      </div>
    </div>
  );
};

export default UI;