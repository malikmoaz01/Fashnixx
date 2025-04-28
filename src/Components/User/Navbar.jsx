import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const categoryBtnRef = useRef(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Define categories with links and icons
    const categories = [
        {
            name: 'Men\'s Clothing',
            icon: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z',
            link: '/products/menswear'
        },
        {
            name: 'Women\'s Clothing',
            icon: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z',
            link: '/products/womenswear'
        },
        {
            name: 'Kid\'s Clothing',
            icon: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z',
            link: '/products/kidswear'
        },
        {
            name: 'Men\'s Shoes',
            icon: 'M19.5 14c-1.4 0-2.7.3-4 .8V11c0-1.4-1.1-2.5-2.5-2.5h-7C4.6 8.5 3.5 9.6 3.5 11v7c0 1.4 1.1 2.5 2.5 2.5h7c1.4 0 2.5-1.1 2.5-2.5v-1.2c1.3.5 2.6.8 4 .8 3.3 0 6-2.7 6-6s-2.7-6-6-6z',
            link: '/products/menshoes'
        },
        {
            name: 'Women\'s Shoes',
            icon: 'M19.5 14c-1.4 0-2.7.3-4 .8V11c0-1.4-1.1-2.5-2.5-2.5h-7C4.6 8.5 3.5 9.6 3.5 11v7c0 1.4 1.1 2.5 2.5 2.5h7c1.4 0 2.5-1.1 2.5-2.5v-1.2c1.3.5 2.6.8 4 .8 3.3 0 6-2.7 6-6s-2.7-6-6-6z',
            link: '/products/womenshoes'
        },
        {
            name: 'Accessories',
            icon: 'M17.73 12.02l3.98-3.98c.39-.39.39-1.02 0-1.4l-4.34-4.34c-.39-.39-1.02-.39-1.41 0l-3.98 3.98L8 2.29C7.8 2.1 7.55 2 7.29 2c-.25 0-.51.1-.7.29L2.25 6.63c-.39.39-.39 1.02 0 1.41l3.98 3.98L2.25 16c-.39.39-.39 1.02 0 1.41l4.34 4.34c.39.39 1.02.39 1.41 0l3.98-3.98 3.98 3.98c.2.2.45.29.71.29.26 0 .51-.1.71-.29l4.34-4.34c.39-.39.39-1.02 0-1.41l-3.99-3.98zM12 9c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-4.71 1.96L3.66 7.34l3.63-3.63 3.62 3.62-3.62 3.63zM10 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2-4l3.63 3.62-3.63 3.63-3.62-3.63 3.62-3.62z',
            link: '/products/accessories'
        }
    ];

    // Load user data and set up event listeners
    useEffect(() => {
        // Initial load of user data
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
        
        // Function to handle storage changes
        const handleStorageChange = () => {
            const updatedUser = JSON.parse(localStorage.getItem('user'));
            setUser(updatedUser);
        };
        
        // Set up event listeners for both custom events and storage events
        window.addEventListener('storageUpdated', handleStorageChange);
        window.addEventListener('storage', handleStorageChange);
        
        // Check for user data periodically (backup method)
        const intervalId = setInterval(() => {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
                setUser(currentUser);
            }
        }, 1000);
        
        // Clean up listeners and interval
        return () => {
            window.removeEventListener('storageUpdated', handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, []);

    // Handle close events
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!categoryBtnRef.current?.contains(event.target) && !dropdownRef.current?.contains(event.target)) {
                setCategoriesOpen(false);
            }
            if (!event.target.closest('.mobile-menu-button') && !event.target.closest('.mobile-menu')) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
        
        // Dispatch storage updated event
        window.dispatchEvent(new Event('storageUpdated'));
    };

    // Close categories when navigating
    const handleCategoryNavigate = () => {
        setCategoriesOpen(false);
    };

    return (
        <nav className="relative bg-blue-900 sticky top-0 z-20 w-full">
            <div className="mx-auto flex h-12 w-full max-w-[1200px] items-center justify-between px-5 md:px-10">
                <div 
                    ref={categoryBtnRef}
                    className="relative h-full"
                    onMouseEnter={() => setCategoriesOpen(true)}
                >
                    <button
                        onClick={() => setCategoriesOpen(!categoriesOpen)}
                        className="categories-button flex h-full w-32 items-center justify-center bg-pink-500 hover:bg-pink-400 transition-colors md:w-40"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-1 h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        Categories
                    </button>
                </div>
                
                <div className="hidden md:flex gap-8">
                    <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/newArrivals">New Arrivals</Link>
                    <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/">Home</Link>
                    <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/about-us">About</Link>
                    <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/contact">Contact Us</Link>
                </div>
                
                <div className="hidden md:flex gap-4">
                    {user ? (
                        <button 
                            className="font-light text-white hover:text-pink-300 hover:underline" 
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                    ) : (
                        <>
                            <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/login">Login</Link>
                            <span className="text-white">|</span>
                            <Link className="font-light text-white hover:text-pink-300 hover:underline" to="/signup">Sign Up</Link>
                        </>
                    )}
                </div>
                
                <button 
                    className="mobile-menu-button md:hidden text-white" 
                    onClick={(e) => {
                        e.stopPropagation();
                        setMobileMenuOpen(!mobileMenuOpen);
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>

            {categoriesOpen && (
                <div 
                    ref={dropdownRef}
                    className="absolute w-full left-0 z-30"
                    onMouseLeave={() => setCategoriesOpen(false)}
                >
                    <div className="w-full bg-white shadow-lg border-t border-gray-200 animate-fadeIn">
                        <div className="container mx-auto py-6 px-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                {categories.map((category, index) => (
                                    <Link
                                        key={index}
                                        to={category.link}
                                        onClick={handleCategoryNavigate}
                                        className="flex flex-col items-center p-4 rounded-lg transition-all duration-300 hover:bg-pink-50 hover:shadow-md group"
                                    >
                                        <div className="w-16 h-16 flex items-center justify-center bg-pink-100 rounded-full mb-3 group-hover:bg-pink-200 transition-colors">
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                className="h-8 w-8 text-pink-600" 
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={category.icon} />
                                            </svg>
                                        </div>
                                        <span className="text-center font-medium text-gray-700 group-hover:text-pink-600">{category.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {mobileMenuOpen && (
                <div className="mobile-menu md:hidden absolute top-12 left-0 w-full bg-blue-900 shadow-lg p-4 flex flex-col items-center text-white">
                    <Link className="py-2 hover:text-pink-300" to="/newArrivals" onClick={() => setMobileMenuOpen(false)}>New Arrivals</Link>
                    <Link className="py-2 hover:text-pink-300" to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <Link className="py-2 hover:text-pink-300" to="/about-us" onClick={() => setMobileMenuOpen(false)}>About</Link>
                    <Link className="py-2 hover:text-pink-300" to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
                    <hr className="my-2 w-full border-gray-500" />
                    {user ? (
                        <button 
                            className="py-2 hover:text-pink-300" 
                            onClick={() => {
                                handleLogout();
                                setMobileMenuOpen(false);
                            }}
                        >
                            Log Out
                        </button>
                    ) : (
                        <>
                            <Link className="py-2 hover:text-pink-300" to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                            <Link className="py-2 hover:text-pink-300" to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;