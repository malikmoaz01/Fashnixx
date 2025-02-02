import { useState } from 'react';
import CategoriesDropdown from './CategoriesDropdown';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    return (
        <nav className="relative bg-blue-900 sticky top-0 z-20">
            <div className="mx-auto hidden h-12 w-full max-w-[1200px] items-center md:flex">
                <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="ml-5 flex h-full w-40 cursor-pointer items-center justify-center bg-pink-500 hover:bg-pink-300"
                >
                    <div className="flex justify-around">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="mx-1 h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                        Categories
                    </div>
                </button>

                <div className="mx-7 flex gap-8">
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

                <div className="ml-auto flex gap-4 px-5">
                    <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/login">
                        Login
                    </Link>
                    <span className="text-white">&#124;</span>
                    <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/signup">
                        Sign Up
                    </Link>
                </div>
            </div>

            {categoriesOpen && <CategoriesDropdown />}
        </nav>
    );
};

export default Navbar;
