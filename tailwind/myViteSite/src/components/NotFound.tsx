import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-purple-600 dark:text-purple-400 mb-4">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-lg"
        >
          Go Back Home
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;