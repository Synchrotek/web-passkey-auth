import { useSearchParams } from "react-router-dom";
import { startRegistration } from '@simplewebauthn/browser'

const Profile = () => {
    const [params, setParams] = useSearchParams();

    const handleReisterPasskey = async (e) => {
        e.preventDefault();
        const userId = params.get('userId');

        // generate the challenge credentials ------------------
        await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/register-challenge`, {
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
                const authResult = await startRegistration(options);

                // verify the challenge credentials ---------
                await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/register-verify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId, cred: authResult })
                })
                    .then((res) => res.json())
                    .then(async (data) => {
                        console.log('data.verified: ', data.verified);
                        if (data.verified) {
                            console.log('Passkey verification successful');
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
        <div className='flex flex-col justify-center items-center h-screen gap-6'>
            <h1 className='text-xl border-b-2 w-1/2 text-center py-2'
            >Profile</h1>
            <button onClick={handleReisterPasskey}
                className='bg-orange-700 py-3 px-10 min-w-60'
            >Register a Passkey</button>
        </div>
    )
}

export default Profile