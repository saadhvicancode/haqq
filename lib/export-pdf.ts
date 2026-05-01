import jsPDF from "jspdf";

interface ExportMessage {
  role: string;
  content: string;
  timestamp: string;
}

export function exportChatToPDF(messages: ExportMessage[]): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 20;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  const HEADER_H = 22;
  const FOOTER_H = 14;
  const CONTENT_TOP = MARGIN + HEADER_H;
  const CONTENT_BOTTOM = PAGE_H - MARGIN - FOOTER_H;
  const LINE_H_LABEL = 6.5;
  const LINE_H_TEXT = 5.8;

  const now = new Date();
  const dateStr = now.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const fileDate = now.toISOString().split("T")[0];

  const drawHeader = () => {
    doc.setFontSize(9);
    doc.setTextColor(136, 136, 136);
    doc.setFont("helvetica", "bold");
    doc.text("HAQQ — Confidential Legal Conversation", MARGIN, MARGIN + 5);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${dateStr}`, MARGIN, MARGIN + 10);
    doc.text(
      "This conversation is private. Share only with a trusted lawyer or support worker.",
      MARGIN,
      MARGIN + 15
    );
    doc.setDrawColor(210, 210, 210);
    doc.line(MARGIN, MARGIN + 18, PAGE_W - MARGIN, MARGIN + 18);
  };

  const drawFooter = (page: number, total: number) => {
    doc.setFontSize(8);
    doc.setTextColor(136, 136, 136);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Haqq is a legal guide, not a lawyer. For free legal aid contact NALSA at nalsa.gov.in or call 181.",
      MARGIN,
      PAGE_H - MARGIN - 4
    );
    doc.text(`Page ${page} of ${total}`, PAGE_W - MARGIN, PAGE_H - MARGIN - 4, {
      align: "right",
    });
  };

  drawHeader();
  let y = CONTENT_TOP;

  for (const msg of messages) {
    const isUser = msg.role === "user";
    const label = isUser ? "You" : "Haqq";

    // Start a new page if there's not enough room for at least the label + 2 lines
    if (y + LINE_H_LABEL + LINE_H_TEXT * 2 + 8 > CONTENT_BOTTOM) {
      doc.addPage();
      drawHeader();
      y = CONTENT_TOP;
    }

    // Label (bold, coloured)
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    if (isUser) {
      doc.setTextColor(13, 115, 119); // #0D7377
    } else {
      doc.setTextColor(51, 51, 51); // #333333
    }
    doc.text(`${label}:`, MARGIN, y);

    // Timestamp (grey, smaller, inline after label)
    const labelWidth = doc.getTextWidth(`${label}: `);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(136, 136, 136);
    doc.text(msg.timestamp, MARGIN + labelWidth, y);

    y += LINE_H_LABEL;

    // Message body
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(26, 26, 26);

    const lines = doc.splitTextToSize(msg.content, CONTENT_W);
    for (const line of lines) {
      if (y + LINE_H_TEXT > CONTENT_BOTTOM) {
        doc.addPage();
        drawHeader();
        y = CONTENT_TOP;
      }
      doc.text(line, MARGIN, y);
      y += LINE_H_TEXT;
    }

    // Thin divider
    y += 3;
    if (y + 4 < CONTENT_BOTTOM) {
      doc.setDrawColor(220, 220, 220);
      doc.line(MARGIN, y, PAGE_W - MARGIN, y);
      y += 5;
    }
  }

  // Footers on every page
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    drawFooter(p, total);
  }

  doc.save(`haqq-conversation-${fileDate}.pdf`);
}
