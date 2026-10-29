import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerRequest } from '../api/auth.js';
import { validatePassword } from '../../../utils/validatePassword.js';

export function useSignup(onSuccess) {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const pw = validatePassword(values.password);
    if (!pw.ok) {
      setError(pw.msg);
      return;
    }
    if (values.password !== values.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const { ok, data } = await registerRequest(values);
      if (!ok) {
        setError(data.error || 'Une erreur est survenue');
        return;
      }
      onSuccess();
    } catch {
      setError('Impossible de contacter le serveur');
    }
  };

  const handleCancel = () => navigate('/');

  return { values, error, handleChange, handleSubmit, handleCancel };
}
