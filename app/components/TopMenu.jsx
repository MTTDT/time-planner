import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import lg_sun from '../assets/bx-sun.png';
import lg_moon from '../assets/bx-moon.png';
import lm_cal from '../assets/calendar-star-regular-120.png';
import dm_cal from '../assets/calendar-star-solid-120.png';
import '../globals.css';
import NotificationContainer from './NotificationContainer';
import { api_update_theme } from '../api_req';

const TopMenu = ({ theme, setTheme }) => {
    const [isUserBoxOpen, setIsUserBoxOpen] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        setUsername(localStorage.getItem('username') || '');
    }, []);

    const toggleMode = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        try {
            await api_update_theme(1, { name: newTheme });
            setTheme(newTheme);
        } catch (error) {
            console.error('Failed to update theme:', error);
        }
    };

    const toggleUserBox = () => {
        setIsUserBoxOpen((prev) => !prev);
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login';
    };

    return (
        <div className={`top-menu ${theme} flex items-center justify-between px-4 py-2 shadow-md`}>
            <div className="flex items-center space-x-2">
                <Image
                    src={theme === 'light' ? lm_cal : dm_cal}
                    alt="App Logo"
                    className="logo-icon"
                    width={32}
                    height={32}
                />
                <span className="app-name text-lg font-bold">{'TimePlanner'}</span>
            </div>
            <div className="right-icons flex items-center space-x-4">
                <Image
                    src={theme === 'light' ? lg_sun : lg_moon}
                    alt="Toggle Theme"
                    className="toggle-icon cursor-pointer"
                    width={24}
                    height={24}
                    onClick={toggleMode}
                />
                <NotificationContainer />
                <div className="relative">
                    <span
                        className="cursor-pointer font-medium"
                        style={{ userSelect: 'none' }}
                        onClick={toggleUserBox}
                    >
                        Hi, {username}!
                    </span>
                    {isUserBoxOpen && (
                        <div
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: '2.2rem',
                                background: theme === 'light' ? '#fff' : '#222',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                padding: '1rem',
                                zIndex: 100,
                                minWidth: '140px',
                                textAlign: 'center'
                            }}
                        >
                            <button
                                onClick={handleSignOut}
                                style={{
                                    background: '#e53e3e',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopMenu;