import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
<section className="w-full min-h-screen pt-8 pb-16 sm:pb-20 md:pb-24 bg-gray-950">      {/* Layout - Centered container with max-width */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto max-w-3xl">
        {/* Typography - Large heading + Animations */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white mb-3 sm:mb-4 md:mb-6 animate-fade-in-down">
          Get In Touch
        </h2>
        
        {/* Typography - Centered description */}
        <p className="text-center text-sm sm:text-base md:text-lg text-gray-400 mb-8 sm:mb-10 md:mb-12 lg:mb-16 animate-fade-in delay-100">
          Have a project in mind? Let's work together!
        </p>
        
        {/* Animations - Slide in success message + Colors - Green with opacity + Borders */}
        {isSubmitted && (
          <div className="mb-6 p-3 sm:p-4 bg-green-500/20 border-2 border-green-500/50 text-green-300 rounded-lg text-sm sm:text-base animate-slide-in-down">
            ✓ Thank you! Your message has been sent successfully.
          </div>
        )}
        
        {/* Spaces & Sizes - Responsive form spacing */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 animate-fade-in delay-200">
          <div className="transform transition-all duration-300 hover:translate-x-1">
            {/* Typography - Label styling */}
            <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            {/* Borders - Rounded input + Effects - Focus ring + Dark mode support */}
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border-2 ${
                errors.name 
                  ? 'border-red-500 animate-shake' 
                  : 'border-gray-700 dark:border-gray-600'
              } bg-gray-900 dark:bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 focus:scale-[1.02]`}
              placeholder="Your name"
            />
            {/* Typography - Error text styling + Animations */}
            {errors.name && (
              <p className="mt-1 text-xs sm:text-sm text-red-400 animate-fade-in">{errors.name}</p>
            )}
          </div>
          
          <div className="transform transition-all duration-300 hover:translate-x-1">
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border-2 ${
                errors.email 
                  ? 'border-red-500 animate-shake' 
                  : 'border-gray-700 dark:border-gray-600'
              } bg-gray-900 dark:bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 focus:scale-[1.02]`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs sm:text-sm text-red-400 animate-fade-in">{errors.email}</p>
            )}
          </div>
          
          <div className="transform transition-all duration-300 hover:translate-x-1">
            <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Message
            </label>
            {/* Customization - Custom border radius using theme variable */}
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border-2 ${
                errors.message 
                  ? 'border-red-500 animate-shake' 
                  : 'border-gray-700 dark:border-gray-600'
              } bg-gray-900 dark:bg-gray-800 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-300 focus:scale-[1.02]`}
              placeholder="Your message..."
            />
            {errors.message && (
              <p className="mt-1 text-xs sm:text-sm text-red-400 animate-fade-in">{errors.message}</p>
            )}
          </div>
          
          {/* Effects - Shadow glow + Animations - Multiple hover effects */}
          <button
            type="submit"
            className="w-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-500 hover:scale-105 transition-all duration-300 shadow-glow hover:shadow-glow-lg transform active:scale-95"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;