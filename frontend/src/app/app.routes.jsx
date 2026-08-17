import { createBrowserRouter } from 'react-router';
import App from './App';
// import Login from './pages/auth/login';
// import Register from './pages/auth/register';

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <h1>hello world</h1>
    },
    // {   
    //     path: "/login",
    //     element: <Login />
    // },
    // {
    //     path: "/register",
    //     element: <Register />
    // }
]);