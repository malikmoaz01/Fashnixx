import React, { useState, useEffect } from 'react';
import AboutPic from '../../assets/About.jpg';
import TeamLeader from '../../assets/TeamLeader.jpg';  // Corrected image import
import Footer from './Footer' 
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* About Image Section */}
        <div className="flex justify-center mb-8 md:mb-0">
          <img
            src={AboutPic}
            alt="About Image"
            className="w-82 h-68 object-cover shadow-lg"
          />
        </div>

        {/* Text Section */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Our Story</h2>
          <p className="text-lg text-gray-600">
            Welcome to <strong>Ecom</strong>, an e-commerce clothing & accessories brand born from a simple idea: to provide stylish, comfortable, and high-quality clothing and accessories for everyone. Our journey started with a passion for fashion and a commitment to delivering the latest trends to your doorstep. We aim to offer a diverse range of products that cater to all tastes and preferences. Our mission is simple: to make fashion accessible and enjoyable for all.
          </p>
        </div>
      </div>
      

      {/* Our Achievement Page */}
      <div className="py-12  rounded-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700">Our Achievements</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4">
            <h3 className="text-4xl font-extrabold text-blue-700">{experience}</h3>
            <p className="text-lg font-medium text-gray-700">Years of Experience</p>
          </div>
          <div className="p-4">
            <h3 className="text-4xl font-extrabold text-blue-700">{clients}+</h3>
            <p className="text-lg font-medium text-gray-700">Happy Customers</p>
          </div>
          <div className="p-4">
            <h3 className="text-4xl font-extrabold text-blue-700">{projects}+</h3>
            <p className="text-lg font-medium text-gray-700">Products Delivered</p>
          </div>
          <div className="p-4">
            <h3 className="text-4xl font-extrabold text-blue-700">{delivery}+</h3>
            <p className="text-lg font-medium text-gray-700">On-time Deliveries</p>
          </div>
        </div>
      </div>

      {/* Team Leader Section */}
      <div className="bg-blue-50 p-8 rounded-lg shadow-lg border-l-4 border-blue-800 my-16">
        <div className="flex items-center gap-10">
          {/* Team Leader Image */}
          <div>
            <img
              src={TeamLeader}
              alt="Team Leader"
              className="w-48 h-48 rounded-lg shadow-lg object-cover"
            />
          </div>
          {/* Team Leader Text */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800">Malik Moaz || Team Lead</h3>
            <p className="text-xl text-gray-600 mb-4">Full Stack Developer</p>
            <p className="text-gray-500">
              Malik Moaz is the visionary behind Ecom. He leads the company with a passion for fashion, ensuring that our products meet the highest standards and customer satisfaction is always at the forefront.
            </p>
          </div>
        </div>
      </div>

      {/* Meet Our Team Section */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {/* Team Members */}
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="bg-white p-6 border-4 shadow-lg">
              <img
                src={TeamLeader}
                alt={`Team Member ${index + 1}`}
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold text-gray-800">Malik Moaz</h4>
              <p className="text-gray-600">Full Stack Developer</p>
              <p className="text-gray-500 mt-2">
                Malik Moaz works relentlessly to ensure that the platform's technology and user experience are top-notch.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Section */}
      
    </div>
    
  );
};

export default About;
