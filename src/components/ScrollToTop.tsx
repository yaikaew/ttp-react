import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // สั่งให้เลื่อนขึ้นบนสุดแบบทันที (instant) 
        // หรือใช้ behavior: 'smooth' ถ้าอยากให้เห็นการเลื่อน
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
    }, [pathname]); // ทำงานทุกครั้งที่ pathname (URL) เปลี่ยน

    return null;
};

export default ScrollToTop;