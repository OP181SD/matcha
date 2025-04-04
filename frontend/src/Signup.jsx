import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function Signup() {
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

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted', formData);

        fetch('http://127.0.0.1:5001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (response.status === 400) {
                    setError("Votre nom d'utilisateur ou votre email est déjà utilisé.");
                    setTimeout(() => setError(''), 2000);
                } else if (response.status === 201) {
                    setSuccess("Inscription réussie avec succès !");
                    setTimeout(() => setSuccess(''), 2000);
                }
                return response.json();
            })
            .then(data => {
                console.log('Données reçues:', data);
            })
            .catch((error) => {
                console.error('Erreur:', error);
            });
    };

    return (
        <div className='h-screen flex justify-center items-center bg-matcha'>
            <form className='bg-white p-8 rounded-lg shadow-lg w-96' onSubmit={handleSubmit}>
                <h2 className='text-2xl font-bold text-center mb-6 text-pen'>Inscription</h2>
                {success && <p className="text-green-500 font-bold text-sm text-center mb-4">{success}</p>}
                {error && <p className="text-red-500 font-bold text-sm text-center mb-4">{error}</p>}
                
                <div className='mb-4'>
                    <label htmlFor='username' className='block text-pen font-semibold mb-2'>Nom</label>
                    <input
                        type='text'
                        id='username'
                        name='username'
                        value={formData.username}
                        onChange={handleChange}
                        autoComplete="username"
                        className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tea'
                        required
                    />
                </div>
                
                <div className='mb-4'>
                    <label htmlFor='email' className='block text-pen font-semibold mb-2'>Email</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tea'
                        required
                    />
                </div>
                
                <div className='mb-4'>
                    <label htmlFor='password' className='block text-pen font-semibold mb-2'>Mot de passe</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tea'
                        required
                    />
                </div>
                
                <button
                    type='submit'
                    className='w-full mb-4 bg-tea text-white p-2 rounded-md hover:bg-[#74a12e] transition'>
                    S'inscrire
                </button>
                
                <Link to="/">
                    <button
                        className='w-full bg-tea text-white p-2 rounded-md hover:bg-[#74a12e] transition'>
                        Retour
                    </button>
                </Link>
            </form>
        </div>
    );
}
