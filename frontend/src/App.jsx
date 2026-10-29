import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Matcha } from './Matcha';
import { Signup } from './navigation/auth/components/Signup';
import { CompleteProfile } from './navigation/auth/components/CompleteProfile.jsx';
import { Login } from './navigation/auth/components/Login';
import { Meetpage } from './navigation/meeting/Meetpage';
import { SearchPage } from './navigation/search/SearchPage.jsx';
import { ConfirmationPage } from './navigation/auth/components/Confirmpage';
import { MessagePage } from './navigation/tchat/MessagePage';
import { Profil } from './navigation/profil/OwnProfil.jsx';
import { Settings } from './navigation/settings/Settings.jsx';
import { BlocPage } from './navigation/bloc/BlocPage.jsx';
import { ViewsHistory } from './navigation/history/ViewsHistory.jsx';
import { LikesHistory } from './navigation/history/LikesHistory.jsx';
import { SocketProvider } from './socket/Socket.jsx';
import { ProfilePage } from './navigation/profil/ProfilePage.jsx';
import { ChannelView } from './navigation/ChannelView.jsx';
import { ForgotPassword } from './navigation/password/ForgotPassword.jsx';
import { ConfirmEmailSuccess } from './navigation/email/ConfirmEmailSuccess.jsx';
import { VerifyEmail } from './navigation/email/VerifyEmail.jsx';
import { SocketAutoConnect } from './socket/SocketAutoConnect.jsx';
import { ConfirmPasswordReset } from './navigation/password/ConfirmPasswordReset.jsx';
import { ProtectedRoute } from './component/auth-component/ProtectedRoute.jsx';
import { PublicRoute } from './component/auth-component/PublicRoute.jsx';
import { NotificationProvider } from './contexts/NotificationContext.jsx';
import { NotificationToast } from './component/notifications/NotificationToast.jsx';
import { NotificationsPage } from './navigation/notifications/NotificationsPage.jsx'
import { AccountNotValidated } from './navigation/auth/components/Login';
import { Footer } from './component/Footer.jsx';

function ErrorPage() {
  return <h1>Oups la page que vous cherchez n'existe pas !</h1>;
}

function WithSocketLayout() {
  return (
    <SocketProvider>
      <SocketAutoConnect />
      <NotificationProvider>
        <NotificationToast />
        <div className="flex flex-col min-h-screen">
          <div className="flex-1 flex flex-col">
            <Outlet />
          </div>
          <Footer />
        </div>
      </NotificationProvider>
    </SocketProvider>
  );
}

function WithoutSocketLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter(
  [

    {
      element: <WithoutSocketLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: '/', element: <PublicRoute><Matcha /></PublicRoute> },
        { path: '/signup', element: <PublicRoute><Signup /></PublicRoute> },
        { path: '/login', element: <PublicRoute><Login /></PublicRoute> },
        { path: '/verify-email', element: <PublicRoute><VerifyEmail /></PublicRoute> },
        { path: '/confirm-email', element: <ConfirmEmailSuccess /> },
        { path: '/forgot-password', element: <PublicRoute><ForgotPassword /></PublicRoute> },
        { path: '/confirm-password-reset', element: <PublicRoute><ConfirmPasswordReset /></PublicRoute> },
        { path: '/account-not-validated', element: <PublicRoute><AccountNotValidated /></PublicRoute> },
        { path: '/complete-profile', element: <ProtectedRoute><CompleteProfile /></ProtectedRoute> },
      ],
    },

    {
      element: <WithSocketLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: '/profil', element: <ProtectedRoute><Profil /></ProtectedRoute> },
        { path: '/settings', element: <ProtectedRoute><Settings /></ProtectedRoute> },
        { path: '/meet-page', element: <ProtectedRoute><Meetpage /></ProtectedRoute> },
        { path: '/search', element: <ProtectedRoute><SearchPage /></ProtectedRoute> },
        { path: '/chat-page', element: <ProtectedRoute><ChannelView /></ProtectedRoute> },
        { path: '/confirm-page', element: <ProtectedRoute><ConfirmationPage /></ProtectedRoute> },
        { path: '/message-page', element: <ProtectedRoute><MessagePage /></ProtectedRoute> },
        { path: '/bloc-page', element: <ProtectedRoute><BlocPage /></ProtectedRoute> },
        { path: '/view-history', element: <ProtectedRoute><ViewsHistory /></ProtectedRoute> },
        { path: '/like-history', element: <ProtectedRoute><LikesHistory /></ProtectedRoute> },
        { path: '/profile/:id', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
        { path: '/notifications', element: <ProtectedRoute><NotificationsPage /></ProtectedRoute> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

function App() {

  return (
    <>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;
