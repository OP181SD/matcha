import { useState, useEffect, useRef } from "react";
import axios from "axios";
export const useConfirmEmail = (token) => {
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage(
        "Le lien de confirmation est invalide ou incomplet. Veuillez vérifier le lien ou en demander un nouveau."
      );
      return;
    }

    if (hasRun.current) return; 
    hasRun.current = true;

    const confirmEmail = async () => {
      try {
        await axios.get(`/api/confirm-email?token=${token}`, { withCredentials: true });
        setStatus("success");
        setErrorMessage("");
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error.response
            ? (error.response.data?.error || "Erreur inconnue lors de la vérification.")
            : "Erreur réseau, impossible de vérifier l'email."
        );
      }
    };

    confirmEmail();
  }, [token]);

  return { status, errorMessage };
};