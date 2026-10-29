import { Link } from 'react-router-dom';

import { FaEnvelopeOpenText } from 'react-icons/fa';

import { useLogin } from '../hooks/useLogin.js';

import { btnBase, inputBase } from '../../../component/shared/ui.js';

import { Header } from '../../../component/shared/Header.jsx';

export function AccountNotValidated() {
  return (
    <div className="min-h-screen bg-matcha text-pen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-20 grid lg:grid-cols-[1.06fr_.94fr] gap-10 lg:gap-16 items-center">

          {}
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 text-[11.5px] font-extrabold tracking-[0.2em] uppercase text-pen/60">
              <span className="w-5 h-0.5 bg-tea rounded" />
              Matcha · Validation du compte
            </span>

            <h1 className="font-quicksand font-extrabold text-3xl sm:text-4xl leading-tight max-w-[14ch]">
              Encore une petite étape avant la{' '}
              <mark className="bg-tea text-pen rounded px-1">
                rencontre
              </mark>.
            </h1>

            <p className="text-pen/70 text-base sm:text-lg leading-relaxed max-w-[52ch]">
              Ton compte a bien été créé, mais il doit encore être activé.
              Vérifie ta boîte mail et clique sur le lien de validation que
              nous t’avons envoyé.
            </p>

            <div className="flex items-center gap-3 bg-pink/20 border border-pen/60 rounded-xl px-4 py-3">
              <FaEnvelopeOpenText className="text-pink flex-none" size={24} />

              <span className="font-bold text-sm sm:text-base">
                Pense aussi à vérifier tes spams.
              </span>
            </div>

            <p className="text-pen/60 text-sm max-w-[52ch]">
              Toujours rien reçu ?{' '}
              <Link
                to="/verify-email"
                className="font-bold underline text-pink"
              >
                Demande un nouveau lien de validation
              </Link>
              .
            </p>
          </div>

          {}
          <div className="relative grid place-items-center min-h-[400px]">

            {}
            <div className="hidden lg:block absolute z-0 w-[290px] h-[330px] bg-matcha border border-pen/60 rounded-[20px] shadow-[3px_3px_0_rgba(89,67,71,0.28)] opacity-40 rotate-6 translate-x-6 translate-y-2" />

            {}
            <div className="relative z-10 w-full max-w-[400px] bg-matcha border border-pen/60 rounded-[20px] p-6 sm:p-8 shadow-[3px_3px_0_rgba(89,67,71,0.28)] -rotate-1">

              <div className="flex flex-col items-center text-center gap-4">

                <div className="w-16 h-16 rounded-full border border-pen/60 bg-pink/30 grid place-items-center">
                  <FaEnvelopeOpenText
                    className="text-pink"
                    size={30}
                  />
                </div>

                <div>
                  <h2 className="font-quicksand font-extrabold text-2xl text-pen">
                    Compte non validé
                  </h2>

                  <p className="text-sm text-pen/60 mt-2">
                    Active ton compte pour commencer à utiliser Matcha.
                  </p>
                </div>

                <div className="w-full border-t-2 border-pen/10 my-1" />

                <p className="text-sm leading-relaxed text-pen/70">
                  Nous avons envoyé un email de confirmation à l’adresse
                  utilisée lors de ton inscription.
                </p>

                <Link
                  to="/verify-email"
                  className={`${btnBase} bg-pink text-pen px-6 py-3 w-full`}
                >
                  Renvoyer un lien
                  <span className="text-xl">→</span>
                </Link>

                <Link
                  to="/"
                  className={`${btnBase} bg-tea text-pen px-6 py-3 w-full`}
                >
                  Retour à Matcha
                  <span className="text-xl">戻る</span>
                </Link>

              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

export function Login() {
  const { values, error, handleChange, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen bg-matcha text-pen flex flex-col">
      <Header title="connexion" kanji="繋がり" />

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-6 sm:py-20 grid lg:grid-cols-[1.06fr_.94fr] gap-6 lg:gap-16 items-center">

          {}
          <div className="flex flex-col items-start gap-6 order-last lg:order-none">

            {}

            <h1 className="font-quicksand font-extrabold text-3xl sm:text-4xl leading-tight max-w-[14ch]">
              Reviens faire une{' '}
              <mark className="bg-tea text-pen rounded px-1">
                vraie rencontre
              </mark>.
            </h1>

            <p className="text-pen/70 text-base sm:text-lg leading-relaxed max-w-[52ch]">
              Connecte-toi à ton compte Matcha pour retrouver tes matchs,
              découvrir de nouveaux profils et continuer tes conversations.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold px-3 py-1.5 border border-pen/60 rounded-full bg-tea/25">
                #match
              </span>

              <span className="text-xs font-bold px-3 py-1.5 border border-pen/60 rounded-full bg-pink/25">
                #rencontre
              </span>

              <span className="text-xs font-bold px-3 py-1.5 border border-pen/60 rounded-full bg-tea/25">
                #connexion
              </span>
            </div>

            <p className="text-sm text-pen/60">
              Pas encore de compte ?{' '}
              <Link
                to="/signup"
                className="font-bold underline text-tea"
              >
                Inscris-toi
              </Link>
              .
            </p>
          </div>

          {}
          <div className="relative grid place-items-center lg:min-h-[400px] order-first lg:order-none">

            {}
            <div className="hidden lg:block absolute z-0 w-[390px] h-[390px] bg-matcha border border-pen/60 rounded-[20px] shadow-[3px_3px_0_rgba(89,67,71,0.28)] opacity-40 rotate-5 translate-x-5 translate-y-2" />

            {}
            <form
              onSubmit={handleSubmit}
              className="relative z-10 w-full max-w-[400px] bg-matcha border border-pen/60 rounded-[20px] shadow-[3px_3px_0_rgba(89,67,71,0.28)] p-6 sm:p-8 flex flex-col gap-4 -rotate-1"
            >

              <div className="mb-2">
                <h2 className="font-quicksand font-extrabold text-2xl text-pen">
                  Se connecter
                </h2>

                <p className="text-sm text-pen/60 mt-1">
                  Retrouve ton espace Matcha.
                </p>
              </div>

              <label
                htmlFor="log"
                className="text-pen font-bold text-sm"
              >
                Nom d&apos;utilisateur
              </label>

              <input
                type="text"
                id="log"
                name="log"
                placeholder="Nom d'utilisateur"
                value={values.log}
                onChange={handleChange}
                className={inputBase}
                required
                autoComplete="username"
                aria-label="Nom d'utilisateur"
                aria-required="true"
              />

              <label
                htmlFor="password"
                className="text-pen font-bold text-sm"
              >
                Mot de passe
              </label>

              <input
                type="password"
                id="password"
                name="password"
                placeholder="Mot de passe"
                value={values.password}
                onChange={handleChange}
                className={inputBase}
                required
                autoComplete="current-password"
                aria-label="Mot de passe"
                aria-required="true"
              />

              <div className="flex flex-col gap-3 mt-2">

                <button
                  type="submit"
                  className={`${btnBase} bg-pink text-pen p-2.5`}
                  aria-label="Connexion"
                >
                  Se connecter
                  <span className="text-xl">続く</span>
                </button>

                <Link
                  to="/"
                  className={`${btnBase} bg-matcha text-pen p-2.5`}
                  aria-label="Retour"
                >
                  Retour
                  <span className="text-xl">戻る</span>
                </Link>

              </div>

              {error && (
                <p
                  className="text-tea font-bold text-center break-words max-h-[4.5em] overflow-hidden"
                  aria-live="assertive"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <div className="border-t-2 border-pen/10 pt-4 flex flex-col gap-2">

                <p className="text-sm text-center text-pen">
                  Vous n&apos;avez pas de compte ?{' '}
                  <Link
                    to="/signup"
                    className="font-bold underline text-tea"
                  >
                    Inscrivez-vous
                  </Link>
                </p>

                <p className="text-sm text-center">
                  <Link
                    to="/forgot-password"
                    className="underline text-pen font-bold"
                  >
                    Mot de passe oublié ?
                  </Link>
                </p>

              </div>

            </form>
          </div>

        </section>
      </main>
    </div>
  );
}
