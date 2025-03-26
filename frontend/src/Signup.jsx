import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';



export function Signup() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted', formData);

        fetch('http://127.0.0.1:5001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => console.log('Inscription reussi:', data))
            .catch((error) => console.error('Error:', error));
            navigate("/dashboard", { state: {formData}}); 
    };

    return (
        <div className='h-screen flex justify-center items-center bg-matcha'>
            <form className='bg-white p-8 rounded-lg shadow-lg w-96' onSubmit={handleSubmit}>
                <h2 className='text-2xl font-bold text-center mb-6 text-pen'>Inscription</h2>
                <div className='mb-4'>
                    <label className='block text-pen font-semibold mb-2'>Nom</label>
                    <input
                        type='text'
                        name='username'
                        value={formData.username}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tea'
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-pen font-semibold mb-2'>Email</label>
                    <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tea'
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-pen font-semibold mb-2'>Mot de passe</label>
                    <input
                        type='password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tea'
                        required
                    />
                </div>
                <button
                    type='submit'
                    className='w-full mb-4 bg-tea text-white p-2 rounded-md hover:bg-[#74a12e] transition'>
                    S'inscrire
                </button>
                <Link to= "/">
                    <button
                        className='w-full bg-tea text-white p-2 rounded-md hover:bg-[#74a12e] transition'>
                        Retour
                    </button>
                </Link>
            </form>
        </div>
    );
}