import { startAuthentication } from '@simplewebauthn/browser';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');

    const handlePasskeyLogin = async (e) => {
        e.preventDefault();
        await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/login-challenge`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        })
            .then((res) => res.json())
            .then(async (data) => {
                console.log('data: ', data);
                // server side challenges ---
                const { options } = data;
                const authResult = await startAuthentication(options);


                // CODE HERE87agwe8iof7g ===awfawfawf===========
                // verify the challenge credentials ---------
                await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/login-verify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId, cred: authResult })
                })
                    .then((res) => res.json())
                    .then(async (data) => {
                        console.log('data.success: ', data.success);
                        if (data.success) {
                            console.log('Passkey Login successful');
                            console.log(data);
                        } else {
                            console.log('Passkey Login Failed');
                        }
                    })
                    .catch(error => {
                        console.log('User register error', error)
                    });

            })
            .catch(error => {
                console.log('User register error', error)
            });
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            <form onSubmit={handlePasskeyLogin}
                className='flex flex-col items-center justify-center gap-3 border p-10 rounded-md'
            >
                <h1 className='text-xl border-b-2 px-3 py-1'>Login</h1>
                <input type="text"
                    placeholder='Enter userId'
                    className='p-2 rounded-sm bg-transparent border placeholder:text-white'
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                />
                <button type='submit'
                    className='bg-orange-700 py-3 px-10 w-full'
                >Login with passkey</button>
            </form>
        </div>
    )
}

export default Login