import Register from '../../../auth/register/Register';
import '@/app/components/GlobalStyles.css';

export const metadata = {
    title: 'Register',
    description: 'Register page',
};

export default function RegisterPage() {
    return <Register />;
}
