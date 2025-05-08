"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import style from '../css/auth.module.css'

const Login = () => {
    const [values, setValues] = useState({
        username: '',
        password: ''
    })
    const [errors, setErrors] = useState([]);
    const [touched, setTouched] = useState({ username: false, password: false });
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter()

    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true });
    }

    const handleSumbit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        const newErrors = [];
        if (!values.username) {
            newErrors.push("Username is required.");
        }
        if (!values.password) {
            newErrors.push("Password is required.");
        }
        setErrors(newErrors);
        if (newErrors.length > 0) return;

        try {
            console.log("--->", values)
            const response = await axios.post('http://localhost:8080/auth/login', values)
            if (response.status === 201) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', values.username);
                router.push('/')
            }
        } catch (err) {
            setErrors(["Invalid username or password."]);
            setSubmitted(true);
        }
    }

    const inputError = (condition) => condition ? { borderColor: '#d32f2f' } : {};

    const usernameError = submitted && (!values.username || errors[0] === "Invalid username or password.");
    const passwordError = submitted && (!values.password || errors[0] === "Invalid username or password.");

    return (
        <div className={style.container}>
            <div className={style.formContainer}>
                <h2 className={style.title}>Log In</h2>
                <form onSubmit={handleSumbit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder='Username'
                            className={style.input}
                            name="username"
                            value={values.username}
                            onChange={handleChanges}
                            onBlur={handleBlur}
                            style={inputError(usernameError)}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder='Password'
                            className={style.input}
                            name="password"
                            value={values.password}
                            onChange={handleChanges}
                            onBlur={handleBlur}
                            style={inputError(passwordError)}
                        />
                    </div>
                    {errors.length > 0 && (
                        <div className={style.error}>
                            <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                                {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                            </ul>
                        </div>
                    )}
                    <button type="submit" className={style.button}>Log In</button>
                </form>
                <div className={style.textCenter}>
                    <span>Need an account? </span>
                    <Link href="/register" className={style.link}>Sign Up</Link>
                </div>
            </div>
        </div>
    )
}

export default Login