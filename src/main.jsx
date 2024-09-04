import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from './theme.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Movies from './pages/movies/Movies.jsx';
import Shows from './pages/shows/Shows';
import Search from './pages/search/Search.jsx';
import DetailsPage from './pages/DetailsPage.jsx';
import { AuthProvider } from './context/authProvider.jsx';
import Watchlist from './pages/Watchlist.jsx';
import Protected from './components/routes/Protected.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: '/movies',
        element: <Movies />,
      },
      {
        path: '/shows',
        element: <Shows />,
      },
      {
        path: '/search',
        element: <Search />,
      },
      {
        path: '/:type/:id',
        element: <DetailsPage />,
      },
      {
        path: '/watchlist',
        element: <Protected><Watchlist /></Protected>
      }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);