import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TopMenu from '../app/components/TopMenu';
import UserBox from '../app/components/UserBox';
import PointsNumber from '../app/components/PointsNumber';
import * as pointsStorage from '../app/components/pointsStorage';
import { act } from 'react-dom/test-utils';
import * as api from '../app/api_req';

jest.mock('../app/components/pointsStorage', () => {
    let points = 0;
    let allPoints = [];
    const subscribers = [];

    return {
        getPoints: jest.fn(() => {
            return parseInt(localStorage.getItem('points') || '0', 10);
        }),
        addPoint: jest.fn(() => {
            points++;
            const currentHour = new Date().toISOString().slice(0, 13);
            allPoints.push(currentHour);
            localStorage.setItem('points', points.toString());
            localStorage.setItem('allPoints', JSON.stringify(allPoints));
            subscribers.forEach((callback) => callback(points));
        }),
        clearPoints: jest.fn(() => {
            points = 0;
            allPoints = [];
            localStorage.setItem('points', '0');
            localStorage.setItem('allPoints', JSON.stringify([]));
            subscribers.forEach((callback) => callback(points));
        }),
        getAllPoints: jest.fn(() => {
            return JSON.parse(localStorage.getItem('allPoints') || '[]');
        }),
        subscribe: jest.fn((callback) => {
            subscribers.push(callback);
            return () => {
                const index = subscribers.indexOf(callback);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
            };
        }),
        reset: jest.fn(() => {
            points = 0;
            allPoints = [];
            localStorage.setItem('points', '0');
            localStorage.setItem('allPoints', JSON.stringify([]));
        }),
    };
});

describe('Integration Tests for TopMenu and UserBox', () => {
    const mockSetTheme = jest.fn();
    const mockOnSignOut = jest.fn();

    test('renders TopMenu and toggles UserBox', () => {
        render(
            <TopMenu
                theme="light"
                setTheme={mockSetTheme}
            />
        );
        expect(screen.getByText('TimePlanner')).toBeInTheDocument();
        const avatar = screen.getByAltText('User Avatar');
        expect(avatar).toBeInTheDocument();
        fireEvent.click(avatar);
        expect(screen.getByText('Hi, user!')).toBeInTheDocument();
    });

    test('renders UserBox and handles logout', () => {
        render(
            <UserBox
                theme="light"
                onSignOut={mockOnSignOut}
            />
        );
        expect(screen.getByText('Hi, user!')).toBeInTheDocument();
        const logoutButton = screen.getByText('Log Out');
        expect(logoutButton).toBeInTheDocument();
        fireEvent.click(logoutButton);
        expect(mockOnSignOut).toHaveBeenCalledTimes(1);
    });

    test('toggles theme in TopMenu', () => {
        render(
            <TopMenu
                theme="light"
                setTheme={mockSetTheme}
            />
        );
        const toggleIcon = screen.getByAltText('Toggle Theme');
        expect(toggleIcon).toBeInTheDocument();
        fireEvent.click(toggleIcon);
        expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });
});

describe('Integration Tests for pointsStorage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        pointsStorage.reset();
    });

    test('retrieves initial points from localStorage', () => {
        localStorage.setItem('points', '10');
        expect(pointsStorage.getPoints()).toBe(10);
    });

    test('adds a point and updates localStorage', () => {
        const mockDate = new Date('2025-04-03T12:00:00Z');
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
        pointsStorage.addPoint();
        expect(pointsStorage.getPoints()).toBe(1);
        expect(localStorage.getItem('points')).toBe('1');
        const allPoints = JSON.parse(localStorage.getItem('allPoints'));
        expect(allPoints).toEqual(['2025-04-03T12']);
    });

    test('clears points and updates localStorage', () => {
        localStorage.setItem('points', '10');
        pointsStorage.clearPoints();
        expect(pointsStorage.getPoints()).toBe(0);
        expect(localStorage.getItem('points')).toBe('0');
    });

    test('notifies subscribers when points are updated', () => {
        const mockListener = jest.fn();
        const unsubscribe = pointsStorage.subscribe(mockListener);
        pointsStorage.addPoint();
        expect(mockListener).toHaveBeenCalledWith(1);
        pointsStorage.clearPoints();
        expect(mockListener).toHaveBeenCalledWith(0);
        unsubscribe();
        pointsStorage.addPoint();
        expect(mockListener).toHaveBeenCalledTimes(2);
    });

    test('retrieves allPoints from localStorage', () => {
        const mockAllPoints = ['2025-04-03T12', '2025-04-03T13'];
        localStorage.setItem('allPoints', JSON.stringify(mockAllPoints));
        expect(pointsStorage.getAllPoints()).toEqual(mockAllPoints);
    });
});

describe('Integration Tests for PointsNumber and pointsStorage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        pointsStorage.reset();
    });

    test('renders PointsNumber with initial points from pointsStorage', () => {
        pointsStorage.getPoints.mockReturnValue(123);
        render(<PointsNumber />);
        expect(screen.getByText('123')).toBeInTheDocument();
        expect(pointsStorage.getPoints).toHaveBeenCalledTimes(1);
    });

    test('increments points and updates pointsStorage', () => {
        pointsStorage.getPoints.mockReturnValue(123);
        render(<PointsNumber />);
            const addPointMock = jest.spyOn(pointsStorage, 'addPoint').mockImplementation(() => {
            pointsStorage.getPoints.mockReturnValue(124);
            pointsStorage.subscribe.mock.calls[0][0](124);
        });
        const star = screen.getByText('123');
        fireEvent.click(star);
        const addButton = screen.getByRole('button', { name: /add point/i });
        fireEvent.click(addButton);
        expect(addPointMock).toHaveBeenCalledTimes(1);
        expect(screen.getByText('124')).toBeInTheDocument();
    });

    test('clears points and updates pointsStorage', () => {
        pointsStorage.getPoints.mockReturnValue(123);
        render(<PointsNumber />);
        const clearPointsMock = jest.spyOn(pointsStorage, 'clearPoints').mockImplementation(() => {
            pointsStorage.getPoints.mockReturnValue(0);
            pointsStorage.subscribe.mock.calls[0][0](0);
        });
        const star = screen.getByText('123');
        fireEvent.click(star);
        const clearButton = screen.getByText('Clear');
        fireEvent.click(clearButton);
        expect(clearPointsMock).toHaveBeenCalledTimes(1);
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('updates PointsNumber display when pointsStorage subscription triggers', () => {
        pointsStorage.getPoints.mockReturnValue(123);
        const mockSubscribe = jest.fn((callback) => {
            callback(456);
            return jest.fn();
        });
        pointsStorage.subscribe.mockImplementation(mockSubscribe);
        render(<PointsNumber />);
        expect(screen.getByText('456')).toBeInTheDocument();
        expect(mockSubscribe).toHaveBeenCalledTimes(1);
    });

    test('adjusts star size based on points length', () => {
        pointsStorage.getPoints.mockReturnValue(123);
        render(<PointsNumber />);
        const star = screen.getByTestId('points-value');
        expect(star).toHaveClass('text-xs font-bold');
        act(() => {
            pointsStorage.getPoints.mockReturnValue(12);
            pointsStorage.subscribe.mock.calls[0][0](12);
        });
        expect(screen.getByTestId('points-value')).toHaveClass('text-s font-bold');
        act(() => {
            pointsStorage.getPoints.mockReturnValue(1);
            pointsStorage.subscribe.mock.calls[0][0](1);
        });
        expect(screen.getByTestId('points-value')).toHaveClass('text-s font-bold');
    });
});