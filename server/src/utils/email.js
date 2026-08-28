const nodemailer = require("nodemailer");

let resendClient = null;

if (
  process.env.EMAIL_PROVIDER === "resend" &&
  process.env.RESEND_API_KEY
) {
  // Lazy require so nodemailer-only setups don't need
  // the `resend` package installed.
  const { Resend } = require("resend");
  resendClient = new Resend(process.env.RESEND_API_KEY);
}

const transporter =
  process.env.EMAIL_PROVIDER !== "resend"
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    : null;

/**
 * Send an email via whichever provider is configured.
 *
 * @param {{
 *   to: string,
 *   subject: string,
 *   html: string,
 *   attachments?: Array<{
 *     filename: string,
 *     content: Buffer,
 *     contentType?: string
 *   }>
 * }} opts
 */
async function sendEmail({ to, subject, html, attachments }) {
  const from =
    process.env.FROM_EMAIL ||
    "Shoot Delight <shootdelight678@gmail.com>";

  if (resendClient) {
    // Resend expects attachment content as base64.
    const resendAttachments = attachments?.map((a) => ({
      filename: a.filename,
      content: a.content.toString("base64"),
    }));

    await resendClient.emails.send({
      from,
      to,
      subject,
      html,
      attachments: resendAttachments,
    });

    return;
  }

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
    attachments,
  });
}

/**
 * Customer booking confirmation.
 *
 * The exact shooting time is NOT confirmed at the time of booking.
 * Shoot Delight will contact the customer to confirm the timing.
 */
