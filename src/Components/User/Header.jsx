// import { useState } from 'react';
// import Logo from '../../assets/Logo.png';

// const Header = () => {
//     return (
//         <div>
//             <header className="sticky top-0 z-10 mx-auto w-full flex h-16 max-w-[1200px] items-center justify-between px-5 bg-white md:px-10">
//                 <a href="#">
//                     <img className="cursor-pointer h-[40px] w-auto ml-2 md:ml-24" src={Logo} alt="company logo" />
//                 </a>

//                 {/* Responsive Search Bar */}
//                 <form className="hidden md:flex h-9 w-2/5 items-center border rounded-full px-2">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-2 h-5 w-5">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
//                     </svg>
//                     <input className="w-full outline-none text-sm px-2 py-1" type="search" placeholder="Search" />
//                     <button className="ml-2 px-3 py-1 bg-blue-900 text-white rounded-full hover:bg-black text-sm">Go</button>
//                 </form>

//                 {/* Cart & Account Icons - Always Visible */}
//                 <div className="flex gap-3 items-center">
//                     <a href="/cart" className="flex cursor-pointer flex-col items-center justify-center">
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
//                             <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" />
//                         </svg>
//                         <p className="text-xs">Cart</p>
//                     </a>
//                     <a href="/account" className="relative flex cursor-pointer flex-col items-center justify-center">
//                         <span className="absolute bottom-[33px] right-1 flex h-2 w-2">
//                             <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
//                             <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
//                         </span>
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
//                         </svg>
//                         <p className="text-xs">Account</p>
//                     </a>
//                 </div>
//             </header>

//             {/* Mobile Search Bar */}
//             <div className="md:hidden px-4 mt-2">
//                 <form className="flex h-9 items-center border rounded-full px-2">
//                     <input className="w-full outline-none text-sm px-2 py-1" type="search" placeholder="Search" />
//                     <button className="ml-2 px-3 py-1 bg-blue-900 text-white rounded-full hover:bg-black text-sm">Go</button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Header;

import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";

const Header = ({ user }) => {
  return (
    <div>
      <header className="sticky top-0 z-10 mx-auto w-full flex h-16 max-w-[1200px] items-center justify-between px-5 bg-white md:px-10">
        {/* Logo */}
        <Link to="/">
          <img
            className="cursor-pointer h-[40px] w-auto ml-2 md:ml-24"
            src={Logo}
            alt="company logo"
          />
        </Link>

        {/* Responsive Search Bar */}
        <form className="hidden md:flex h-9 w-2/5 items-center border rounded-full px-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="mx-2 h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            className="w-full outline-none text-sm px-2 py-1"
            type="search"
            placeholder="Search"
          />
          <button className="ml-2 px-3 py-1 bg-blue-900 text-white rounded-full hover:bg-black text-sm">
            Go
          </button>
        </form>

        {/* Cart & Account Icons */}
        <div className="flex gap-3 items-center">
          {/* Cart */}
          <Link
            to="/cart"
            className="flex cursor-pointer flex-col items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs">Cart</p>
          </Link>

          {/* Account */}
          <Link
            to="/account"
            className="relative flex cursor-pointer flex-col items-center justify-center"
          >
            {/* Ping Notification Example */}
            {user && (
              <span className="absolute bottom-[33px] right-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
              </span>
            )}

            {/* Profile Image If User Logged In */}
            {user ? (
              <img
                src={user.image || "https://via.placeholder.com/150"} // fallback image if user.image is missing
                alt="User"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              // Default icon if no user is logged in
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
            )}

            <p className="text-xs">Account</p>
          </Link>
        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 mt-2">
        <form className="flex h-9 items-center border rounded-full px-2">
          <input
            className="w-full outline-none text-sm px-2 py-1"
            type="search"
            placeholder="Search"
          />
          <button className="ml-2 px-3 py-1 bg-blue-900 text-white rounded-full hover:bg-black text-sm">
            Go
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;
