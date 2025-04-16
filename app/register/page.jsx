"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import style from '../css/auth.module.css'
import { api_checkUsername } from '../api_req';

const Register = () => {
    const [values, setValues] = useState({
        username: '',
        password: ''
    })
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameTouched, setUsernameTouched] = useState(false);
    const [usernameTaken, setUsernameTaken] = useState(null);
    const [errors, setErrors] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    const usernameIsValid = (username) => username.length >= 3;
    const passwordIsValid = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

    const handleChanges = async (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
        if (e.target.name === "username") {
            setUsernameTouched(true);
            if (usernameIsValid(e.target.value)) {
                const taken = await api_checkUsername(e.target.value);
                setUsernameTaken(taken);
            } else {
                setUsernameTaken(null);
            }
        }
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handleSumbit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        const newErrors = [];
        if (!usernameIsValid(values.username)) {
            newErrors.push("Username must be at least 3 characters.");
        }
        if (usernameTaken) {
            newErrors.push("Username is already taken.");
        }
        if (!passwordIsValid(values.password)) {
            newErrors.push("Password must be at least 8 characters, include upper and lower case letters, and a number.");
        }
        if (values.password !== confirmPassword) {
            newErrors.push("Passwords do not match.");
        }
        setErrors(newErrors);
        if (newErrors.length > 0) return;

        try {
            const response = await axios.post('http://localhost:8080/auth/register', values, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.status === 201) {
                router.push('/login')
            }
        } catch (err) {
            setErrors(["Registration failed."]);
        }
    }

    // Helper for input border color
    const inputError = (condition) => condition ? { borderColor: '#d32f2f' } : {};

    // Determine when to show red border for each input
    const usernameError = (submitted || usernameTouched) && (!usernameIsValid(values.username) || (usernameIsValid(values.username) && usernameTaken));
    const passwordError = submitted && !passwordIsValid(values.password);
    const confirmPasswordError = submitted && (values.password !== confirmPassword || !passwordIsValid(values.password));

    return (
        <div className={style.container}>
            <div className={style.formContainer}>
                <h2 className={style.title}>Sign Up</h2>
                <form onSubmit={handleSumbit}>
                    <div className="mb-4" style={{ position: "relative" }}>
                        <div style={{ position: "relative" }}>
                            <input
                                type="text"
                                name="username"
                                placeholder='Username'
                                value={values.username}
                                onChange={handleChanges}
                                className={style.input}
                                style={{
                                    paddingRight: "2rem",
                                    ...inputError(usernameError)
                                }}
                                onBlur={() => setUsernameTouched(true)}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder='Password'
                            name="password"
                            onChange={handleChanges}
                            className={style.input}
                            style={inputError(passwordError || confirmPasswordError)}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder='Confirm Password'
                            name="confirmPassword"
                            onChange={handleConfirmPasswordChange}
                            className={style.input}
                            style={inputError(confirmPasswordError || passwordError)}
                        />
                    </div>
                    {errors.length > 0 && (
                        <div className={style.error}>
                            <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                                {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                            </ul>
                        </div>
                    )}
                    <button type="submit" className={style.button}>Sign Up</button>
                </form>
                <div className={style.textCenter}>
                    <span>Already have an account? </span>
                    <Link href="/login" className={style.link}>Log In</Link>
                </div>
            </div>
        </div>
    )
}

export default Register