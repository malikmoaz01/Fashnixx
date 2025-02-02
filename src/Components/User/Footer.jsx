import React from 'react';
import Image from '../../assets/Logo.png';
import {
	FaWhatsapp,
	FaFacebook,
	FaInstagram,
	FaLinkedin,
	FaLocationArrow,
	FaMobileAlt,
} from 'react-icons/fa';
import Banner from '../../assets/img9.jpg';

const BannerImg = {
	backgroundImage: `url(${Banner})`,
	backgroundPosition: 'bottom',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover',
	width: '100%',
};

const Footer = () => {
	const address = 'Pu Hostel 17, Lahore, Pakistan';
	const phoneNumbers = [
		'+923055865381',
		'+923144977341',
		'+923357134173',
	];

	// Categories section
	const categories = [
		{ label: "Men's T-Shirts", path: '/menswear/tshirts' },
		{ label: "Women's Dresses", path: '/womenswear/dresses' },
		{ label: "Kids Wear", path: '/kidswear/dresses' },
		{ label: "Men's Jackets", path: '/menswear/jackets' },
		{ label: "Women's Tops", path: '/womenswear/tops' },
		{ label: "Accessories", path: '/accessories/bags' },
	];

	return (
		<div style={BannerImg} className="text-white">
			<div className="container py-10">
				<div className="grid md:grid-cols-3 items-center justify-center">
					{/* Logo and Description */}
					<div className="sm:ml-10 ml-4 sm:mr-0 mr-3 flex flex-col justify-center">
						<img
							src={Image}
							alt="Logo"
							className="w-32 h-32 object-contain"
						/>
						<p className="mt-4 text-gray-300">
							We are committed to providing the best shopping experience for our customers. 
							Explore our wide range of products across various categories, and enjoy seamless 
							shopping with secure payment options, fast delivery, and exceptional customer service. 
							Join us today for a rewarding shopping journey!
						</p>
					</div>

					{/* Categories Section */}
					<div className="py-14 sm:ml-14 ml-4">
						<h1 className="sm:text-3xl text-2xl font-bold text-left mb-3">
							Shop By Categories
						</h1>
						<div className="flex flex-col gap-3 text-center sm:text-left">
							{categories.map((category, index) => (
								<a
									href={category.path}
									key={index}
									className="text-left text-xl text-gray-200 hover:text-white"
								>
									{category.label}
								</a>
							))}
						</div>
					</div>

					{/* Contact and Social Links */}
					<div className="sm:ml-0 ml-[-200px] flex flex-col items-center gap-4">
						{/* Social Links */}
						<div className="flex items-center gap-3 mb-6 justify-center">
							<a href="http://www.whatsapp.com/03055865381" className="text-gray-300 hover:text-white">
								<FaWhatsapp className="text-3xl" />
							</a>
							<a href="http://www.facebook.com/mlkmoaz01" className="text-gray-300 hover:text-white">
								<FaFacebook className="text-3xl" />
							</a>
							<a href="http://www.instagram.com/mlk_moaz_01.py" className="text-gray-300 hover:text-white">
								<FaInstagram className="text-3xl" />
							</a>
							<a href="http://www.linkedin.com/in/malik-moaz-735911247" className="text-gray-300 hover:text-white">
								<FaLinkedin className="text-3xl" />
							</a>
						</div>

						{/* Contact Numbers and Location */}
						<div className="flex flex-col gap-3 text-center">
							<p className="flex items-center gap-3 mb-3 justify-center text-xl text-gray-200">
								<FaLocationArrow />
								{address}
							</p>
							{phoneNumbers.map((number, index) => (
								<p key={index} className="flex items-center gap-3 mb-3 justify-center text-xl text-gray-200">
									<FaMobileAlt />
									{number}
								</p>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
