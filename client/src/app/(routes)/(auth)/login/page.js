import Login from '../../../auth/login/Login';
import '@/app/components/GlobalStyles.css';

export const metadata = {
    title: 'Login',
    description: 'Log in page',
};

export default function LoginPage() {
    return <Login />;
}
