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
    <section className="w-full min-h-screen pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 bg-gray-950">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto max-w-3xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white mb-3 sm:mb-4 md:mb-6">
          Get In Touch
        </h2>
        <p className="text-center text-sm sm:text-base md:text-lg text-gray-400 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          Have a project in mind? Let's work together!
        </p>
        
        {isSubmitted && (
          <div className="mb-6 p-3 sm:p-4 bg-green-500/20 border border-green-500/50 text-green-300 rounded-lg text-sm sm:text-base">
            Thank you! Your message has been sent successfully.
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border ${
                errors.name 
                  ? 'border-red-500' 
                  : 'border-gray-700'
              } bg-gray-900 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border ${
                errors.email 
                  ? 'border-red-500' 
                  : 'border-gray-700'
              } bg-gray-900 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border ${
                errors.message 
                  ? 'border-red-500' 
                  : 'border-gray-700'
              } bg-gray-900 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-300`}
              placeholder="Your message..."
            />
            {errors.message && (
              <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-500 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;