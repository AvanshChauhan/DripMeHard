import { createBrowserRouter } from 'react-router';
import App from './App';
import Register from '../features/auth/pages/Register';
import Login from '../features/auth/pages/Login';

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <h1>hello world</h1>
    },
    {   
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
]);