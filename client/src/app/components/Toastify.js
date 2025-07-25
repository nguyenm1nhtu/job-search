import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@nextui-org/react';

const showToast = (type, message, callback) => {
    switch (type) {
        case 'error':
            toast.error(message, {
                position: 'top-right',
                autoClose: 2000,
            });
            break;

        case 'warn':
            toast.warn(message, {
                position: 'top-right',
                autoClose: 2000,
                onClose: callback,
            });
            break;

        case 'success':
            toast.success(message, {
                position: 'top-right',
                autoClose: 2000,
                onClose: callback,
            });
            break;

        case 'confirm':
            toast(
                <div>
                    <p style={{ fontSize: '16px' }}>{message}</p>
                    <Button
                        onClick={() => {
                            callback();
                            toast.dismiss();
                        }}
                        color="primary"
                        className="text-md mt-2"
                    >
                        Xác nhận
                    </Button>
                </div>,
                {
                    position: 'top-right',
                    autoClose: false, // Không tự đóng để chờ người dùng nhấn nút
                },
            );
            break;
        default:
            toast(message, {
                position: 'top-right',
                autoClose: 2000,
            });
            break;
    }
};

export default showToast;
