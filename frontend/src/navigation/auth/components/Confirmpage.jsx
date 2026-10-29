import { useNavigate } from 'react-router-dom';

export function ConfirmationPage({ message = "Action complétée avec succès.", redirectTo = "/login", buttonText = "Se connecter" }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-matcha flex items-center justify-center px-4">
      <div className="matcha-card max-w-md w-full !p-8 text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-full grid place-items-center border border-pen/60 bg-tea/25">
          <i className="fas fa-check text-tea text-2xl" />
        </div>
        <h1 className="text-2xl font-bold text-pen">Confirmation</h1>
        <p className="text-pen/70 text-md font-medium">{message}</p>

        <button
          onClick={() => navigate(redirectTo)}
          className="matcha-btn matcha-btn-tea"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}