import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { validatePassword } from "../../utils/validatePassword.js";

export const ConfirmPasswordReset = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Lien invalide ou incomplet.");
      return;
    }

    if (hasRun.current) return;
    hasRun.current = true;

    const checkToken = async () => {
      try {
        await axios.get(`/api/confirm-password-reset?token=${token}`);
        setStatus("valid");
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error.response
            ? (error.response.data?.error || "Lien invalide ou expiré.")
            : "Erreur de connexion."
        );
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pw = validatePassword(password);
    if (!pw.ok) {
      setErrorMessage(pw.msg);
      return;
    }

    try {
      await axios.post("/api/reset-password", { token, password });
      setConfirmed(true);
    } catch (err) {
      setErrorMessage(
        err.response
          ? (err.response.data?.error || "Erreur lors de la mise à jour du mot de passe.")
          : "Erreur réseau."
      );
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center py-10 px-6">
        <h1 className="text-4xl font-extrabold text-center mb-4 text-pen">
          matcha <span className="text-pink">抹</span><span className="text-tea">茶</span>
        </h1>
        <p className="text-center text-base md:text-lg mb-6 text-pen max-w-md">
          {errorMessage}
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-pen text-white font-semibold py-3 px-6 rounded-md hover:bg-pink transition"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-10 px-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-pen">
          Mot de passe réinitialisé !
        </h1>
        <p className="flex items-center justify-center text-center font-bold text-2xl mb-4">
          <FaCheckCircle className="text-pink mr-2" size={32} />
          <span className="text-tea">パスワード更新完了</span>
        </p>
        <p className="max-w-md mx-auto mb-8 text-center text-pen font-bold text-lg">
          Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-pen text-white font-bold py-3 px-6 rounded-md hover:bg-tea transition"
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (


    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-6">
      <h1 className="text-2xl font-extrabold text-center mb-4 text-pen">
        Réinitialiser votre mot de passe{" "}
        <span className="text-pink">パスワード</span>
        <span className="text-tea">をリセット</span>
      </h1>
      <h1 className="text-xl font-bold text-center mb-6 text-pen">
        Choisissez un nouveau mot de passe
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <label htmlFor="password" className="block font-bold text-pen">
          Nouveau mot de passe
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-md border border-pen/60 font-bold placeholder-pen"
          placeholder="Votre nouveau mot de passe"
        />
        {errorMessage && (
          <p className="text-pen text-sm font-semibold text-center">{errorMessage}</p>
        )}
        <button
          type="submit"
          className="w-full bg-pen text-white font-bold py-3 rounded-md hover:bg-tea transition"
        >
          Réinitialiser le mot de passe
        </button>
      </form>
    </div>
  );
};