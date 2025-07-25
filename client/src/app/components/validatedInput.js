export default function validateField(field, value, formData = undefined, context = undefined) {
    if (!value && field !== 'confirmPassword') {
        return `Xin hãy điền ${field}.`;
    }
    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Email không hợp lệ!';
    }
    if (field === 'username') {
        const words = value.trim().split(/\s+/).filter(Boolean);
        if (words.length < 2) {
            return 'Tên đăng nhập chứa ít nhất 2 từ.';
        }
        if (words.some((word) => word.length < 2)) {
            return 'Mỗi từ trong tên đăng nhập phải có ít nhất 2 ký tự.';
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
            return 'Tên đăng nhập chỉ chứa chữ cái và khoảng trắng.';
        }
    }
    if (field === 'password' && (context === 'register' || context === 'forgotPassword')) {
        if (value.length < 6) {
            return 'Mật khẩu phải có ít nhất 6 ký tự.';
        }
        if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
            return 'Mật khẩu phải chứa ít nhất một chữ cái và một số.';
        }
        if (!/[A-Z]/.test(value)) {
            return 'Mật khẩu phải chứa ít nhất một chữ hoa.';
        }
    }
    if (field === 'confirmPassword' && value !== formData.get('password')) {
        return ' ';
    }
    return '';
}
