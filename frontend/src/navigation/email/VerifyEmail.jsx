import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../utils/parsing.js";
import axios from "axios";

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!isValidEmail(email)) {
      setError("Veuillez saisir une adresse e-mail valide.");
      return;
    }

    try {
      const { data } = await axios.post("/api/generate-email-token", { email }, { withCredentials: true });
      setSent(true);
      setMessage(data.message || "Un lien de vérification a été envoyé à votre adresse.");
    } catch (err) {
      if (err.response?.status === 409) {
        setSent(true);
        setMessage(err.response.data?.message || "Un email de vérification a déjà été envoyé récemment.");
        return;
      }
      if (err.response) {
        setError(err.response.data?.error || "Une erreur est survenue.");
        return;
      }
      setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex h-[70vh] flex-col items-center justify-center py-10 px-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-pen">
          Vérification de l’adresse e-mail
        </h1>

        <p className="flex items-center justify-center text-center font-bold text-2xl mb-4">
          <FaEnvelope className="text-pink mr-2" size={32} />
          <span className="text-tea">メールアドレスの確認</span>
        </p>

        {sent ? (
          <p className="max-w-md mx-auto mb-6 text-center text-pen font-bold text-lg">
            {message}
          </p>
        ) : (
          <>
            <p className="max-w-md mx-auto mb-8 text-center text-pen font-bold text-lg">
              Entrez votre adresse e-mail pour recevoir un lien de vérification.
            </p>

            <form onSubmit={handleSendEmail} className="w-full max-w-md">
              <label htmlFor="email" className="sr-only">Adresse e-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre adresse e-mail"
                className="matcha-input !py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-pink"
                required
              />

              <button
                type="submit"
                className="bg-pen text-white font-bold py-3 px-6 w-full rounded-md hover:bg-pink transition"
              >
                Envoyer le lien de vérification
              </button>
            </form>

            {error && (
              <p className="text-center mt-8 font-semibold text-pink">{error}</p>
            )}
          </>
        )}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 text-sm px-6 py-4 bg-pen rounded-full text-white font-bold hover:bg-tea transition"
        >
          Retour à l’accueil
        </button>
      </div>
    </div>
  );
};
