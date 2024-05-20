import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('data: ', data);
                const { userId } = data;
                navigate(`/profile?userId=${userId}`)
            })
            .catch(error => {
                console.log('User register error', error)
            });


    }

    return (
        <div className='flex justify-center items-center h-screen'>
            <form onSubmit={handleRegister}
                className='flex flex-col items-center justify-center gap-3 border p-10 rounded-md'
            >
                <h1 className='text-xl border-b-2 px-3 py-1'>Sign Up</h1>
                <input type="text"
                    placeholder='Enter username'
                    className='p-2 rounded-sm bg-transparent border placeholder:text-white'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input type="password"
                    placeholder='Enter password'
                    className='p-2 rounded-sm bg-transparent border placeholder:text-white'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type='submit'
                    className='bg-orange-700 py-3 px-10 w-full'
                >Register</button>
            </form>
        </div>
    )
}

export default Signup