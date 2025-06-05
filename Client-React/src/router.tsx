import { createBrowserRouter } from 'react-router-dom';
import LoginForm from './components/Auth/login';
import Register from './components/Auth/register';
import Layout from './components/layout';
import FileUploader from './components/fileUploader';
import About from './components/about';
import ResumesPage from './components/resumes';

import UserProfile from './components/profile';

import HomePage from './components/home';
import Dashboard from './pages/Dashboard';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: '/', element: <HomePage /> },
            { path: 'about', element: <About /> }, 
            { path: 'FileUploader', element: <FileUploader /> },
            { path: 'resumes', element: <ResumesPage /> },
            { path: 'login', element: <LoginForm /> }, 
            { path: 'register', element: <Register /> }, 
          { path: 'dashboard', element: <Dashboard /> },
            { path: 'profile', element: <UserProfile /> },

            ]    },
]);

export default router;
