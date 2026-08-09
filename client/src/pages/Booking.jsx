import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serviceId: searchParams.get("serviceId") || "",
      bookingDate: "",
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/services");
        setServices(data.data);
      } catch (err) {
        toast.error("Unable to load services.");
      }
    })();
  }, []);

  const onSubmit = async (values) => {
    setSubmitting(true);

    try {
      const { data } = await api.post("/bookings", values);

      navigate("/booking/success", {
        state: { bookingId: data.data.id },
      });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="section max-w-3xl mx-auto">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-4">
        Book Your Shoot
      </h1>

      <p className="text-center text-cream/60 mb-12">
        Fill in the details below and we'll take it from there.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass rounded-2xl p-6 md:p-10 space-y-6"
      >
        {/* Service */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Service
          </label>

          <select
            {...register("serviceId", {
              required: "Please select a service",
            })}
            className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-brand"
          >
            <option value="" className="bg-ink text-white">
              Select a service
            </option>

            {services.map((s) => (
              <option
                key={s.id}
                value={s.id}
                className="bg-ink text-white"
              >
                {s.title}
              </option>
            ))}
          </select>

          {errors.serviceId && (
            <p className="text-red-400 text-xs mt-1">
              {errors.serviceId.message}
            </p>
          )}
        </div>

        {/* Preferred Date & Location */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Preferred Date
            </label>

            <input
              type="date"
              min={today}
              {...register("bookingDate", {
                required: "Please select a date",
              })}
              className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-brand"
            />

            {errors.bookingDate && (
              <p className="text-red-400 text-xs mt-1">
                {errors.bookingDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Location / City
            </label>

            <input
              type="text"
              placeholder="e.g. Visakhapatnam"
              {...register("location", {
                required: "Location is required",
              })}
              className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-brand"
            />

            {errors.location && (
              <p className="text-red-400 text-xs mt-1">
                {errors.location.message}
              </p>
            )}
          </div>
        </div>

        {/* Timing Information */}
        <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
          <p className="font-medium mb-1">
            Shoot Timing Confirmation
          </p>

          <p className="text-sm text-cream/60 leading-relaxed">
            You don't need to select a time slot now. After you submit your
            booking request, the Shoot Delight team will contact you by phone
            to confirm the shoot timing based on your preferred date and our
            availability.
          </p>
        </div>

        <hr className="border-cream/10" />

        {/* Customer Details */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>

            <input
              {...register("fullName", {
                required: "Full name is required",
              })}
              className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-brand"
            />

            {errors.fullName && (
              <p className="text-red-400 text-xs mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number
            </label>

            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
              })}
              className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-brand"
            />

            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-brand"
            />

            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Instagram Username (optional)
            </label>

            <input
              {...register("instagram")}
              placeholder="@yourhandle"
              className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-brand"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Event Type
            </label>

            <input
              placeholder="e.g. Birthday, Wedding, Product Launch"
              {...register("eventType", {
                required: "Event type is required",
              })}
              className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-brand"
            />

            {errors.eventType && (
              <p className="text-red-400 text-xs mt-1">
                {errors.eventType.message}
              </p>
            )}
          </div>

          {/* Reference Reel */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Reference Reel Link (optional)
            </label>

            <input
              type="url"
              placeholder="https://instagram.com/reel/..."
              {...register("referenceReelLink")}
              className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-brand"
            />
          </div>
        </div>

        {/* Special Requirements */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Special Requirements (optional)
          </label>

          <textarea
            rows={3}
            {...register("specialRequirements")}
            className="w-full bg-white/5 border border-cream/20 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-brand"
          />
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 text-sm text-cream/70">
          <input
            type="checkbox"
            {...register("agreeToTerms", {
              required: "You must accept the terms to continue",
            })}
            className="mt-1 accent-brand"
          />

          <span>
            I agree to the Terms & Conditions and confirm the above details
            are accurate.
          </span>
        </label>

        {errors.agreeToTerms && (
          <p className="text-red-400 text-xs">
            {errors.agreeToTerms.message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full justify-center disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit Booking"}
        </button>
      </form>
    </div>
  );
}