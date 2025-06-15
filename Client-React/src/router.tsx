import { createBrowserRouter } from 'react-router-dom';
import LoginForm from './components/Auth/login';
import Layout from './components/layout';
import FileUploader from './components/fileUploader';
import About from './components/about';
import ResumesPage from './components/resumes';
import UserProfile from './components/profile';
import HomePage from './components/home';
import RegisterForm from './components/Auth/registerForm';
// import SettingsPage from './components/settings';
import PersonalArea from './components/personalArea';
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
      { path: 'register', element: <RegisterForm /> },
      { path: 'personalArea', element: <PersonalArea /> },
      { path: 'profile', element: <UserProfile /> },
      // { path: 'SettingsPage', element: <SettingsPage /> }

    ]
  },
]);

export default router;
