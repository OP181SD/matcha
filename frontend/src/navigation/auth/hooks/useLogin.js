import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../api/auth.js';

export function useLogin() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ log: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { ok, data } = await loginRequest(values.log, values.password);
      if (!ok) {
        setError(data.error || 'Erreur de connexion');
        return;
      }
      if (!data.success) {
        if (data.account_valid === false) {
          navigate('/account-not-validated');
          return;
        }
        setError(data.error || 'Erreur de connexion');
        return;
      }
      if (data.profile_complete === false) {
        navigate('/complete-profile');
        return;
      }
      navigate('/meet-page');
    } catch {
      setError('Erreur de connexion au serveur');
    }
  };

  return { values, error, handleChange, handleSubmit };
}
