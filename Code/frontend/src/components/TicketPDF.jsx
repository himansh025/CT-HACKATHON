// src/components/TicketPDF.jsx
import jsPDF from "jspdf";
import QRCode from "qrcode";

const generateTicketPDF = async (ticket) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Event Ticket", 105, 20, { align: "center" });

  // Event details
  doc.setFontSize(12);
  doc.text(`Event: ${ticket.eventTitle}`, 20, 40);
  doc.text(`Date: ${ticket.eventDate?.slice(0, 10)} ${ticket.eventTime}`, 20, 50);
  doc.text(`Venue: ${ticket.venue}`, 20, 60);
  doc.text(`Booking ID: ${ticket.bookingId}`, 20, 70);

  if (ticket?.tickets?.length > 0) {
    doc.text(`Ticket Type: ${ticket.tickets[0].type}`, 20, 80);
    doc.text(`Quantity: ${ticket.tickets[0].quantity}`, 20, 90);
    doc.text(`Total Paid: $${ticket.tickets[0].price * ticket.tickets[0].quantity}`, 20, 100);
  }

  // Generate QR Code with event + booking info
  const qrData = JSON.stringify({
    eventId: ticket.eventId,
    bookingId: ticket.bookingId,
    userId: ticket.userId,
  });

  const qrImage = await QRCode.toDataURL(qrData);

  // Add QR to PDF
  doc.addImage(qrImage, "PNG", 150, 40, 40, 40);

  // Save file
  doc.save(`Ticket-${ticket.bookingId}.pdf`);
};

export default generateTicketPDF;
