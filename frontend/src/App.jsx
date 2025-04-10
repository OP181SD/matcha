import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './Home';
import { Signup } from './Signup';
import { Login } from './Login';
import { Dashboard } from './Dashboard';
import { Profil } from './Profil';

function ErrorPage() {
  return <h1>Oups la page que vous chercher n'existe pas !</h1>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />
  },
  {
    path: '/signup',
    element: <Signup />,
    errorElement: <ErrorPage />
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    errorElement: <ErrorPage />
  },
  {
    path: '/profil',
    element: <Profil />,
    errorElement: <ErrorPage />
  }

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
