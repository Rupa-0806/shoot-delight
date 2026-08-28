import { Link, useLocation } from "react-router-dom";

export default function BookingSuccess() {
  const location = useLocation();
  const bookingId = location.state?.bookingId;

  return (
    <div className="section max-w-3xl mx-auto">
      <div className="text-center">

        {/* Success Icon */}
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-brand">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9 text-black"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12l4 4L19 6"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Booking Received!
        </h1>

        <p className="text-cream/60 text-lg max-w-2xl mx-auto leading-relaxed">
          Thank you for booking with Shoot Delight.
          Your booking request has been successfully received.
        </p>

        {/* Email Message */}
        <div className="glass rounded-2xl p-6 md:p-8 mt-10 text-left">
          <h2 className="font-display text-2xl font-bold mb-3">
            Confirmation Sent
          </h2>

          <p className="text-cream/60 leading-relaxed">
            We have sent your booking details to your email address.
            Our Shoot Delight team will contact you by phone to confirm
            the exact shooting time.
          </p>

          {bookingId && (
            <div className="mt-5 p-4 rounded-lg bg-white/5 border border-cream/10">
              <p className="text-sm text-cream/50">
                Booking ID
              </p>

              <p className="text-sm font-medium mt-1 break-all">
                {bookingId}
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/"
            className="btn-primary justify-center"
          >
            Back to Home
          </Link>

          <Link
            to="/services"
            className="btn-secondary justify-center"
          >
            View Services
          </Link>
        </div>

      </div>
    </div>
  );
}