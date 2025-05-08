import React from 'react';
import PointsNumber from './PointsNumber';

const UserBox = ({ username, theme, onSignOut }) => {
    return (
        <div className={`user-box ${theme}`}>
            <div className="user-header">
                <div className="user-details">
                    <span className="username">Hi, {username}!</span>
                </div>
            </div>
            <PointsNumber/>
            <div className="user-options">
                <button className="user-option-button logout-button" onClick={onSignOut}>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default UserBox;