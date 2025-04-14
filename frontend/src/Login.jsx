import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        log: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Pour envoyer et recevoir les cookies
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Login réussi
                navigate('/dashboard'); // Redirection vers une page protégée
            } else {
                setError(data.message || 'Login échoué');
            }
        } catch (err) {
            setError('Erreur serveur');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="log"
                placeholder="Email ou pseudo"
                value={formData.log}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <button type="submit">Se connecter</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

