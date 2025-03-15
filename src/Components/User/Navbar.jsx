import { useState } from 'react';
import CategoriesDropdown from './CategoriesDropdown';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="relative bg-blue-900 sticky top-0 z-20 w-full">
            <div className="mx-auto flex h-12 w-full max-w-[1200px] items-center justify-between px-5 md:px-10">
                <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="flex h-full w-32 items-center justify-center bg-pink-500 hover:bg-pink-300 md:w-40"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="mx-1 h-6 w-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    Categories
                </button>
                
                <div className="hidden md:flex gap-8">
                    <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/newArrivals">
                        New Arrivals
                    </Link>
                    <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/">
                        Home
                    </Link>
                    <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/about-us">
                        About
                    </Link>
                    <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/contact">
                        Contact Us
                    </Link>
                </div>
                
                <div className="hidden md:flex gap-4">
                    <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/login">
                        Login
                    </Link>
                    <span className="text-white">|</span>
                    <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/signup">
                        Sign Up
                    </Link>
                </div>
                
                <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-8 w-8"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>
            
            {categoriesOpen && <CategoriesDropdown />}
            
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-12 left-0 w-full bg-blue-900 shadow-lg p-4 flex flex-col items-center text-white">
                    <Link className="py-2 hover:text-pink-300" to="/newArrivals">New Arrivals</Link>
                    <Link className="py-2 hover:text-pink-300" to="/">Home</Link>
                    <Link className="py-2 hover:text-pink-300" to="/about-us">About</Link>
                    <Link className="py-2 hover:text-pink-300" to="/contact">Contact Us</Link>
                    <hr className="my-2 w-full border-gray-500" />
                    <Link className="py-2 hover:text-pink-300" to="/login">Login</Link>
                    <Link className="py-2 hover:text-pink-300" to="/signup">Sign Up</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;