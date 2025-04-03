"use client"

import { Star } from "lucide-react"
import { getPoints, subscribe, clearPoints, addPoint } from "./pointsStorage";
import { useEffect, useState } from "react";

const PointsNumber = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        setPoints(getPoints());
        const unsubscribe = subscribe(setPoints);
        return () => unsubscribe();
    }, []);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleAddPoint = () => {
        addPoint(); 
    };

    const handleClear = () => {
        clearPoints(); 
    };

    const numString = String(points);
    const digitCount = numString.length;
    const starSize = digitCount === 2 ? 45 : digitCount >= 3 ? 55 : 37;
    const textClass = digitCount >= 3 ? "text-xs font-bold" : "text-s font-bold";

    return (
        <div className="relative">
            <div
                className="relative flex items-center justify-center cursor-pointer"
                style={{ width: `${starSize}px`, height: `${starSize}px` }}
                onClick={togglePopup}
            >
                <Star size={starSize} />
                <span data-testid="points-value" className={`${textClass}`}>
                    {points}
                </span>
            </div>

            {showPopup && (
                <div className="absolute mt-2 right-0 z-50">
                    <div className="absolute -top-2 right-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-200" />
                    <div className="bg-gray-200 rounded-md p-3 shadow-lg">
                        <div className="flex flex-col gap-2 min-w-[120px]">
                            <button
                                onClick={handleAddPoint}
                                className="bg-green-200 py-1 px-3 rounded hover:bg-green-300 transition-colors font-bold"
                            >
                                Add Point
                            </button>
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
    );
};

export default PointsNumber;

