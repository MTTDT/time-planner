import React from 'react';

const UserBox = ({ theme, onSignOut }) => {
    return (
        <div className={`user-box ${theme}`}>
            <div className="user-header">
                <div className="user-details">
                    <span className="username">Hi, user!</span>
                </div>
            </div>
            <div className="user-options">
                <button className="user-option-button logout-button" onClick={onSignOut}>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default UserBox;