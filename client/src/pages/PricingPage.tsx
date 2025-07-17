import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react'; // Changed icons for waitlist CTA

export const PricingPage: React.FC = () => {
  // Removed the 'plans' array as pricing models are no longer displayed

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">
            <span className="text-red-600">Tube</span><span className="text-gray-800">Course</span> Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're building the best experience for creators. Our pricing plans are coming soon!
          </p>
        </div>

        {/* Coming Soon / Join Waitlist Section */}
        {/* <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-red-500 p-8 md:p-12 max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Join Our Waitlist!</h3>
          <p className="text-gray-700 mb-8 leading-relaxed">
            Be the first to know when our premium features and pricing plans are launched. Get exclusive early bird offers and updates!
          </p>
          <Link
            to="/contact" // Assuming you'll have a contact or waitlist signup page
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span>Join the Waitlist</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div> */}
      </div>
    </div>
  );
};
