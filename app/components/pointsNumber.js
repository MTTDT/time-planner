let points = 0;
let allPoints = 0;
const listeners = new Set();

export function addPoint() {
    points++;
    allPoints++;
    notifyListeners();
}

export function clearPoints() {
    points = 0;
    notifyListeners();
}

export function getPoints() {
    return points;
}

// Listener system to notify React components
export function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function notifyListeners() {
    listeners.forEach(listener => listener(points));
}
