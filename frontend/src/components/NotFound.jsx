import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-primary-foreground">
      <div className="text-center animate-fadeIn">
        
        <h1 className="text-9xl font-extrabold text-foreground animate-pulse">
          404
        </h1>

        <p className="text-2xl md:text-3xl font-semibold mt-4">
          Page Not Found
        </p>

        <p className="text-gray-400 mt-2 mb-8">
          Sorry, the page you’re looking for doesn’t exist.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-full bg-card text-foreground font-bold
                     hover:bg-gray-200 transition duration-300 active:scale-95"
        >
          Go Back Home
        </Link>

      </div>
    </div>
  );
}
