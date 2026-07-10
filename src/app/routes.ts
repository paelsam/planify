import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Sessions } from './pages/Sessions';
import { Categories } from './pages/Categories';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    Component: Root,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: 'sesiones',
        Component: Sessions,
      },
      {
        path: 'categorias',
        Component: Categories,
      },
    ],
  },
]);