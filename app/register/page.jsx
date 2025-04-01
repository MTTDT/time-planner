"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import style from '../css/auth.module.css'

const Register = () => {
    const [values, setValues] = useState({
        username: '',
        password: ''
    })
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter()

    const handleChanges = (e) => {
        setValues({...values, [e.target.name]:e.target.value})
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handleSumbit = async (e) => {
        e.preventDefault()
        if (values.password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/auth/register', values, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.status === 201) {
                router.push('/login')
            }
        } catch(err) {
            console.log(err.message)
            setErrorMessage("Registration failed");
        }
    }
  return (
    <div className={style.container}>
        <div className={style.formContainer}>
            <h2 className={style.title}>Register</h2>
            {errorMessage && <div className={style.error}>{errorMessage}</div>}
            <form onSubmit={handleSumbit}>
                <div className="mb-4">
                    <label htmlFor="username" className={style.label}>Username</label>
                    <input type="text" placeholder='Enter username' className={style.input}
                    name="username" onChange={handleChanges}/>
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className={style.label}>Password</label>
                    <input type="password" placeholder='Enter password' className={style.input}
                    name="password" onChange={handleChanges}/>
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className={style.label}>Repeat password</label>
                    <input type="password" placeholder='Enter password' className={style.input}
                    name="confirmPassword" onChange={handleConfirmPasswordChange}/>
                </div>
                <button type="submit" className={style.button}>Submit</button>
            </form>
            <div className={style.textCenter}>
                <span>Already have an account? </span>
                <Link href="/login" className={style.link}>Sign in</Link>
            </div>
        </div>
    </div>
  )
}

export default Register