import jsPDF from "jspdf";
import autoTable, { type RowInput } from "jspdf-autotable";
import logo from "../../../public/logo.png";

type Order = {
  id?: string | number;
  created_at?: string;
  users?: {
    full_name?: string;
    email?: string;
  };
  course?: {
    title?: string;
    price?: number;
  };
  status?: string;
};

export const generateInvoicePDF = (order: Order) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // ========= HEADER =========
  // Logo
  doc.addImage(logo, "PNG", 40, 30, 120, 40);

  // Company Info (right side)
  doc.setFontSize(11);
  doc.setTextColor("#444");
  doc.text("Surmad Technologies", pageWidth - 200, 50);
  doc.text("support@surmad.com", pageWidth - 200, 65);
  doc.text("www.surmad.com", pageWidth - 200, 80);

  // Invoice Title
  doc.setFontSize(22);
  doc.setTextColor("#222");
  doc.text("INVOICE", 40, 110);

  // Header line
  doc.setDrawColor(220, 220, 220);
  doc.line(40, 120, pageWidth - 40, 120);

  // ========= DETAILS SECTION =========
  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    : "N/A";

  // Left column (Invoice info)
  doc.setFontSize(12);
  doc.setTextColor("#333");
  doc.text(`Invoice #: ${order.id || "N/A"}`, 40, 150);
  doc.text(`Date: ${formattedDate}`, 40, 170);

  // Right column (Customer info)
  doc.setFontSize(12);
  doc.setTextColor("#1D4ED8");
  doc.text("Billed To:", pageWidth - 240, 150);
  doc.setTextColor("#111");
  doc.text(`${order.users?.full_name || "N/A"}`, pageWidth - 240, 170);
  doc.text(`${order.users?.email || "N/A"}`, pageWidth - 240, 185);

  // ========= ITEMS TABLE =========
  autoTable(doc, {
    startY: 220,
    head: [["Course", "Price", "Status"]],
    body: [
      [
        order.course?.title || "N/A",
        `$${order.course?.price?.toFixed(2) ?? "—"}`,
        order.status ?? "N/A",
      ],
    ] as RowInput[],
    headStyles: {
      fillColor: "#1D4ED8",
      textColor: "#fff",
      fontStyle: "bold",
      fontSize: 13,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 12,
      textColor: "#222",
      halign: "center",
    },
    alternateRowStyles: { fillColor: "#F9FAFB" },
    styles: { cellPadding: 8 },
    margin: { left: 40, right: 40 },
    theme: "grid",
  });

  // ========= SUMMARY BOX =========
  const finalY = (doc as any).lastAutoTable?.finalY ?? 320;
  doc.setFillColor(245, 248, 255);
  doc.roundedRect(pageWidth - 220, finalY + 20, 180, 70, 8, 8, "F");

  doc.setFontSize(12);
  doc.setTextColor("#1D4ED8");
  doc.text("Total", pageWidth - 200, finalY + 45);

  doc.setFontSize(16);
  doc.setTextColor("#111");
  doc.text(
    `$${order.course?.price?.toFixed(2) ?? "—"}`,
    pageWidth - 200,
    finalY + 70
  );

  // ========= FOOTER =========
  doc.setDrawColor(220, 220, 220);
  doc.line(40, finalY + 120, pageWidth - 40, finalY + 120);

  doc.setFontSize(11);
  doc.setTextColor("#555");
  doc.text("Thank you for your order!", 40, finalY + 145);

  doc.setFontSize(9);
  doc.setTextColor("#777");
  doc.text(
    "This invoice was generated electronically and is valid without a signature.",
    40,
    finalY + 165
  );
  doc.text(
    "Surmad Technologies © 2025. All rights reserved.",
    40,
    finalY + 180
  );

  // ========= SAVE =========
  doc.save(`invoice_${order.id || "order"}.pdf`);
};
