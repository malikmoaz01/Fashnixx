import React, { useState, useEffect } from 'react';
import AboutPic from '../../assets/about.png';
import TeamLeader from '../../assets/TeamLeader.jpg';

const About = () => {
  const [clients, setClients] = useState(0);
  const [projects, setProjects] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [experience, setExperience] = useState(0);

  useEffect(() => {
    animateNumber(setClients, 1370);
    animateNumber(setProjects, 5490);
    animateNumber(setDelivery, 100);
    animateNumber(setExperience, 12);
  }, []);

  const animateNumber = (setter, target) => {
    let count = 0;
    const interval = setInterval(() => {
      count += Math.ceil(target / 100);
      if (count >= target) {
        count = target;
        clearInterval(interval);
      }
      setter(count);
    }, 30);
  };

  return (
    <div className="bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-pink-800 mb-4">About Fashniz</h1>
          <p className="text-xl text-pink-600 max-w-3xl mx-auto">
            Where Style Meets Comfort - Your Premier Fashion Destination
          </p>
        </div>

        {/* Our Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center my-20">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-extrabold text-pink-800 mb-6 relative">
              Our Story
              <span className="absolute bottom-0 left-0 w-20 h-1 bg-pink-400"></span>
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Welcome to <span className="font-bold text-pink-600">Fashniz</span>, an e-commerce clothing & accessories brand born from a simple idea: to provide stylish, comfortable, and high-quality fashion for everyone who appreciates beauty and elegance.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our journey started with a passion for fashion and a commitment to delivering the latest trends right to your doorstep. We curate diverse collections that cater to all tastes and preferences, making fashion accessible and enjoyable for all.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-200 rounded-lg transform translate-x-4 translate-y-4"></div>
              <img
                src={AboutPic}
                alt="About Fashniz"
                className="relative z-10 w-full h-96 object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-700 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold">Our Achievements</h2>
            <div className="w-24 h-1 bg-white mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg text-center transform hover:scale-105 transition-all">
              <h3 className="text-5xl font-extrabold mb-2">{experience}</h3>
              <p className="text-xl">Years of Experience</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg text-center transform hover:scale-105 transition-all">
              <h3 className="text-5xl font-extrabold mb-2">{clients}+</h3>
              <p className="text-xl">Happy Customers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg text-center transform hover:scale-105 transition-all">
              <h3 className="text-5xl font-extrabold mb-2">{projects}+</h3>
              <p className="text-xl">Products Delivered</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg text-center transform hover:scale-105 transition-all">
              <h3 className="text-5xl font-extrabold mb-2">{delivery}%</h3>
              <p className="text-xl">On-time Deliveries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Leader Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-pink-100 to-pink-200 p-8 rounded-xl shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative w-64 h-64 flex-shrink-0">
              <div className="absolute inset-0 bg-pink-500 rounded-full transform translate-x-3 translate-y-3"></div>
              <img
                src={TeamLeader}
                alt="Team Leader"
                className="relative z-10 w-full h-full rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-pink-800 mb-2">Malik Moaz | Team Lead</h3>
              <p className="text-xl text-pink-600 mb-4">Full Stack Developer</p>
              <div className="w-16 h-1 bg-pink-500 mb-6"></div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Malik Moaz is the visionary behind Fashniz. With a keen eye for design and innovation, he leads the company with passion and purpose. Under his guidance, Fashniz has flourished into a beloved fashion destination, ensuring that our products meet the highest standards and customer satisfaction remains our top priority.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-pink-800">Meet Our Amazing Team</h2>
            <div className="w-32 h-1 bg-pink-500 mx-auto mt-4 mb-8"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Our dedicated professionals work tirelessly to bring you the best fashion experience possible
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-xl overflow-hidden shadow-xl transform transition-all group-hover:scale-105">
                  <div className="bg-gradient-to-r from-pink-400 to-pink-600 h-12"></div>
                  <div className="relative -mt-8 flex justify-center">
                    <img
                      src={TeamLeader}
                      alt={`Team Member ${index + 1}`}
                      className="w-32 h-32 rounded-full border-4 border-white object-cover"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h4 className="text-2xl font-semibold text-pink-800 mb-2">Malik Moaz</h4>
                    <p className="text-pink-600 mb-4">Full Stack Developer</p>
                    <p className="text-gray-600">
                      Malik Moaz works relentlessly to ensure that the platform's technology and user experience are top-notch, creating seamless shopping journeys for our customers.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-pink-800 mb-6 relative">
              Our Mission
              <span className="absolute bottom-0 left-0 w-20 h-1 bg-pink-400"></span>
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At Fashniz, we're committed to transforming how people experience fashion. We believe that style should be accessible to everyone, regardless of budget or background.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our mission extends beyond selling clothes—we're building a community of fashion enthusiasts who value quality, sustainability, and self-expression through personal style.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-pink-100 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-pink-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your fashion favorites delivered quickly and reliably</p>
            </div>
            <div className="bg-pink-100 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-pink-800 mb-2">Quality Assurance</h3>
              <p className="text-gray-600">Premium products that meet the highest standards</p>
            </div>
            <div className="bg-pink-100 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-pink-800 mb-2">Best Prices</h3>
              <p className="text-gray-600">Affordable fashion without compromising on quality</p>
            </div>
            <div className="bg-pink-100 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-pink-800 mb-2">Customer Support</h3>
              <p className="text-gray-600">24/7 assistance for all your fashion needs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;