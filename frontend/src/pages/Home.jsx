import React, { useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Hero from "../components/Hero"; 
import AnimatedBackground from "../components/AnimatedBackground";
import {FaLock,FaEye ,FaCheckCircle}from "react-icons/fa"
const Home = () => {
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <Hero/>
     

          

  {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-2xl shadow-md bg-slate-50 hover:shadow-lg transition">
            <FaLock className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your data is never stored. We only check breach records safely.
            </p>
          </div>
          <div className="p-6 rounded-2xl shadow-md bg-slate-50 hover:shadow-lg transition">
            <FaEye className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-Time Monitoring</h3>
            <p className="text-gray-600">
              Instantly know if your email appears in new breaches.
            </p>
          </div>
          <div className="p-6 rounded-2xl shadow-md bg-slate-50 hover:shadow-lg transition">
            <FaCheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Trusted Results</h3>
            <p className="text-gray-600">
              Data sourced from reliable and verified breach reports.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;