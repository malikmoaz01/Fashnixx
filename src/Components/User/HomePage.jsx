import { useState } from 'react';
import Logo from '../../assets/Logo.png';
import { Link } from "react-router-dom";

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div>
            {/* Header Section */}
            <header className="mx-auto w-full flex h-16 max-w-[1200px] items-center justify-between px-5">
                <a href="#">
                    <img
                        className="cursor-pointer h-[55px] w-auto ml-24"
                        src={Logo}
                        alt="company logo"
                    />
                </a>

                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-8 w-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>
                </div>

                <form className="hidden h-9 w-2/5 items-center border rounded-full md:flex">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="mx-3 h-4 w-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                    </svg>

                    <input
                        className="hidden w-11/12 outline-none md:block"
                        type="search"
                        placeholder="Search"
                    />

                    <button className="ml-3 h-full bg-blue-900 px-4 hover:bg-black text-white rounded-full">
                        Search
                    </button>
                </form>

                <div className="hidden gap-3 md:!flex">
                    <a href="#" className="flex cursor-pointer flex-col items-center justify-center">
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
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                        </svg>
                        <p className="text-xs">Cart</p>
                    </a>

                    <a href="#" className="relative flex cursor-pointer flex-col items-center justify-center">
                        <span className="absolute bottom-[33px] right-1 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                        </span>

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
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                            />
                        </svg>

                        <p className="text-xs">Account</p>
                    </a>
                </div>
            </header>

            {/* Navbar Section */}
            <nav className="relative bg-blue-900">
                <div className="mx-auto hidden h-12 w-full max-w-[1200px] items-center md:flex">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="ml-5 flex h-full w-40 cursor-pointer items-center justify-center bg-pink-500 hover:bg-pink-300"
                    >
                        <div className="flex justify-around" href="#">
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
                        <a
                            className="font-light text-white relative inline-block duration-300 hover:text-pink-500 hover:underline group"
                            href="#"
                        >
                            New Arrivals
                            <span
                                className="absolute inset-0 h-[120%] w-[110%] border border-white rounded-full animate-pulse"
                                style={{
                                    top: '5%',
                                    bottom: '5%',
                                    left: '-5%',
                                }}
                            ></span>
                        </a>


                        <a
                            className="font-light text-white duration-100 hover:text-pink-300 hover:underline"
                            href="catalog.html"
                        >
                            Home
                        </a>
                        <a
                            className="font-light text-white duration-100 hover:text-pink-300 hover:underline"
                            href="about-us.html"
                        >
                            About Us
                        </a>
                        <a
                            className="font-light text-white duration-100 hover:text-pink-300 hover:underline"
                            href="contact-us.html"
                        >
                            Catalogue
                        </a>
                        <a
                            className="font-light text-white duration-100 hover:text-pink-300 hover:underline"
                            href="contact-us.html"
                        >
                            Contact Us
                        </a>
                    </div>

                    <div className="ml-auto flex gap-4 px-5">
                    <a
                            className="font-light text-white duration-100 hover:text-pink-300 hover:underline"
                        >
                            <Link to="/login">Login</Link>
                        </a>

                        <span className="text-white">&#124;</span>

                        <a
                            className="font-light text-white duration-100 hover:text-pink-300 hover:underline"
                        >
                            <Link to="/signup">Sign Up</Link>
                        </a>
                    </div>
                </div>
            </nav>

        </div>
    );
};

export default Header;
