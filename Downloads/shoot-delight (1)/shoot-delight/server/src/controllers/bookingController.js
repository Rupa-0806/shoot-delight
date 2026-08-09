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
// Public
// ======================================================
const createBooking = asyncHandler(async (req, res) => {
  const {
    serviceId,
    bookingDate,
    location,
    fullName,
    phone,
    email,
    instagram,
    eventType,
    
    specialRequirements,
    referenceReelLink,
  } = req.body;

  const dateOnly = toDateOnly(bookingDate);

  /*
   * Customer selects a preferred date.
   * Exact shooting time will be confirmed later
   * by Shoot Delight over phone.
   */

  const booking = await prisma.$transaction(async (tx) => {
    // Create customer
    const customer = await tx.customer.create({
      data: {
        name: fullName,
        phone,
        email,
        instagram,
      },
    });

    // Create booking
    const created = await tx.booking.create({
      data: {
        customerId: customer.id,
        serviceId,
        bookingDate: dateOnly,
        location,
        eventType,
        
        specialRequirements,
        referenceReelLink,
      },

      include: {
        customer: true,
        service: true,
      },
    });

    return created;
  });

  // ====================================================
  // SEND EMAILS
  // ====================================================

  try {
    // Customer confirmation email
    await sendEmail({
      to: booking.customer.email,
      subject: "Your Shoot Delight booking request has been received",
      html: customerConfirmationTemplate(booking),
    });

    // Admin/business notification email
    await sendEmail({
      to: process.env.BUSINESS_EMAIL,
      subject: `New Booking: ${booking.service.title} on ${new Date(
        booking.bookingDate
      ).toDateString()}`,
      html: adminNotificationTemplate(booking),
    });
  } catch (emailErr) {
    /*
     * Booking is already saved.
     * If email fails, booking should NOT fail.
     */
    console.error("Email send failed:", emailErr.message);
  }

  // Send success response
  res.status(201).json({
    success: true,
    data: booking,
  });
});

// ======================================================
// GET ALL BOOKINGS
// GET /api/bookings
// Admin only
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
    ...(status && { status }),

    ...(from || to
      ? {
          bookingDate: {
            ...(from && { gte: new Date(from) }),
            ...(to && { lte: new Date(to) }),
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
      ],
    }),
  };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,

      include: {
        customer: true,
        service: true,
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
// Admin only
// ======================================================
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: req.params.id,
    },

    include: {
      customer: true,
      service: true,
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
// Admin only
// ======================================================
const updateBooking = asyncHandler(async (req, res) => {
  const {
    status,
    notes,
    bookingTime,
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

      // Admin can add confirmed shooting time later
      ...(bookingTime !== undefined && {
        bookingTime: bookingTime || null,
      }),
    },

    include: {
      customer: true,
      service: true,
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
// Admin only
// ======================================================
const deleteBooking = asyncHandler(async (req, res) => {
  /*
   * If an old/legacy slot is attached to this booking,
   * release the slot before deleting the booking.
   */

  await prisma.slot.updateMany({
    where: {
      bookingId: req.params.id,
    },

    data: {
      bookingId: null,
    },
  });

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