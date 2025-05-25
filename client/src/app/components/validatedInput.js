export default function validateField(field, value, formData = undefined, context = undefined) {
    if (!value && field !== 'confirmPassword') {
        return `Please enter your ${field}.`;
    }
    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Invalid email!';
    }
    if (field === 'username') {
        const words = value.trim().split(/\s+/).filter(Boolean);
        if (words.length < 2) {
            return 'Username must contain at least 2 words.';
        }
        if (words.some((word) => word.length < 2)) {
            return 'Each word in username must have at least 2 letters.';
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
            return 'Username must only contain letters and spaces.';
        }
    }
    if (field === 'password' && (context === 'register' || context === 'forgotPassword')) {
        if (value.length < 6) {
            return 'Password must be at least 6 characters.';
        }
        if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
            return 'Password must contain both letters and numbers.';
        }
        if (!/[A-Z]/.test(value)) {
            return 'Password must contain at least one uppercase letter.';
        }
    }
    if (field === 'confirmPassword' && value !== formData.get('password')) {
        return ' ';
    }
    return '';
}
