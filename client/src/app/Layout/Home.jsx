'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Header from './Header/Header';
import Main from './Main/Main';
import Footer from './Footer/Footer';

export default function Home() {
    const { login, setLogin } = useAuth();

    return (
        <>
            <Header login={login} setLogin={setLogin} />
            <Main />
            <Footer />
        </>
    );
}
