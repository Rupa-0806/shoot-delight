import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="section text-center min-h-[70vh] flex flex-col items-center justify-center">
      <h1 className="font-display text-6xl font-bold gradient-text mb-4">404</h1>
      <p className="text-cream/60 mb-8">This page doesn't exist.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}
