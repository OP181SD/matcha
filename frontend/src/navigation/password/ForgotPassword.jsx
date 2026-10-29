import { useState } from "react";
import { Link } from "react-router-dom";
import { isValidEmail } from "../../utils/parsing.js";
import axios from "axios";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!isValidEmail(email)) {
            setError("Veuillez saisir une adresse e-mail valide.");
            return;
        }

        try {
            await axios.post("/api/generate-password-reset-token", { email });
            setMessage(
                "Un lien de réinitialisation a été envoyé à votre adresse e-mail si elle est enregistrée."
            );
        } catch (err) {
            if (!err.response) {
                setError("Erreur de connexion au serveur.");
            } else if (err.response.status === 409) {
                setError(
                    err.response.data?.message ||
                    "Un lien de réinitialisation a déjà été envoyé récemment. Veuillez vérifier votre boîte de réception ou réessayer plus tard."
                );
            } else {
                setError(err.response.data?.error || "Une erreur est survenue.");
            }
        }
    };

    return (
        <div className="min-h-screen">
            <div className="flex h-[70vh] flex-col items-center justify-center py-10 px-6">
                <h1 className="text-3xl font-bold text-center mb-6 text-pen">
                    Mot de passe oublié ?
                </h1>
                <p className="text-center font-bold text-2xl mb-4">
                    <span className="text-pink mr-2">? パスワー</span>
                    <span className="text-tea">ドを忘れた ?</span>
                </p>

                <p className="max-w-md mx-auto mb-8 text-center text-pen font-bold text-lg">
                    Entrez votre adresse e-mail ci-dessous, et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="matcha-card w-full max-w-md !p-6 space-y-4"
                >
                    <label className="block font-bold text-pen" htmlFor="email">
                        Adresse e-mail
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Entrez votre e-mail"
                        aria-label="Adresse e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="matcha-input !py-3"
                    />

                    <button
                        type="submit"
                        aria-label="Envoyer le lien de réinitialisation"
                        className="w-full bg-pen text-white font-bold py-3 rounded-md"
                    >
                        Envoyer le lien de réinitialisation
                    </button>

                    {message && (
                        <p className="mt-4 text-center text-sm text-tea font-semibold" aria-live="polite">
                            {message}
                        </p>
                    )}

                    {error && (
                        <p className="mt-4 text-center text-sm text-pen font-semibold" aria-live="assertive">
                            {error}
                        </p>
                    )}

                  
                    <Link
                        to="/login"
                        className="block mt-6 text-center text-sm text-pen font-bold underline hover:text-tea"
                    >
                        ← Retour à la connexion
                    </Link>
                </form>
            </div>
        </div>
    );
};