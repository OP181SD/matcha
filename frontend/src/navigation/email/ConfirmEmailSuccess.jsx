import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { useConfirmEmail } from "./hooks/useConfirmEmail";

export const ConfirmEmailSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { status, errorMessage } = useConfirmEmail(token);

  const continueAfterVerify = async () => {
    try {
      const { data } = await axios.get("/api/me", { withCredentials: true });
      navigate(data.profile_complete ? "/meet-page" : "/complete-profile");
    } catch {
      navigate("/complete-profile");
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-pen">
        Adresse e-mail confirmée !
      </h1>

      <p className="flex items-center justify-center text-center font-bold text-2xl mb-4">
        <FaCheckCircle className="text-pink mr-2" size={32} />
        <span className="text-tea">確認済みメールアドレス</span>
      </p>

      <p className="max-w-md mx-auto mb-8 text-center text-pen font-bold text-lg">
        Merci d’avoir confirmé votre adresse e-mail. Vous pouvez maintenant utiliser Matcha.
      </p>

      <button
        onClick={continueAfterVerify}
        className="bg-pen text-white font-bold py-3 px-6 rounded-md hover:bg-tea transition"
      >
        Continuer
      </button>
    </div>
  );
};
