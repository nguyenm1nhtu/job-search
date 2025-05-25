import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="">
                {children}
                <ToastContainer />
            </body>
        </html>
    );
}
