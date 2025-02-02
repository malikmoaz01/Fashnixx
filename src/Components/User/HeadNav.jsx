import { useState, useEffect } from 'react';
import Logo from '../../assets/Logo.png';
import { Link } from 'react-router-dom';

const HeaderNavbar = () => {
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <div
            className={`sticky top-0 z-10 w-full bg-white shadow transition-transform duration-300 ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            {/* Header Section */}
            <header className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5">
                <a href="#">
                    <img
                        className="cursor-pointer h-[55px] w-auto"
                        src={Logo}
                        alt="company logo"
                    />
                </a>

                <div className="hidden md:flex gap-4">
                    <Link className="text-gray-700 hover:underline" to="/">
                        Home
                    </Link>
                    <Link className="text-gray-700 hover:underline" to="/about-us">
                        About
                    </Link>
                    <Link className="text-gray-700 hover:underline" to="/contact-us">
                        Contact
                    </Link>
                </div>
            </header>

            {/* Navbar Section */}
            <nav className="bg-blue-900">
                <div className="mx-auto flex h-12 max-w-[1200px] items-center">
                    <button className="ml-5 flex h-full w-40 items-center justify-center bg-pink-500 hover:bg-pink-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                        Categories
                    </button>

                    <div className="mx-7 flex gap-8">
                        <Link className="text-white hover:text-pink-300" to="/newArrivals">
                            New Arrivals
                        </Link>
                        <Link className="text-white hover:text-pink-300" to="/">
                            Home
                        </Link>
                        <Link className="text-white hover:text-pink-300" to="/about-us">
                            About
                        </Link>
                        <Link className="text-white hover:text-pink-300" to="/contact-us">
                            Contact Us
                        </Link>
                    </div>

                    <div className="ml-auto flex gap-4 px-5">
                        <Link className="text-white hover:text-pink-300" to="/login">
                            Login
                        </Link>
                        <span className="text-white">&#124;</span>
                        <Link className="text-white hover:text-pink-300" to="/signup">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default HeaderNavbar;
