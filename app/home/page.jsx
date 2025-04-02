"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import TopMenu from "../components/TopMenu";
import CalendarTriple from "../components/CalendarTriple";
import UI from "../components/UI";
import Sidebar from "../components/plugins/Sidebar";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from 'next/navigation';

const Home = () => {
    const { themeColor, secondaryColor } = useTheme();
    const [theme, setTheme] = useState("light");
    const [currentView, setCurrentView] = useState("home");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const router = useRouter();
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/auth/home', {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.status !== 201) {
                router.push('/login');
            }
        } catch (err){
            router.push('/login');
            console.error("Error fetching user: ", err);
        } 
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);

        if (theme === "light") {
            document.documentElement.style.setProperty("--primary-color", themeColor);
        } else {
            document.documentElement.style.setProperty("--primary-color", "#000000");
        }
        document.documentElement.style.setProperty("--secondary-color", secondaryColor);
    }, [theme, themeColor, secondaryColor]);

    return (
        <div
            className={`${theme} w-screen flex relative`}
            style={{
                backgroundColor: theme === "dark" ? "#000000" : themeColor,
                minHeight: "100vh",
                color: secondaryColor,
            }}
        >
            <Sidebar onToggle={setIsSidebarOpen} />
            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "pl-48" : "pl-16"}`}>
                <TopMenu
                    theme={theme}
                    setTheme={setTheme}
                    onHomeClick={() => setCurrentView("home")}
                />
                <CalendarTriple />
                <UI
                    themeColor={themeColor}
                    setThemeColor={() => { }}
                    secondaryColor={secondaryColor}
                    setSecondaryColor={() => { }}
                />
            </div>
        </div>
    );
}
export default Home