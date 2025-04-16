import React, { useState } from 'react';
import Image from 'next/image';
import lg_sun from '../assets/bx-sun.png';
import lg_moon from '../assets/bx-moon.png';
import lm_cal from '../assets/calendar-star-regular-120.png';
import dm_cal from '../assets/calendar-star-solid-120.png';
import avatar_lm from '../assets/default-avatar-lm.png';
import avatar_dm from '../assets/default-avatar-dm.png';
import '../globals.css';
import NotificationContainer from './NotificationContainer';
import UserBox from './UserBox';
import { api_update_theme } from '../api_req';

const TopMenu = ({ theme, setTheme }) => {
    const [isUserBoxOpen, setIsUserBoxOpen] = useState(false);
    const username = "JohnDoe"; // Replace with actual username from your app's state

    const toggleMode = async() => {
         const newTheme = theme === 'light' ? 'dark' : 'light';
        try {
            await api_update_theme(1, { name: newTheme }); // Note: using 'name' as the property
            setTheme(newTheme);
        } catch (error) {
            console.error('Failed to update theme:', error);
            // Optionally show error to user
        }
    };

    const toggleUserBox = () => {
        setIsUserBoxOpen(!isUserBoxOpen);
    };

    const handleSignOut = () => {
        console.log('Signing out...');
        localStorage.removeItem('token');
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
                <div className="user-avatar-container">
                    <Image
                        src={theme === 'light' ? avatar_lm : avatar_dm}
                        alt="User Avatar"
                        className="rounded-full cursor-pointer"
                        width={32}
                        height={32}
                        onClick={toggleUserBox}
                    />
                    {isUserBoxOpen && (
                        <UserBox
                            username={username}
                            theme={theme}
                            onSignOut={handleSignOut}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopMenu;