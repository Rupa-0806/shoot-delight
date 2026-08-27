const asyncHandler = require("express-async-handler");
const prisma = require("../config/db");
const { toDateOnly } = require("./slotController");
const {
  sendEmail,
  customerConfirmationTemplate,
  adminNotificationTemplate,
} = require("../utils/email");

// ======================================================
// CREATE BOOKING
// POST /api/bookings
// PUBLIC
// ======================================================

const createBooking = asyncHandler(async (req, res) => {
  console.log("BOOKING REQUEST BODY:", req.body);

  const {
    bookingDate,
    location,
    fullName,
    phone,
    email,
    instagram,
    eventType,
    specialRequirements,
    referenceReelLink,
    eventAddress,
    agreeToTerms,
  } = req.body;

  // ====================================================
  // VALIDATION
  // ====================================================

  const errors = [];

  if (!bookingDate) {
    errors.push({
      field: "bookingDate",
      message: "Booking date is required",
    });
  }

  if (!location || !location.trim()) {
    errors.push({
      field: "location",
      message: "Location is required",
    });
  }

  if (!fullName || !fullName.trim()) {
    errors.push({
      field: "fullName",
      message: "Full name is required",
    });
  }

  if (!phone || !phone.trim()) {
    errors.push({
      field: "phone",
      message: "Phone number is required",
    });
  }

  if (!email || !email.trim()) {
    errors.push({
      field: "email",
      message: "Email is required",
    });
  }

  if (!eventType || !eventType.trim()) {
    errors.push({
      field: "eventType",
      message: "Event type is required",
    });
  }

  if (!eventAddress || !eventAddress.trim()) {
    errors.push({
      field: "eventAddress",
      message: "Event address is required",
    });
  }

  // Checkbox must be exactly true
  if (agreeToTerms !== true) {
    errors.push({
      field: "agreeToTerms",
      message: "You must accept the terms",
    });
  }

  if (errors.length > 0) {
    console.log("BOOKING VALIDATION ERRORS:", errors);

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // ====================================================
  // DATE
  // ====================================================

  const dateOnly = toDateOnly(bookingDate);

  console.log("BOOKING DATE:", dateOnly);

  // ====================================================
  // CREATE CUSTOMER + BOOKING
  // ====================================================

  const booking = await prisma.$transaction(async (tx) => {
    // --------------------------------------------------
    // CREATE CUSTOMER
    // --------------------------------------------------

    const customer = await tx.customer.create({
      data: {
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        instagram: instagram?.trim() || null,
      },
    });

    console.log("CUSTOMER CREATED:", customer.id);

    // --------------------------------------------------
    // CREATE BOOKING
    // --------------------------------------------------

    const createdBooking = await tx.booking.create({
      data: {
        bookingDate: new Date(bookingDate),

        location: location.trim(),

        eventAddress: eventAddress.trim(),

        eventType: eventType.trim(),

        specialRequirements:
          specialRequirements?.trim() || null,

        referenceReelLink:
          referenceReelLink?.trim() || null,

        // Connect the newly created customer
        customer: {
          connect: {
            id: customer.id,
          },
        },
      },

      include: {
        customer: true,
        slot: true,
      },
    });

    console.log("BOOKING CREATED:", createdBooking.id);

    // IMPORTANT: return booking from transaction
    return createdBooking;
  });

  // ====================================================
  // SEND EMAILS
  // ====================================================

  try {
    // --------------------------------------------------
    // CUSTOMER CONFIRMATION
    // --------------------------------------------------

    await sendEmail({
      to: booking.customer.email,
      subject: "Your Shoot Delight booking request has been received",
      html: customerConfirmationTemplate(booking),
    });

    // --------------------------------------------------
    // ADMIN NOTIFICATION
    // --------------------------------------------------

    if (process.env.BUSINESS_EMAIL) {
      await sendEmail({
        to: process.env.BUSINESS_EMAIL,
        subject: `New Booking: ${booking.eventType} on ${new Date(
          booking.bookingDate
        ).toDateString()}`,
        html: adminNotificationTemplate(booking),
      });
    }
  } catch (emailErr) {
    // Email failure should NOT cancel the booking
    console.error("Email send failed:", emailErr.message);
  }

  // ====================================================
  // SUCCESS
  // ====================================================

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});

// ======================================================
// GET ALL BOOKINGS
// GET /api/bookings
// ADMIN
// ======================================================

const getBookings = asyncHandler(async (req, res) => {
  const {
    status,
    search,
    from,
    to,
    page = 1,
    limit = 20,
  } = req.query;

  const where = {
    ...(status && {
      status,
    }),

    ...(from || to
      ? {
          bookingDate: {
            ...(from && {
              gte: new Date(from),
            }),

            ...(to && {
              lte: new Date(to),
            }),
          },
        }
      : {}),

    ...(search && {
      OR: [
        {
          customer: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },

        {
          customer: {
            phone: {
              contains: search,
              mode: "insensitive",
            },
          },
        },

        {
          customer: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },

        {
          eventType: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          location: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,

      include: {
        customer: true,
        slot: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      skip: (Number(page) - 1) * Number(limit),

      take: Number(limit),
    }),

    prisma.booking.count({
      where,
    }),
  ]);

  res.json({
    success: true,

    data: bookings,

    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
    },
  });
});

// ======================================================
// GET SINGLE BOOKING
// GET /api/bookings/:id
// ADMIN
// ======================================================

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: req.params.id,
    },

    include: {
      customer: true,
      slot: true,
    },
  });

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  res.json({
    success: true,
    data: booking,
  });
});

// ======================================================
// UPDATE BOOKING
// PUT /api/bookings/:id
// ADMIN
// ======================================================

const updateBooking = asyncHandler(async (req, res) => {
  const {
    status,
    notes,
  } = req.body;

  const booking = await prisma.booking.update({
    where: {
      id: req.params.id,
    },

    data: {
      ...(status !== undefined && {
        status,
      }),

      ...(notes !== undefined && {
        notes,
      }),
    },

    include: {
      customer: true,
      slot: true,
    },
  });

  res.json({
    success: true,
    data: booking,
  });
});

// ======================================================
// DELETE BOOKING
// DELETE /api/bookings/:id
// ADMIN
// ======================================================

const deleteBooking = asyncHandler(async (req, res) => {
  // First remove booking reference from slot
  await prisma.slot.updateMany({
    where: {
      bookingId: req.params.id,
    },

    data: {
      bookingId: null,
    },
  });

  // Then delete booking
  await prisma.booking.delete({
    where: {
      id: req.params.id,
    },
  });

  res.json({
    success: true,
    message: "Booking deleted",
  });
});

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};