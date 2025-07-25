import clsx from 'clsx';
import '@/app/components/GlobalStyles.css';

export default function Button({ children, className, variant, disabled = false, ...rest }) {
    const variantClasses = {
        auth: 'w-full h-[50px] bg-[var(--primary-color)] text-white p-5 text-[14px]',
        socialMedia:
            'w-1/3 h-[50px] py-3 pr-4 pl-8 relative border-[1px] border-solid border-[#ccc] text-white text-[14px]',
        otp: 'flex-shrink-0 rounded-[5px] text-white font-semibold p-[12px] right-[0.5px] bg-[var(--primary-color)] active:scale-100 text-[13px]',
        search: 'rounded-[15px] bg-[var(--primary-color)] text-white text-[14px] p-3 w-[10%] h-full',
        footer: 'px-6 py-3 border text-[12px] rounded-[3px] w-[40%] mt-2',
    };

    return (
        <button
            className={clsx(
                'flex justify-center items-center rounded-[6px] hover:opacity-90 shadow font-semibold cursor-pointer whitespace-nowrap transition active:scale-95 select-none',
                variantClasses[variant],
                disabled && 'hover:opacity-100',
                className,
            )}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
}
