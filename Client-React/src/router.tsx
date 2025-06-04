import { createBrowserRouter } from 'react-router-dom';
import LoginForm from './components/Auth/login';
import Register from './components/Auth/register';
import Layout from './components/layout';
import FileUploader from './components/fileUploader';
import About from './components/about';
import ResumesPage from './components/resumes';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: 'about', element: <About /> }, 
            { path: 'FileUploader', element: <FileUploader /> },
            { path: 'resumes', element: <ResumesPage /> },
            { path: 'login', element: <LoginForm /> }, // הוספת ה-login כאן
            { path: 'register', element: <Register /> }, // הוספת ה-register כאן
        ],
    },
]);

export default router;
