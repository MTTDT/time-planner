"use client"

import { Star } from "lucide-react"
import { getPoints, subscribe, clearPoints } from "./pointsStorage";
import { useEffect, useState } from "react";

const PointsNumber = () => {
    const [showPopup, setShowPopup] = useState(false)

    const [points, setPoints] = useState(0);
  useEffect(() => {
    setPoints(getPoints())
    const unsubscribe = subscribe(setPoints);
    return () => unsubscribe();
  }, []);
  // Convert number to string to check its length, with fallback to '0'
  const numString = String(points)
  const digitCount = numString.length
  const togglePopup = () => {
    setShowPopup(!showPopup)
  }

  const handleClear = () => {
    clearPoints()
  }
  // Adjust star size based on number of digits
  let starSize = 37 // Default size for single digit
  let textClass = "text-s font-bold"

  if (digitCount === 2) {
    starSize = 45 // Larger for double digits
  } else if (digitCount >= 3) {
    starSize = 55 // Even larger for triple digits or more
    textClass = "text-xs font-bold" // Smaller text for more digits
  }

  return (
    <div className="relative">
    <div
      className="relative flex items-center justify-center cursor-pointer"
      style={{ width: `${starSize}px`, height: `${starSize}px` }}
      onClick={togglePopup}
    >
      <Star size={starSize} />
      <span className={`absolute ${textClass}`}>{points}</span>
    </div>

    {showPopup && (
      <div className="absolute mt-2 right-0 z-50">
        {/* Triangle pointer */}
        <div className="absolute -top-2 right-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-200" />

        {/* Square bubble */}
        <div className="bg-gray-200 rounded-md p-3 shadow-lg">
          <div className="flex flex-col gap-2 min-w-[120px]">
            <button
              onClick={handleClear}
              className="bg-red-200 py-1 px-3 rounded hover:bg-red-300 transition-colors font-bold"
            >
              Clear
            </button>
            <a
              href="/overview"
              className="bg-gray-600 py-1 px-3 rounded hover:bg-gray-700 transition-colors text-center"
              onClick={() => setShowPopup(false)}
            >
              Overview
            </a>
          </div>
        </div>
      </div>
    )}
  </div>
)
}

export default PointsNumber

