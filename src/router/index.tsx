import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layout/Layout';
import Home from '../pages/Home';
import UrlScanner from '../pages/UrlScanner';
import EmailScanner from '../pages/EmailScanner';
import Dashboard from '../pages/Dashboard';
import About from '../pages/About';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'url-scanner',
        element: <UrlScanner />,
      },
      {
        path: 'email-scanner',
        element: <EmailScanner />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
