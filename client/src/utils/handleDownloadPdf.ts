import jsPDF from 'jspdf';

const handleDownloadPdf = (
  registrationId: string,
  qrCode: string,
  form: { name: string; email: string; phone: string },
) => {
  const doc = new jsPDF();

  // Set margins and page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 5;
  const centerX = pageWidth / 2;

  // Add background color (light gray)

  // Add white content area
  doc.setFillColor(255, 255, 255);
  doc.rect(
    margin,
    margin,
    pageWidth - margin * 2,
    pageHeight - margin * 2,
    'F',
  );

  // Add header text
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('HALL TICKET', centerX, margin + 30, { align: 'center' });

  // Add decorative line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, margin + 50, pageWidth - margin, margin + 50);

  // Add attendee information section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ATTENDEE INFORMATION', margin + 10, margin + 70);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  const infoStartY = margin + 80;
  const lineHeight = 7;

  doc.text(`Name: ${form.name}`, margin + 10, infoStartY);
  doc.text(`Email: ${form.email}`, margin + 10, infoStartY + lineHeight);
  doc.text(`Phone: ${form.phone}`, margin + 10, infoStartY + lineHeight * 2);

  // Add QR code section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ENTRY PASS', pageWidth - margin - 60, margin + 70);

  // Add QR code with border and styling
  const qrCodeSize = 50;
  const qrCodeX = pageWidth - margin - qrCodeSize - 10;
  const qrCodeY = infoStartY;

  // QR code background
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(
    qrCodeX - 5,
    qrCodeY - 5,
    qrCodeSize + 5,
    qrCodeSize + 5,
    3,
    3,
    'F',
  );

  // QR code border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.4);
  doc.roundedRect(
    qrCodeX - 5,
    qrCodeY - 5,
    qrCodeSize + 10,
    qrCodeSize + 10,
    3,
    3,
    'S',
  );

  // Add QR code image
  doc.addImage(qrCode, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

  // Add footer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Please present this ticket at the event entrance',
    centerX,
    pageHeight - margin - 20,
    { align: 'center' },
  );
  //   doc.text("For any queries, contact: support@eventname.com", centerX, pageHeight - margin - 10, { align: 'center' });

  // Create filename
  const cleanName = form.name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

  doc.save(`hall_ticket_${cleanName}.pdf`);
};

export default handleDownloadPdf;
