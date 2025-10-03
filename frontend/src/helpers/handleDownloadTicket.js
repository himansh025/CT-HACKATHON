
import axiosInstance from "../config/apiconfig";
import { format } from "date-fns";


  const handleDownloadTicket = async (bookingId) => {
    const generateQRCodeDataURL = async (text) => {
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
  try {
    const response = await axiosInstance.get(`/booking/download/${bookingId}`);
    const ticketData = response.data.data;
    const totalQuantity = ticketData.tickets.reduce((sum, t) => sum + t.quantity, 0);
    const qrCodeDataURI = await generateQRCodeDataURL(ticketData?.accessCode);

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Event Ticket - ${ticketData.eventTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
          body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; }
          .ticket-container {
              max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
          .header {
              background-color: #9333ea; 
              color: white; padding: 30px; text-align: center; border-top-left-radius: 12px; border-top-right-radius: 12px;
          }
          .content { padding: 30px; }
          .details { 
              border-bottom: 2px dashed #e5e7eb; padding-bottom: 20px; margin-bottom: 20px; display: flex; flex-wrap: wrap; justify-content: space-between;
          }
          .detail-item { width: 48%; margin-bottom: 15px; }
          .label { font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 500; }
          .value { font-size: 16px; color: #1f2937; font-weight: 600; }
          .ticket-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #f3f4f6; }
          .qr-section { text-align: center; background-color: #f9fafb; padding: 30px; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; }
          .qr-section img { margin: 15px auto; display: block; }
          .print-btn { 
            position: fixed; top: 20px; right: 20px; background: #9333ea; color: white; 
            border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600;
            z-index: 1000;
          }
          @media print {
            .print-btn { display: none; }
            .ticket-container { box-shadow: none; border: 1px solid #000; margin: 0; }
            .header { background-color: #9333ea !important; -webkit-print-color-adjust: exact; color: white !important; }
            .qr-section { background-color: #f9fafb !important; -webkit-print-color-adjust: exact; }
            body { background-color: white; padding: 0; }
          }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">🖨️ Print Ticket</button>
        
        <div class="ticket-container">
          <div class="header">
            <h1 style="font-size: 28px; font-weight: 800; margin: 0;">${ticketData.eventTitle}</h1>
            <p style="font-size: 18px; margin: 5px 0 0;">Confirmed Ticket</p>
          </div>
          
          <div class="content">
            <div class="details">
              <div class="detail-item">
                <p class="label">Attendee Name</p>
                <p class="value">${ticketData.attendeeName}</p>
              </div>
              <div class="detail-item">
                <p class="label">Date</p>
                <p class="value">${format(new Date(ticketData.eventDate), "EEE, MMM dd, yyyy")}</p>
              </div>
              <div class="detail-item">
                <p class="label">Time</p>
                <p class="value">${ticketData.eventTime}</p>
              </div>
              <div class="detail-item">
                <p class="label">Venue</p>
                <p class="value">${ticketData.venue}</p>
              </div>
              <div class="detail-item">
                <p class="label">Total Tickets</p>
                <p class="value">${totalQuantity}</p>
              </div>
              <div class="detail-item">
                <p class="label">Total Paid</p>
                <p class="value">₹${ticketData.totalAmount}</p>
              </div>
            </div>

            <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 10px; color: #1f2937;">Ticket Breakdown</h3>
            ${ticketData.tickets.map(t => `
              <div class="ticket-row">
                  <span class="value">${t.type} (x${t.quantity})</span>
                  <span class="value">₹${t.price * t.quantity}</span>
              </div>
            `).join("")}
          </div>

          <div class="qr-section">
            <img src="${qrCodeDataURI}" alt="QR Code for Entry" style="width: 180px; height: 180px;"/>
            <p style="font-size: 18px; font-weight: 600; color: #1f2937;">SCAN FOR ENTRY</p>
            <p style="font-size: 12px; color: #6b7280;">Access Code: ${ticketData.accessCode}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=800,height=900");
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


export default handleDownloadTicket