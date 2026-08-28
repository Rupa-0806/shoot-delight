const asyncHandler = require("express-async-handler");
const prisma = require("../config/db");

// GET /api/dashboard (admin only)
const getDashboard = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const [
    upcoming,
    todayCount,
    completed,
    cancelled,
    pending,
    recentCustomers,
    monthlyBookings,
  ] = await Promise.all([
    prisma.booking.count({ where: { bookingDate: { gte: startOfToday }, status: { in: ["PENDING", "ACCEPTED"] } } }),
    prisma.booking.count({ where: { bookingDate: { gte: startOfToday, lt: endOfToday } } }),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.booking.count({ where: { status: "CANCELLED" } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.customer.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.booking.findMany({
      where: { createdAt: { gte: startOfMonth } },
      select: { createdAt: true, status: true },
    }),
  ]);

  // Group this month's bookings by day for a simple chart
  const byDay = {};
  monthlyBookings.forEach((b) => {
    const key = b.createdAt.toISOString().slice(0, 10);
    byDay[key] = (byDay[key] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      upcomingBookings: upcoming,
      todaysBookings: todayCount,
      completedShoots: completed,
      cancelledBookings: cancelled,
      pendingBookings: pending,
      recentCustomers,
      monthlyStats: byDay,
    },
  });
});

module.exports = { getDashboard };
