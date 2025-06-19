import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Github, Twitter, Phone, Calendar } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '', // Added lastName to initial state
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const {setUser} = useContext(UserContext);

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
        try {
            const response = await axios.post(`http://localhost:5000/signup`, {
                name: `${formData.name} ${formData.lastName}`,
                email: formData.email,
                password: formData.password,
            },{withCredentials: true});
       
            setUser(response.data.user);
            console.log('Signup successful:', response.data);
            toast.success('Signup successful!');
            navigate('/login'); 
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error('Signup failed: ' + error.response.data.error);
            } else {
                console.error('Signup error:', error);
                toast.error('Signup failed. Please try again.');
            }
        }
    } else {
        setErrors(newErrors);
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`${provider} signup clicked`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{
            animation: 'float1 18s ease-in-out infinite'
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{
            animation: 'float2 22s ease-in-out infinite'
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"
          style={{
            animation: 'float3 28s ease-in-out infinite'
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 relative hover:scale-105 transition-transform duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-white/70">
              Join us today and get started
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                      errors.name 
                        ? 'border-red-400 focus:ring-red-500' 
                        : 'border-white/20 focus:ring-purple-500'
                    }`}
                    placeholder="First Name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-300">{errors.name}</p>
                  )}
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-3 border rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                      errors.lastName 
                        ? 'border-red-400 focus:ring-red-500' 
                        : 'border-white/20 focus:ring-purple-500'
                    }`}
                    placeholder="Last Name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-300">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/50" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    errors.email 
                      ? 'border-red-400 focus:ring-red-500' 
                      : 'border-white/20 focus:ring-purple-500'
                  }`}
                  placeholder="Email Address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-300">{errors.email}</p>
                )}
              </div>

              {/* Phone and Date of Birth */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Phone Number"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-white/50" />
                  </div>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/50" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    errors.password 
                      ? 'border-red-400 focus:ring-red-500' 
                      : 'border-white/20 focus:ring-purple-500'
                  }`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-white/50 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-white/50 hover:text-white transition-colors" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-300">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/50" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    errors.confirmPassword 
                      ? 'border-red-400 focus:ring-red-500' 
                      : 'border-white/20 focus:ring-purple-500'
                  }`}
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-white/50 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-white/50 hover:text-white transition-colors" />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-300">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and conditions */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 mt-0.5 text-purple-600 focus:ring-purple-500 border-white/20 rounded bg-white/10"
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-white/70">
                    I agree to the{' '}
                    <a href="#" className="text-white hover:text-purple-300 transition-colors underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-white hover:text-purple-300 transition-colors underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-300">{errors.agreeToTerms}</p>
                )}
                
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeToMarketing"
                    name="agreeToMarketing"
                    checked={formData.agreeToMarketing}
                    onChange={handleInputChange}
                    className="h-4 w-4 mt-0.5 text-purple-600 focus:ring-purple-500 border-white/20 rounded bg-white/10"
                  />
                  <label htmlFor="agreeToMarketing" className="ml-2 block text-sm text-white/70">
                    I want to receive promotional emails and updates
                  </label>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Create Account
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/70">Or sign up with</span>
              </div>
            </div>
          </div>

          {/* Social signup buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialSignup('GitHub')}
              className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Github className="h-5 w-5" />
              <span className="ml-2 text-sm">GitHub</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignup('Twitter')}
              className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Twitter className="h-5 w-5" />
              <span className="ml-2 text-sm">Twitter</span>
            </button>
          </div>

          {/* Sign in link */}
          <div className="mt-8 text-center">
            <p className="text-white/70">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-white hover:text-purple-300 transition-colors underline font-semibold"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Custom keyframes for animations */}
      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-100px, 100px) rotate(120deg); }
          66% { transform: translate(50px, -50px) rotate(240deg); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(100px, -100px) rotate(180deg); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          33% { transform: translate(-50%, -50%) translate(50px, -50px) scale(1.1) rotate(120deg); }
          66% { transform: translate(-50%, -50%) translate(-30px, 30px) scale(0.9) rotate(240deg); }
        }
      `}</style>
    </div>
  );
};

export default Signup;