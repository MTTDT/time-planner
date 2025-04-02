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
    const router = useRouter()

    const handleChanges = (e) => {
        setValues({...values, [e.target.name]:e.target.value})
    }
    const handleSumbit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:8080/auth/login', values)
            if(response.status === 201) {
                localStorage.setItem('token', response.data.token)
                router.push('/')
            }
        } catch(err) {
            console.log(err.message)
        }
    }
  return (
    <div className={style.container}>
        <div className={style.formContainer}>
            <h2 className={style.title}>Login</h2>
            <form onSubmit={handleSumbit}>
                <div className="mb-4">
                    <label htmlFor="username" className={style.label}>Username</label>
                    <input type="username" placeholder='Enter username' className={style.input}
                    name="username" onChange={handleChanges}/>
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className={style.label}>Password</label>
                    <input type="password" placeholder='Enter password' className={style.input}
                    name="password" onChange={handleChanges}/>
                </div>
                <button type="submit" className={style.button}>Submit</button>
            </form>
            <div className={style.textCenter}>
                <span>Don't have an account? </span>
                <Link href="/register" className={style.link}>Sign up</Link>
            </div>
        </div>
    </div>
  )
}

export default Login