import { useNavigate } from 'react-router-dom';

import { SignupStep } from './SignupStep.jsx';

export function Signup() {
  const navigate = useNavigate();
  return <SignupStep onNext={() => navigate('/verify-email')} />;
}