function customerConfirmationTemplate(booking) {
  const bookingDate = new Date(
    booking.bookingDate
  ).toDateString();

  const confirmedTime = booking.bookingTime
    ? booking.bookingTime
    : "To be confirmed by Shoot Delight";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Shoot Delight Booking</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background: #f5f5f5;
  font-family: Arial, Helvetica, sans-serif;
  color: #222;
">

  <div style="
    max-width: 600px;
    margin: 30px auto;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e5e5;
  ">

    <div style="
      padding: 24px;
      background: #111111;
      color: #ffffff;
      text-align: center;
    ">
      <h1 style="margin: 0; font-size: 26px;">
        Shoot Delight
      </h1>

      <p style="
        margin: 8px 0 0;
        color: #dddddd;
      ">
        Booking Request Received
      </p>
    </div>

    <div style="padding: 28px;">

      <h2 style="
        margin-top: 0;
        font-size: 22px;
      ">
        Thank you, ${booking.customer.name}!
      </h2>

      <p style="line-height: 1.6;">
        We have received your booking request successfully.
        Our Shoot Delight team will contact you to confirm
        the exact shooting time.
      </p>

      <div style="
        margin: 24px 0;
        padding: 18px;
        background: #f7f7f7;
        border-radius: 8px;
      ">

        <h3 style="margin-top: 0;">
          Booking Details
        </h3>

        <table style="
          width: 100%;
          border-collapse: collapse;
        ">

          <tr>
            <td style="padding: 7px 0;">
              <strong>Service</strong>
            </td>
            <td style="padding: 7px 0;">
              ${booking.service?.title || "Selected Service"}
            </td>
          </tr>

          ${
            booking.package
              ? `
          <tr>
            <td style="padding: 7px 0;">
              <strong>Package</strong>
            </td>
            <td style="padding: 7px 0;">
              ${booking.package.title || "Selected Package"}
            </td>
          </tr>
          `
              : ""
          }

          <tr>
            <td style="padding: 7px 0;">
              <strong>Preferred Date</strong>
            </td>
            <td style="padding: 7px 0;">
              ${bookingDate}
            </td>
          </tr>

          <tr>
            <td style="padding: 7px 0;">
              <strong>Shooting Time</strong>
            </td>
            <td style="padding: 7px 0;">
              ${confirmedTime}
            </td>
          </tr>

          <tr>
            <td style="padding: 7px 0;">
              <strong>Location</strong>
            </td>
            <td style="padding: 7px 0;">
              ${booking.location}
            </td>
          </tr>

          <tr>
            <td style="padding: 7px 0;">
              <strong>Event Type</strong>
            </td>
            <td style="padding: 7px 0;">
              ${booking.eventType}
            </td>
          </tr>

        </table>
      </div>

      <div style="
        padding: 16px;
        background: #fff8e6;
        border-radius: 8px;
        border: 1px solid #f0dfad;
      ">
        <strong>Important:</strong>

        <p style="
          margin: 8px 0 0;
          line-height: 1.5;
        ">
          Your preferred date has been received.
          The exact shooting time will be confirmed
          by the Shoot Delight team over phone.
        </p>
      </div>

      <p style="
        margin-top: 24px;
        line-height: 1.6;
      ">
        We look forward to working with you!
      </p>

      <p style="margin-bottom: 0;">
        <strong>Shoot Delight</strong><br />
        Reels • Events • Business Promotions
      </p>

    </div>
  </div>

</body>
</html>
`;
}

/**
 * Admin/business notification.
 */
function adminNotificationTemplate(booking) {
  const bookingDate = new Date(
    booking.bookingDate
  ).toDateString();

  const confirmedTime = booking.bookingTime
    ? booking.bookingTime
    : "Not confirmed yet";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>New Shoot Delight Booking</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background: #f5f5f5;
  font-family: Arial, Helvetica, sans-serif;
  color: #222;
">

  <div style="
    max-width: 650px;
    margin: 30px auto;
    background: #ffffff;
    border: 1px solid #ddd;
    border-radius: 12px;
    overflow: hidden;
  ">

    <div style="
      padding: 22px;
      background: #111111;
      color: #ffffff;
    ">
      <h2 style="margin: 0;">
        New Booking Received
      </h2>
    </div>

    <div style="padding: 25px;">

      <h3>Customer Details</h3>

      <table style="
        width: 100%;
        border-collapse: collapse;
      ">

        <tr>
          <td style="padding: 7px 0;">
            <strong>Name</strong>
          </td>
          <td style="padding: 7px 0;">
            ${booking.customer.name}
          </td>
        </tr>

        <tr>
          <td style="padding: 7px 0;">
            <strong>Phone</strong>
          </td>
          <td style="padding: 7px 0;">
            ${booking.customer.phone}
          </td>
        </tr>

        <tr>
          <td style="padding: 7px 0;">
            <strong>Email</strong>
          </td>
          <td style="padding: 7px 0;">
            ${booking.customer.email}
          </td>
        </tr>

        ${
          booking.customer.instagram
            ? `
        <tr>
          <td style="padding: 7px 0;">
            <strong>Instagram</strong>
          </td>
          <td style="padding: 7px 0;">
            ${booking.customer.instagram}
          </td>
        </tr>
        `
            : ""
        }

      </table>

      <h3 style="margin-top: 28px;">
        Booking Details
      </h3>

      <table style="
        width: 100%;
        border-collapse: collapse;
      ">

        <tr>
          <td style="padding: 7px 0;">
            <strong>Service</strong>
          </td>
          <td style="padding: 7px 0;">
            ${booking.service?.title || "Selected Service"}
          </td>
        </tr>


        <tr>
          <td style="padding: 7px 0;">
            <strong>Preferred Date</strong>
          </td>
          <td style="padding: 7px 0;">
            ${bookingDate}
          </td>
        </tr>

        <tr>
          <td style="padding: 7px 0;">
            <strong>Shooting Time</strong>
          </td>
          <td style="padding: 7px 0;">
            ${confirmedTime}
          </td>
        </tr>

        <tr>
          <td style="padding: 7px 0;">
            <strong>Location</strong>
          </td>
          <td style="padding: 7px 0;">
            ${booking.location}
          </td>
        </tr>

        <tr>
          <td style="padding: 7px 0;">
            <strong>Event Type</strong>
          </td>
          <td style="padding: 7px 0;">
            ${booking.eventType}
          </td>
        </tr>

       

        ${
          booking.specialRequirements
            ? `
        <tr>
          <td style="padding: 7px 0;">
            <strong>Special Requirements</strong>
          </td>
          <td style="padding: 7px 0;">
            ${booking.specialRequirements}
          </td>
        </tr>
        `
            : ""
        }

        ${
          booking.referenceReelLink
            ? `
        <tr>
          <td style="padding: 7px 0;">
            <strong>Reference Reel</strong>
          </td>
          <td style="padding: 7px 0;">
            ${booking.referenceReelLink}
          </td>
        </tr>
        `
            : ""
        }

      </table>

      <div style="
        margin-top: 24px;
        padding: 15px;
        background: #fff8e6;
        border-radius: 8px;
      ">
        <strong>Action Required:</strong>

        <p style="margin-bottom: 0;">
          Contact the customer and confirm the exact
          shooting time.
        </p>
      </div>

    </div>
  </div>

</body>
</html>
`;
}


module.exports = {
  sendEmail,
  customerConfirmationTemplate,
  adminNotificationTemplate,
  
};