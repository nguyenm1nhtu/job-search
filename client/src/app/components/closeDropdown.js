import { useRef, useEffect } from 'react';

const useClickOutside = (callback) => {
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [callback]);

    return ref;
};

const useMouseLeaveDropdown = (callback) => {
    const ref = useRef(null);

    useEffect(() => {
        const handleMouseLeave = (event) => {
            if (ref.current && (!event.relatedTarget || !ref.current.contains(event.relatedTarget))) {
                callback();
            }
        };

        if (ref.current) {
            ref.current.addEventListener('mouseleave', handleMouseLeave);
            return () => {
                if (ref.current) {
                    ref.current.removeEventListener('mouseleave', handleMouseLeave);
                }
            };
        }
    }, [callback]);

    return ref;
};

export { useClickOutside, useMouseLeaveDropdown };
