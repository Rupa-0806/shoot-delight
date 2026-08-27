import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

const bookingPackages = {
  "portrait-1": {
    price: "1,599",
    note: "Delivery within 24 Hours",
    details: [
      "1 Min Delivery Video",
      "Pics Included",
      "Editing Included",
      "Delivered in 24 Hrs",
    ],
  },

  "landscape-1": {
    price: "1,999",
    note: "Delivery within 24 Hours",
    details: [
      "1 Min Delivery Video",
      "Pics Included",
      "Editing Included",
      "Delivered in 24 Hrs",
    ],
  },

  "portrait-3": {
    price: "3,799",
    note: "Delivery within 24 Hours",
    details: [
      "3 Portrait Reels",
      "Pics Included",
      "Editing Included",
      "Custom Delivery Plan",
    ],
  },

  "landscape-3": {
    price: "5,399",
    note: "Delivery within 24 Hours",
    details: [
      "3 Landscape Reels",
      "Pics Included",
      "Editing Included",
      "Custom Delivery Plan",
    ],
  },

  "perday-3-reels": {
    price: "Contact us",
    note: "Custom package",
    details: [
      "3 Reels in One Day",
      "Pics Included",
      "Editing Included",
      "Custom Delivery Plan",
    ],
  },

  "combo-2p1l": {
    price: "4,299",
    note: "Delivery within 24 Hours",
    details: [
      "2 Portrait + 1 Landscape Reel",
      "Pics Included",
      "Editing Included",
      "Custom Delivery Plan",
    ],
  },

  "combo-2l1p": {
    price: "4,499",
    note: "Delivery within 24 Hours",
    details: [
      "2 Landscape + 1 Portrait Reel",
      "Pics Included",
      "Editing Included",
      "Custom Delivery Plan",
    ],
  },

  "car-bike-delivery": {
    price: "2,499",
    note: "Delivery within 24 Hours",
    details: [
      "Car / Bike Delivery Reel",
      "Pics Included",
      "Editing Included",
      "Custom Delivery Plan",
    ],
  },

  "more-than-3": {
    price: "Contact us",
    note: "Custom package",
    details: [
      "Multiple Reels",
      "Custom Pricing",
      "Editing Included",
      "Fast Delivery",
    ],
  },

  wedding: {
    price: "Contact us",
    note: "Custom package",
    details: [
      "Wedding Coverage",
      "Cinematic Reels",
      "Editing Included",
      "Custom Delivery Plan",
    ],
  },

  birthday: {
    price: "Contact us",
    note: "Custom package",
    details: [
      "Party Coverage",
      "Pics Included",
      "Editing Included",
      "Fast Delivery",
    ],
  },

  brand: {
    price: "Contact us",
    note: "Custom package",
    details: [
      "Product Showcase",
      "Cinematic Reels",
      "Editing Included",
      "Custom Delivery Plan",
    ],
  },

  event: {
    price: "Contact us",
    note: "Custom package",
    details: [
      "Event Coverage",
      "Pics Included",
      "Editing Included",
      "Custom Delivery Plan",
    ],
  },
};

