import React from "react";
import { Shield, Lock, Eye, Database, CheckCircle, Users, Globe, Zap } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { FaShieldAlt} from "react-icons/fa";
const About = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Advanced Security Scanning",
      description: "Check against millions of breached records from verified sources worldwide."
    },
    {
      icon: <Lock className="w-8 h-8 text-green-600" />,
      title: "Privacy Protected",
      description: "We never store your emails or passwords. Everything is checked securely and anonymously."
    },
    {
      icon: <Eye className="w-8 h-8 text-purple-600" />,
      title: "Real-time Monitoring",
      description: "Get instant alerts when your email appears in new data breaches."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Lightning Fast",
      description: "Get results in seconds with our optimized breach detection algorithms."
    }
  ];

  const stats = [
    { number: "10B+", label: "Breached Records Monitored" },
    { number: "50K+", label: "Data Breaches Tracked" },
    { number: "1M+", label: "Users Protected" },
    { number: "99.9%", label: "Uptime Guaranteed" }
  ];

  const faqs = [
    {
      question: "How does E-Guard check for breaches?",
      answer: "E-Guard uses secure hashing techniques to check your email against our comprehensive database of known data breaches. We never store or see your actual email address during the process."
    },
    {
      question: "Is my data safe with E-Guard?",
      answer: "Absolutely. We never store your personal data. All checks are performed using secure, one-way hashing that protects your privacy while allowing us to detect if your information has been compromised."
    },
    {
      question: "How often is your breach database updated?",
      answer: "Our database is updated continuously as new breaches are discovered and verified. We monitor thousands of sources daily to ensure you get the most up-to-date breach information."
    },
    {
      question: "What should I do if my email is found in a breach?",
      answer: "If your email is compromised, change your passwords immediately, enable two-factor authentication where possible, and monitor your accounts for suspicious activity. Consider using unique passwords for each service."
    },
    {
      question: "Is E-Guard really free to use?",
      answer: "Yes! Basic email breach checking is completely free. We also offer premium features for users who want advanced monitoring and instant alerts."
    },
    {
      question: "How do you verify data breaches?",
      answer: "We work with security researchers, verify breach authenticity through multiple sources, and only include confirmed breaches in our database. This ensures accurate and reliable results."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <FaShieldAlt className="w-16 h-16 text-cyan-400 mr-4" />
              <h1 className="text-5xl font-bold text-gray-900">About E-Guard</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Your trusted partner in digital security. We help protect millions of users 
              by monitoring data breaches and providing instant security insights.
            </p>
            
          </div>

          {/* Mission */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-xl mb-16 p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              At E-Guard, we believe everyone deserves to know if their personal information 
              has been compromised. Our mission is to democratize cybersecurity by providing 
              free, easy-to-use tools that help individuals protect their digital identities 
              and make informed security decisions.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="rounded-xl shadow-lg text-center bg-white p-6">
                <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose E-Guard?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="rounded-xl shadow-lg bg-white p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-gray-50 rounded-full">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How it Works */}
          <div className="rounded-xl shadow-xl mb-16 bg-white p-8">
            <h2 className="text-3xl font-bold text-center mb-12">How E-Guard Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Secure Scanning</h3>
                <p className="text-gray-600">
                  Enter your email and we securely check it against our database of known breaches 
                  without storing your information.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Instant Results</h3>
                <p className="text-gray-600">
                  Get immediate results showing if your email has been found in any data breaches 
                  and what information was exposed.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Take Action</h3>
                <p className="text-gray-600">
                  Follow our security recommendations to protect your accounts and sign up for 
                  ongoing monitoring to stay safe.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
            <div className="rounded-xl shadow-xl bg-white p-8">
              {faqs.map((faq, index) => (
                <details key={index} className="mb-4 border-b border-gray-200 pb-4">
                  <summary className="cursor-pointer font-semibold text-gray-900 hover:text-cyan-400">
                    {faq.question}
                  </summary>
                  <p className="text-gray-600 leading-relaxed pt-2">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Trust & Security */}
          <div className="rounded-xl shadow-xl bg-gradient-to-r from-green-50 to-blue-50 p-8 text-center">
            <Globe className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Built with Trust & Security</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy First</h3>
                <p className="text-gray-600">
                  We use advanced cryptographic techniques to protect your data. Your information 
                  is never stored, logged, or shared with third parties.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Sources</h3>
                <p className="text-gray-600">
                  Our breach database comes from verified security researchers, law enforcement, 
                  and reputable cybersecurity organizations worldwide.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Open Source</h3>
                <p className="text-gray-600">
                  Key components of our security infrastructure are open source, allowing the 
                  security community to audit and verify our practices.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Regular Audits</h3>
                <p className="text-gray-600">
                  We undergo regular security audits by independent third parties to ensure 
                  our systems meet the highest security standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
