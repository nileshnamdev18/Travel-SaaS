import jsPDF from 'jspdf';
import { QuotationRecord, UmrahPackage, HolidayPackage, InvoiceDocument, BookingRecord } from '../types';

export class PdfEngine {
  /**
   * 1. B2C Itinerary & Booking Voucher PDF
   */
  static generateItineraryVoucher(pkg: UmrahPackage | HolidayPackage, paxCount: number = 2, travelerName: string = 'Ahmed Al-Mansoor') {
    const doc = new jsPDF();
    const primaryColor = [13, 92, 70]; // Emerald
    const goldColor = [197, 160, 89]; // Gold

    // Header Banner
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 36, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('TRAVELPULSE AI — OFFICIAL BOOKING VOUCHER', 14, 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Booking Ref: TP-VCH-${Math.floor(100000 + Math.random() * 900000)} | Issued: ${new Date().toLocaleDateString()}`, 14, 28);

    // Traveler & Booking Info Block
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 44, 182, 38, 3, 3, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 44, 182, 38, 3, 3, 'S');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PRIMARY PASSENGER & RESERVATION DETAILS', 20, 53);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Lead Passenger: ${travelerName}`, 20, 62);
    doc.text(`Total Pax: ${paxCount} Travelers`, 20, 70);
    doc.text(`Status: CONFIRMED & PNR LOCKED`, 20, 78);

    doc.text(`Package: ${pkg.title}`, 105, 62);
    if ('makkahHotel' in pkg) {
      doc.text(`Makkah Stay: ${pkg.makkahHotel.name} (${pkg.makkahHotel.distanceLabel})`, 105, 70);
      doc.text(`Madinah Stay: ${pkg.madinahHotel.name}`, 105, 78);
    } else {
      doc.text(`Destination: ${pkg.destination}`, 105, 70);
      doc.text(`Duration: ${pkg.durationDays} Days / ${pkg.durationDays - 1} Nights`, 105, 78);
    }

    // Schedule / Itinerary
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('ITINERARY & LOGISTICS SCHEDULE', 14, 92);

    let y = 100;
    if ('ziyarahSites' in pkg) {
      pkg.ziyarahSites.forEach((site, index) => {
        doc.setFillColor(245, 247, 246);
        doc.roundedRect(14, y, 182, 14, 2, 2, 'F');

        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`Milestone ${index + 1}: [${site.city}] ${site.name}`, 18, y + 6);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(site.description, 18, y + 11);
        y += 18;
      });
    } else if ('days' in pkg) {
      pkg.days.forEach((day) => {
        doc.setFillColor(245, 247, 246);
        doc.roundedRect(14, y, 182, 16, 2, 2, 'F');

        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`Day ${day.dayNumber}: ${day.dayTitle}`, 18, y + 6);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`Activity: ${day.currentActivity.title} (${day.currentActivity.duration}) | Hotel: ${day.hotelName}`, 18, y + 12);
        y += 20;
      });
    }

    // Inclusions
    y += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('CONFIRMED INCLUSIONS & COMPLIMENTARY PERKS:', 14, y);
    y += 7;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text('• Direct Air-Conditioned VIP Ground Fleet Transfers throughout trip', 18, y);
    y += 5;
    doc.text('• 24/7 Dedicated Ground Concierge & Tour Leader (Mutawwif Guidance included)', 18, y);
    y += 5;
    doc.text('• 5-Liter Sealed Zamzam Water allowance packed per passenger', 18, y);
    y += 5;
    doc.text('• Ministry of Foreign Affairs / Nusuk Electronic Authorization verified', 18, y);

    // Digital Verification QR Simulation
    y += 12;
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(14, y, 24, 24);
    doc.setFontSize(7);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('[ DIGITAL QR ]', 16, y + 13);
    doc.text('SCAN TO VERIFY', 15, y + 17);

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Please present this official voucher upon hotel check-in and coach boarding.', 42, y + 8);
    doc.text('Emergency 24/7 Operations Hotline: +966 12 555 9821 / support@travelpulse.ai', 42, y + 15);

    // Footer
    doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.rect(0, 287, 210, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('TravelPulse AI Verified Reservation Engine — Riyadh • Dubai • London • Mumbai', 45, 293);

    doc.save(`TravelPulse_Voucher_${travelerName.replace(/\s+/g, '_')}.pdf`);
  }

  /**
   * 2. B2B White-Label Quotation PDF (Hiding wholesale rates, custom logo & agent branding)
   */
  static generateWhiteLabelQuotation(quote: QuotationRecord) {
    const doc = new jsPDF();
    const branding = quote.agencyBrandingSnapshot;

    // Header with Agency Custom Color
    doc.setFillColor(13, 148, 136); // Teal branding
    doc.rect(0, 0, 210, 38, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(branding.agencyName.toUpperCase(), 14, 18);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Official Quotation #${quote.quoteNumber} | License: ${branding.licenseNumber}`, 14, 26);
    doc.text(`Tel: ${branding.phone} | Email: ${branding.email}`, 14, 32);

    // Client Block
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 46, 182, 34, 3, 3, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 46, 182, 34, 3, 3, 'S');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text('PREPARED FOR CLIENT:', 20, 55);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Client Name: ${quote.clientName}`, 20, 63);
    doc.text(`Contact: ${quote.clientPhone} (${quote.clientEmail})`, 20, 71);

    doc.text(`Valid Until: ${quote.validUntil}`, 120, 63);
    doc.text(`Total Travelers: ${quote.pax} Persons`, 120, 71);

    // Proposal Details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 148, 136);
    doc.text('PROPOSED PACKAGE SPECIFICATIONS', 14, 90);

    doc.setFillColor(241, 245, 249);
    doc.rect(14, 95, 182, 10, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('DESCRIPTION', 18, 101);
    doc.text('QTY / PAX', 120, 101);
    doc.text('AMOUNT (USD)', 160, 101);

    doc.setFont('helvetica', 'normal');
    doc.text(quote.packageTitle, 18, 114);
    doc.text(`${quote.pax}`, 125, 114);
    doc.text(`$${quote.clientSellingPrice.toLocaleString()}`, 165, 114);

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 122, 196, 122);

    doc.text('VIP Airport Fast-Track & Meet & Greet Assistance', 18, 130);
    doc.text(`${quote.pax}`, 125, 130);
    doc.text('INCLUDED', 165, 130);

    doc.line(14, 138, 196, 138);

    // Notice: Supplier Wholesale Base Cost is COMPLETELY HIDDEN as required!
    doc.setFillColor(248, 250, 252);
    doc.rect(115, 148, 81, 28, 'F');
    doc.rect(115, 148, 81, 28, 'S');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Package Subtotal:', 120, 156);
    doc.text(`$${quote.clientSellingPrice.toLocaleString()}`, 168, 156);

    doc.text('Gov. Regulatory Fees & Taxes:', 120, 163);
    doc.text('$0.00 (Inclusive)', 160, 163);

    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 148, 136);
    doc.text('Grand Total:', 120, 172);
    doc.text(`$${quote.clientSellingPrice.toLocaleString()} USD`, 155, 172);

    // Terms & Agency Footer
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('TERMS & CONDITIONS:', 14, 190);
    doc.text(`• ${branding.footerDisclaimer}`, 14, 196);
    doc.text('• Flights and hotel room allotments are subject to availability at time of payment confirmation.', 14, 202);
    doc.text('• All quotes are legally issued under licensed travel agency regulations.', 14, 208);

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 287, 210, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(`Powered by ${branding.agencyName} • ${branding.address}`, 35, 293);

    doc.save(`Quotation_${quote.quoteNumber}_${quote.clientName.replace(/\s+/g, '_')}.pdf`);
  }

  /**
   * 3. Group Manifest PDF for Umrah & M.I.C.E.
   */
  static generateGroupManifest(title: string, paxList: Array<{ name: string; passport: string; roomType: string; busNo: string }>) {
    const doc = new jsPDF();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('GROUP PASSENGER MANIFEST & ROOMING ALLOCATION', 14, 16);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Group: ${title} | Total Passengers: ${paxList.length} | Generated: ${new Date().toLocaleDateString()}`, 14, 24);

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(14, 38, 182, 10, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('#', 18, 44);
    doc.text('PASSENGER FULL NAME', 30, 44);
    doc.text('PASSPORT NO.', 95, 44);
    doc.text('ROOM OCCUPANCY', 135, 44);
    doc.text('ASSIGNED COACH', 170, 44);

    let y = 54;
    paxList.forEach((pax, index) => {
      doc.setFont('helvetica', 'normal');
      doc.text(`${index + 1}`, 18, y);
      doc.text(pax.name, 30, y);
      doc.text(pax.passport, 95, y);
      doc.text(pax.roomType, 135, y);
      doc.text(pax.busNo, 170, y);

      doc.setDrawColor(241, 245, 249);
      doc.line(14, y + 4, 196, y + 4);
      y += 10;
    });

    doc.save(`Group_Manifest_${title.replace(/\s+/g, '_')}.pdf`);
  }

  /**
   * 4. Sequential Tax Invoice / Proforma PDF
   */
  static generateInvoicePdf(invoice: InvoiceDocument) {
    const doc = new jsPDF();
    const isProforma = invoice.type === 'proforma';

    // Header
    doc.setFillColor(isProforma ? 71 : 15, isProforma ? 85 : 23, isProforma ? 105 : 42);
    doc.rect(0, 0, 210, 36, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(isProforma ? 'PROFORMA INVOICE (NOT A DEMAND FOR PAYMENT)' : 'OFFICIAL TAX INVOICE', 14, 18);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Document Ref: ${invoice.invoiceNumber} | Issued: ${invoice.dateIssued} | Due: ${invoice.dueDate}`, 14, 27);

    // Issuer & Recipient details
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('ISSUED BY:', 14, 46);
    doc.text('BILLED TO:', 110, 46);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.issuerDetails.name, 14, 52);
    doc.text(`Tax Reg / TRN: ${invoice.issuerDetails.taxRegNumber}`, 14, 57);
    doc.text(invoice.issuerDetails.address, 14, 62);

    doc.text(invoice.clientOrAgencyName, 110, 52);
    doc.text(`Ref ID: ${invoice.bookingOrQuoteId}`, 110, 57);
    doc.text(`Payment Status: ${invoice.isPaid ? 'PAID & RECONCILED' : 'DUE / PENDING'}`, 110, 62);

    // Line Items
    let y = 74;
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y, 182, 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('ITEM DESCRIPTION', 18, y + 6);
    doc.text('QTY', 120, y + 6);
    doc.text('RATE ($)', 142, y + 6);
    doc.text('TOTAL ($)', 170, y + 6);

    y += 15;
    doc.setFont('helvetica', 'normal');
    invoice.items.forEach((item: any) => {
      doc.text(item.description, 18, y);
      doc.text(`${item.quantity}`, 122, y);
      doc.text(`$${item.unitPrice.toFixed(2)}`, 142, y);
      doc.text(`$${item.total.toFixed(2)}`, 170, y);
      y += 8;
    });

    doc.line(14, y + 2, 196, y + 2);
    y += 10;

    // Totals
    doc.text(`Subtotal:`, 140, y);
    doc.text(`$${invoice.subtotal.toFixed(2)}`, 170, y);
    y += 6;

    doc.text(`VAT/GST (${invoice.taxRatePercent}%):`, 140, y);
    doc.text(`$${invoice.taxAmount.toFixed(2)}`, 170, y);
    y += 7;

    doc.setFont('helvetica', 'bold');
    doc.text(`Grand Total:`, 140, y);
    doc.text(`$${invoice.grandTotal.toFixed(2)} USD`, 170, y);

    doc.save(`${invoice.type.toUpperCase()}_${invoice.invoiceNumber}.pdf`);
  }

  /**
   * 4. Universal Booking Confirmation Voucher & E-Ticket
   */
  static generateBookingVoucher(booking: BookingRecord) {
    const doc = new jsPDF();
    const primaryColor = booking.vertical === 'flight' 
      ? [37, 99, 235] // Blue for flights
      : booking.vertical === 'hotel' 
      ? [15, 23, 42] // Slate for hotels
      : [13, 92, 70]; // Emerald for Umrah / Visa / Holidays

    // Header Banner
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 38, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const headerTitle = booking.vertical === 'flight' 
      ? 'TRAVELPULSE — OFFICIAL FLIGHT E-TICKET & BOARDING PASS'
      : booking.vertical === 'hotel'
      ? 'TRAVELPULSE — OFFICIAL HOTEL RESERVATION VOUCHER'
      : 'TRAVELPULSE — OFFICIAL TRAVEL SERVICE VOUCHER';
    doc.text(headerTitle, 14, 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Confirmation Ref: ${booking.referenceCode} | Issued: ${new Date().toLocaleDateString()} | IATA/GDS Sync: ACTIVE`, 14, 28);

    // Primary Booking Badge Card
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 46, 182, 42, 3, 3, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, 46, 182, 42, 3, 3, 'S');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PASSENGER & RESERVATION SUMMARY', 20, 56);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Lead Traveler: ${booking.passenger.fullName}`, 20, 65);
    doc.text(`Email: ${booking.passenger.email}`, 20, 72);
    doc.text(`Passport: ${booking.passenger.passportNumber || 'N/A'} (${booking.passenger.nationality || 'Global'})`, 20, 79);

    doc.text(`Service: ${booking.title}`, 105, 65);
    doc.text(`Dates: ${booking.travelDates}`, 105, 72);
    doc.text(`Status: ${booking.status.toUpperCase()} (Guaranteed)`, 105, 79);

    // Barcode Simulation Card
    doc.setFillColor(241, 245, 249);
    doc.rect(14, 95, 182, 16, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`*PNR-${booking.referenceCode}-ETKT*`, 20, 103);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Present this barcode or electronic voucher upon terminal check-in or hotel reception.', 20, 108);

    // Details Breakdown
    let y = 122;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('RESERVATION BREAKDOWN & COMPLIANCE', 14, y);

    y += 10;
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Item / Service', 14, y);
    doc.text('Category', 110, y);
    doc.text('Total Amount', 160, y);

    y += 4;
    doc.line(14, y, 196, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(booking.title, 14, y);
    doc.text(booking.vertical.toUpperCase(), 110, y);
    doc.text(`$${booking.totalAmountUSD.toLocaleString()} USD`, 160, y);

    // Addons
    if (booking.addons && booking.addons.length > 0) {
      booking.addons.forEach(addon => {
        y += 7;
        doc.text(`+ ${addon.name}`, 18, y);
        doc.text('Included Addon', 110, y);
        doc.text(addon.priceUSD === 0 ? 'Complimentary' : `$${addon.priceUSD} USD`, 160, y);
      });
    }

    y += 12;
    doc.setFillColor(248, 250, 252);
    doc.rect(14, y, 182, 28, 'F');
    doc.rect(14, y, 182, 28, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('CORPORATE POLICY & VERIFICATION STATUS:', 20, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const policyDesc = booking.policyCompliance.inPolicy 
      ? `PASSED: Complies with enterprise travel policy caps. Approved by ${booking.policyCompliance.approvedBy || 'System Policy Guard'}.`
      : `PENDING / EXCEPTION: ${booking.policyCompliance.reason || 'Exceeds budget cap, awaiting manager sign-off.'}`;
    doc.text(policyDesc, 20, y + 16, { maxWidth: 170 });
    doc.text(`Payment Tender: ${booking.paymentMethod} • PCI-DSS Verified`, 20, y + 24);

    // Footer Terms
    y += 42;
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('TERMS & IMPORTANT DISCLOSURES:', 14, y);
    y += 5;
    doc.text('1. Photo ID matching passenger passport name is mandatory upon check-in.', 14, y);
    y += 4;
    doc.text('2. Umrah pilgrimages are synchronized with Saudi MOFA Nusuk protocol.', 14, y);
    y += 4;
    doc.text('3. In case of disruption or corporate travel change, contact TravelPulse 24/7 Desk at +1-800-PULSE-AI.', 14, y);

    doc.save(`VOUCHER_${booking.referenceCode}.pdf`);
  }
}
