import React from 'react';
import Image from 'next/image';
import lg_sun from '../assets/bx-sun.png';
import lg_moon from '../assets/bx-moon.png';
import '../globals.css';

const TopMenu = ({ theme, setTheme, onHomeClick }) => {
    const toggle_mode = () => {
        theme == 'light' ? setTheme('dark') : setTheme('light');
    }
    
    return (
        <div className={`top-menu ${theme}`}>
            <ul>
                <li><a href="#" onClick={(e) => {
                    e.preventDefault();
                    onHomeClick();
                }}>Home</a></li>
                <li><a href="#">About</a></li>
            </ul>
            
            <Image 
                src={theme == 'light' ? lg_sun : lg_moon}
                alt="Toggle theme"
                className='toggle-icon'
                onClick={toggle_mode}
            />
        </div>
    );
}

export default TopMenu;