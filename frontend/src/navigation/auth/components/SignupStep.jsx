import { Link } from 'react-router-dom';

import { useSignup } from '../hooks/useSignup.js';

import { btnBase, inputBase, signupCard } from '../../../component/shared/ui.js';

import { SignupLayout } from './SignupLayout.jsx';

export function SignupStep({ onNext }) {
  const { values, error, handleChange, handleSubmit, handleCancel } = useSignup(onNext);

  return (
    <SignupLayout>
      <form onSubmit={handleSubmit} className={signupCard}>

        <div className="mb-1">
          <h2 className="font-quicksand font-extrabold text-2xl text-pen">
            Créer mon compte
          </h2>
          <p className="text-sm text-pen/60 mt-1">
            Quelques informations et ton profil sera prêt.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">

          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-pen font-bold text-sm">
              Nom d&apos;utilisateur
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Nom d'utilisateur"
              value={values.username}
              onChange={handleChange}
              className={inputBase}
              required
              autoComplete="username"
              aria-label="Nom d'utilisateur"
              aria-required="true"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-pen font-bold text-sm">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Adresse email"
              value={values.email}
              onChange={handleChange}
              className={inputBase}
              required
              autoComplete="email"
              aria-label="Adresse email"
              aria-required="true"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="first_name" className="text-pen font-bold text-sm">
              Prénom
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="Prénom"
              value={values.first_name}
              onChange={handleChange}
              className={inputBase}
              required
              autoComplete="given-name"
              aria-label="Prénom"
              aria-required="true"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="last_name" className="text-pen font-bold text-sm">
              Nom de famille
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Nom de famille"
              value={values.last_name}
              onChange={handleChange}
              className={inputBase}
              required
              autoComplete="family-name"
              aria-label="Nom de famille"
              aria-required="true"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-pen font-bold text-sm">
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
              autoComplete="new-password"
              aria-label="Mot de passe"
              aria-required="true"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-pen font-bold text-sm">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirmer mot de passe"
              value={values.confirmPassword}
              onChange={handleChange}
              className={inputBase}
              required
              autoComplete="new-password"
              aria-label="Confirmer mot de passe"
              aria-required="true"
            />
          </div>

        </div>

        <div className="grid grid-cols-2 gap-3 mt-1">

          <button
            type="submit"
            className={`${btnBase} bg-pink text-pen p-2.5`}
            aria-label="S'inscrire"
          >
            S&apos;inscrire
            <span className="text-xl">続く</span>
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className={`${btnBase} bg-matcha text-pen p-2.5`}
            aria-label="Retour"
          >
            Retour
            <span className="text-xl">戻る</span>
          </button>

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

        <div className="border-t-2 border-pen/10 pt-3">
          <p className="text-sm text-center text-pen">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="font-bold underline text-tea">
              Connectez-vous
            </Link>
          </p>
        </div>

      </form>
    </SignupLayout>
  );
}