export default function Booking() {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bookingDate: "",
      location: "",
      fullName: "",
      phone: "",
      email: "",
      instagram: "",
      eventType: "",
      referenceReelLink: "",
      eventAddress: "",
      specialRequirements: "",
      agreeToTerms: false,
    },
  });

  const bookingDate = watch("bookingDate");
  const eventType = watch("eventType");

  const selectedBookingPackage = bookingPackages[eventType];

  const onSubmit = async (values) => {
  setSubmitting(true);

  try {
    const bookingData = {
      bookingDate: values.bookingDate,
      location: values.location,
      fullName: values.fullName,
      phone: values.phone,
      email: values.email,
      instagram: values.instagram || null,
      eventType: values.eventType,
      referenceReelLink: values.referenceReelLink || null,
      eventAddress: values.eventAddress,
      specialRequirements: values.specialRequirements || null,
      agreeToTerms: values.agreeToTerms,
    };

    console.log("SENT DATA:", bookingData);

    const { data } = await api.post("/bookings", bookingData);

    toast.success("Booking submitted successfully!");

    navigate("/booking/success", {
      state: {
        bookingId: data.data.id,
      },
    });
  } catch (err) {
    console.log("BOOKING ERROR FULL:", err.response?.data);
    console.log("VALIDATION ERRORS:", err.response?.data?.errors);
    console.log("SENT DATA:", values);

    const msg =
      err.response?.data?.errors?.[0]?.message ||
      err.response?.data?.message ||
      "Something went wrong. Please try again.";

    toast.error(msg);
  } finally {
    setSubmitting(false);
  }
};
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="booking-luxury px-4 sm:px-6 md:px-12 py-16 md:py-24">
      <div className="booking-luxury__glow" />

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 md:mb-14">

          <p className="text-xs tracking-[0.3em] uppercase text-gold-soft mb-3">
            Shoot Delight
          </p>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-offwhite mb-4">
            Book Your Shoot
          </h1>

          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />

          <p className="text-white/50 max-w-md mx-auto">
            Tell us about your vision and let's create something unforgettable.
          </p>

        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="booking-luxury__card rounded-3xl p-6 md:p-10 space-y-7"
        >

          {/* Date & Location */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="label-gold">
                Preferred Date
              </label>

              <input
                type="date"
                min={today}
                {...register("bookingDate", {
                  required: "Please select a date",
                })}
                className="input-gold"
              />

              {errors.bookingDate && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.bookingDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="label-gold">
                Shoot Location
              </label>

              <input
                type="text"
                placeholder="e.g. Visakhapatnam"
                {...register("location", {
                  required: "Location is required",
                })}
                className="input-gold"
              />

              {errors.location && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.location.message}
                </p>
              )}
            </div>

          </div>

          <hr className="divider-gold" />

          {/* Customer Details */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Name */}
            <div>
              <label className="label-gold">
                Your Name
              </label>

              <input
                {...register("fullName", {
                  required: "Full name is required",
                })}
                className="input-gold"
              />

              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="label-gold">
                Phone Number
              </label>

              <input
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                })}
                className="input-gold"
              />

              {errors.phone && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="label-gold">
                Email Address
              </label>

              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                })}
                className="input-gold"
              />

              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Instagram */}
            <div>
              <label className="label-gold">
                Instagram Username{" "}
                <span className="normal-case text-white/30">
                  (optional)
                </span>
              </label>

              <input
                {...register("instagram")}
                placeholder="@yourhandle"
                className="input-gold"
              />
            </div>

            {/* Event Type */}
            <div>
              <label className="label-gold">
                Event / Shoot Type
              </label>

              <select
                {...register("eventType", {
                  required: "Event type is required",
                })}
                className="input-gold"
              >
                <option value="">
                  Select shoot type
                </option>

                <option value="portrait-1">
                  Portrait Reel (1 Reel)
                </option>

                <option value="landscape-1">
                  Landscape Reel (1 Reel)
                </option>

                <option value="portrait-3">
                  3 Portrait Reels
                </option>

                <option value="landscape-3">
                  3 Landscape Reels
                </option>

                <option value="perday-3-reels">
                  Per Day - 3 Reels
                </option>

                <option value="combo-2p1l">
                  2 Portrait + 1 Landscape
                </option>

                <option value="combo-2l1p">
                  2 Landscape + 1 Portrait
                </option>

                <option value="car-bike-delivery">
                  Car / Bike Delivery
                </option>

                <option value="more-than-3">
                  More Than 3 Reels
                </option>

                <option value="wedding">
                  Wedding & Pre-Wedding
                </option>

                <option value="birthday">
                  Birthday & Parties
                </option>

                <option value="brand">
                  Brand & Product Shoot
                </option>

                <option value="event">
                  Event Coverage
                </option>

              </select>

              {errors.eventType && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.eventType.message}
                </p>
              )}

              {/* Package Preview */}
              {selectedBookingPackage && (
                <div className="package-price-card mt-4 rounded-2xl p-5 md:p-6">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <span className="block text-xs tracking-[0.2em] uppercase text-gold-soft">
                        Package Price
                      </span>

                      <span className="mt-1 block font-display text-3xl font-bold text-gold-bright">
                        {selectedBookingPackage.price === "Contact us"
                          ? selectedBookingPackage.price
                          : `₹${selectedBookingPackage.price}`}
                      </span>

                      <span className="mt-1 block text-xs text-white/45">
                        {selectedBookingPackage.note}
                      </span>

                    </div>

                    <div className="space-y-1 text-sm text-white/65 sm:text-right">

                      {selectedBookingPackage.details.map(
                        (detail) => (
                          <div key={detail}>
                            • {detail}
                          </div>
                        )
                      )}

                    </div>

                  </div>

                </div>
              )}
            </div>

            {/* Reference Reel */}
            <div>
              <label className="label-gold">
                Reference Reel Link{" "}
                <span className="normal-case text-white/30">
                  (optional)
                </span>
              </label>

              <input
                type="url"
                placeholder="https://instagram.com/reel/..."
                {...register("referenceReelLink")}
                className="input-gold"
              />
            </div>

          </div>

          {/* Event Address */}
          <div>

            <label className="label-gold">
              Event Address
            </label>

            <input
              {...register("eventAddress", {
                required: "Event address is required",
              })}
              className="input-gold"
            />

            {errors.eventAddress && (
              <p className="text-red-400 text-xs mt-1.5">
                {errors.eventAddress.message}
              </p>
            )}

          </div>

          {/* Special Requirements */}
          <div>

            <label className="label-gold">
              Special Requirements{" "}
              <span className="normal-case text-white/30">
                (optional)
              </span>
            </label>

            <textarea
              rows={3}
              {...register("specialRequirements")}
              className="input-gold"
            />

          </div>

          {/* Terms */}
          <div>

            <label className="flex items-start gap-3 text-sm text-white/60">

              <input
                type="checkbox"
                {...register("agreeToTerms", {
                  required:
                    "You must accept the terms to continue",
                })}
                className="mt-1 checkbox-gold"
              />

              <span>
                I agree to the{" "}
                <span className="text-gold-soft">
                  Terms & Conditions
                </span>{" "}
                and confirm the above details are accurate.
              </span>

            </label>

            {errors.agreeToTerms && (
              <p className="text-red-400 text-xs mt-1.5">
                {errors.agreeToTerms.message}
              </p>
            )}

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-gold w-full justify-center disabled:opacity-60"
          >
            {submitting
              ? "Submitting..."
              : "Submit Booking"}
          </button>

        </form>

      </div>
    </div>
  );
}