import { format } from "date-fns";

// QR Code Generation
export const generateQRCodeDataURL = async (text) => {
  try {
    const qrcodeModule = await import("qrcode");
    return await qrcodeModule.toDataURL(text, {
      width: 180,
      margin: 1,
      errorCorrectionLevel: "H",
    });
  } catch (e) {
    console.error("QR generation failed:", e);
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  }
};

// Download Ticket Handler
export const handleDownloadTicket = async (bookingId) => {
  try {
    const response = await axiosInstance.get(`/booking/download/${bookingId}`);
    const ticketData = response.data.data;
    const totalQuantity = ticketData.tickets.reduce((sum, t) => sum + t.quantity, 0);
    const qrCodeDataURI = await generateQRCodeDataURL(ticketData.accessCode);

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Event Ticket - ${ticketData.eventTitle}</title>
        <style>
          /* Your existing ticket styles here */
        </style>
      </head>
      <body>
        <!-- Your existing ticket HTML here -->
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to download the ticket.");
      return;
    }

    printWindow.document.write(printContent);
    printWindow.document.close();
  } catch (error) {
    console.error("Download failed:", error);
    alert("Failed to download ticket. Please ensure the booking is confirmed and try again.");
  }
};

// Share Ticket Handler
export const handleShareTicket = (eventTitle, bookingId) => {
  const shareData = {
    title: `My Ticket for ${eventTitle}`,
    text: `Check out my ticket for ${eventTitle}! Booking ID: ${bookingId}. Find more events on EventHive.`,
    url: window.location.origin,
  };

  if (navigator.share) {
    navigator.share(shareData).catch((error) => {
      if (error.name !== "AbortError") {
        console.log("Error sharing", error);
        alert("Sharing failed. You can copy the link manually.");
      }
    });
  } else {
    prompt("Copy the text to share:", shareData.text);
  }
};

// Add to Calendar Handler
export const handleAddToCalendar = (eventTitle, eventDate, eventTime, venue) => {
  const startDateTime = new Date(`${eventDate}T${eventTime}`);
  const endTime = eventTime
    ? new Date(startDateTime.getTime() + 60 * 60 * 1000)
    : startDateTime;
  const formatCalendarTime = (date) => format(date, "yyyyMMddTHHmmss");

  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventTitle
  )}&dates=${formatCalendarTime(startDateTime)}/${formatCalendarTime(
    endTime
  )}&details=${encodeURIComponent(
    "Your confirmed booking with EventHive."
  )}&location=${encodeURIComponent(venue)}&sf=true&output=xml`;

  window.open(googleCalendarUrl, "_blank");
};