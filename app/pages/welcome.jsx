import React from 'react';
import Login from '../Login'
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Welcome = () => {
  return (
    <div className='welcome-box'>
      <h1>Welcome to Time Planner!</h1>
      <p>Manage your time effectively.</p>
      <div className='login-box'>
        <Login />
      </div>
      <p>Don't have an account?</p>
      
      <a href="sign up"></a>
    </div>
  );
};

export default Welcome;