let points = 0;
let allPoints = [];

if (typeof window !== "undefined") {
    points = parseInt(localStorage.getItem("points") || "0", 10);
    allPoints = JSON.parse(localStorage.getItem("allPoints") || "[]");
}

const listeners = new Set();
console.log("storage activated");

export function addPoint() {
    points++;
    const currentHour = new Date().toISOString().slice(0, 13); // Gets YYYY-MM-DDTHH
    allPoints.push(currentHour);

    if (typeof window !== "undefined") {
        localStorage.setItem("points", points);
        localStorage.setItem("allPoints", JSON.stringify(allPoints));
    }

    notifyListeners();
}

export function clearPoints() {
    points = 0;

    if (typeof window !== "undefined") {
        localStorage.setItem("points", "0");
    }

    notifyListeners();
}

export function getPoints() {
    if (typeof window !== "undefined") {
        return parseInt(localStorage.getItem("points") || "0", 10);
    }
    return 0;
}

export function getAllPoints() {
    if (typeof window !== "undefined") {
        return JSON.parse(localStorage.getItem("allPoints") || "[]");
    }
    return [];
}

export function reset() {
    points = 0;
    allPoints = [];
    if (typeof window !== "undefined") {
        localStorage.setItem("points", "0");
        localStorage.setItem("allPoints", JSON.stringify([]));
    }
}

// Listener system to notify React components
export function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function notifyListeners() {
    listeners.forEach(listener => listener(points));
}
