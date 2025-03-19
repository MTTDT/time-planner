import React from 'react';
import Image from 'next/image';
import lg_sun from '../assets/bx-sun.png';
import lg_moon from '../assets/bx-moon.png';
import '../globals.css';
import TODO from './TODO';
import NotificationButton from './NotificationButton';
import NotificationContainer from './NotificationContainer';

const TopMenu = ({ theme, setTheme, onHomeClick }) => {
    const toggle_mode = () => {
        theme == 'light' ? setTheme('dark') : setTheme('light');
    }
    
    
    return (
        <div className={`top-menu ${theme} space-x-3`}>
            <ul>
                <li><a href="/" onClick={(e) => {
                    if(onHomeClick) {
                        e.preventDefault();

                        onHomeClick();
                    }

                }}>Home</a></li>
                <li><a href="#">About</a></li>
                <li>        <NotificationButton />
                </li>

            </ul>
            
            <Image 
                src={theme == 'light' ? lg_sun : lg_moon}
                alt="Toggle theme"
                className='toggle-icon'
                onClick={toggle_mode}
            />
            <NotificationContainer />
            <TODO />

        </div>
    );
}

export default TopMenu;