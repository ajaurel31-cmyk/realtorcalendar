import { CalendarPost, AgentProfile, CATEGORY_LABELS } from '@/types';

export function exportToCSV(posts: CalendarPost[], profile: AgentProfile): void {
  const headers = ['Date', 'Category', 'Caption', 'Platforms', 'Best Time', 'Suggested Image', 'Hashtags', 'Notes'];
  const rows = posts
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((post) => [
      post.date,
      CATEGORY_LABELS[post.category],
      `"${post.caption.replace(/"/g, '""')}"`,
      post.platforms.join(', '),
      post.bestTimeToPost,
      `"${post.suggestedImageType}"`,
      post.hashtags.join(' '),
      `"${post.notes.replace(/"/g, '""')}"`,
    ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadFile(csv, `content-calendar-${profile.name || 'export'}.csv`, 'text/csv');
}

export function exportToICS(posts: CalendarPost[], profile: AgentProfile): void {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Realtor Content Calendar//EN',
    `X-WR-CALNAME:${profile.name || 'Agent'}'s Content Calendar`,
  ];

  for (const post of posts.sort((a, b) => a.date.localeCompare(b.date))) {
    const dateStr = post.date.replace(/-/g, '');
    const uid = `${post.id}@realtorcalendar`;
    const summary = `[${CATEGORY_LABELS[post.category]}] Post: ${post.caption.slice(0, 60)}...`;
    const description = post.caption.replace(/\n/g, '\\n').replace(/,/g, '\\,');

    lines.push(
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      `UID:${uid}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}\\n\\nPlatforms: ${post.platforms.join(', ')}\\nBest Time: ${post.bestTimeToPost}\\nImage: ${post.suggestedImageType}`,
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  const ics = lines.join('\r\n');
  downloadFile(ics, `content-calendar-${profile.name || 'export'}.ics`, 'text/calendar');
}

export async function exportToPDF(
  posts: CalendarPost[],
  profile: AgentProfile,
  year: number,
  month: number
): Promise<void> {
  const { default: jsPDF } = await import('jspdf');

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Title
  doc.setFontSize(20);
  doc.setTextColor(99, 102, 241);
  doc.text(`${monthNames[month]} ${year} Content Calendar`, pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`${profile.name || 'Agent'} | ${profile.brokerage || 'Brokerage'} | ${profile.city || 'City'}`, pageWidth / 2, 22, { align: 'center' });

  // Calendar grid
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const gridTop = 28;
  const cellWidth = (pageWidth - margin * 2) / 7;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const numRows = Math.ceil((firstDay + daysInMonth) / 7);
  const cellHeight = Math.min(28, (pageHeight - gridTop - margin) / (numRows + 1));

  // Day headers
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  dayLabels.forEach((label, i) => {
    doc.text(label, margin + i * cellWidth + cellWidth / 2, gridTop + 3, { align: 'center' });
  });

  // Grid lines and content
  const postMap = new Map<string, CalendarPost>();
  posts.forEach((p) => postMap.set(p.date, p));

  const categoryColors: Record<string, [number, number, number]> = {
    listing: [34, 197, 94],
    educational: [59, 130, 246],
    branding: [245, 158, 11],
    engagement: [168, 85, 247],
  };

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < 7; col++) {
      const dayIndex = row * 7 + col - firstDay + 1;
      const x = margin + col * cellWidth;
      const y = gridTop + 6 + row * cellHeight;

      // Cell border
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.rect(x, y, cellWidth, cellHeight);

      if (dayIndex >= 1 && dayIndex <= daysInMonth) {
        // Day number
        doc.setFontSize(7);
        doc.setTextColor(30, 41, 59);
        doc.text(String(dayIndex), x + 2, y + 4);

        // Post indicator
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayIndex).padStart(2, '0')}`;
        const post = postMap.get(dateStr);
        if (post) {
          const color = categoryColors[post.category] || [100, 100, 100];
          doc.setFillColor(color[0], color[1], color[2]);
          doc.roundedRect(x + 1.5, y + 6, cellWidth - 3, cellHeight - 8, 1, 1, 'F');

          doc.setFontSize(5);
          doc.setTextColor(255, 255, 255);
          const label = CATEGORY_LABELS[post.category];
          doc.text(label, x + cellWidth / 2, y + 10, { align: 'center' });

          // Truncated caption
          const maxChars = Math.floor(cellWidth / 1.5);
          const shortCaption = post.caption.replace(/[^\x20-\x7E]/g, '').slice(0, maxChars) + '...';
          doc.setFontSize(4);
          doc.text(shortCaption, x + 2, y + 14, { maxWidth: cellWidth - 4 });
        }
      }
    }
  }

  // Legend
  const legendY = pageHeight - 8;
  doc.setFontSize(7);
  let legendX = margin;
  Object.entries(categoryColors).forEach(([cat, color]) => {
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(legendX, legendY - 2, 4, 4, 0.5, 0.5, 'F');
    doc.setTextColor(71, 85, 105);
    doc.text(CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS], legendX + 6, legendY + 1);
    legendX += 40;
  });

  // Post details page
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(99, 102, 241);
  doc.text('Post Details', margin, 15);

  let detailY = 25;
  const sortedPosts = [...posts].sort((a, b) => a.date.localeCompare(b.date));

  for (const post of sortedPosts) {
    if (detailY > pageHeight - 30) {
      doc.addPage();
      detailY = 15;
    }

    const color = categoryColors[post.category] || [100, 100, 100];
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(margin, detailY - 2, 3, 6, 0.5, 0.5, 'F');

    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(`${post.date} — ${CATEGORY_LABELS[post.category]}`, margin + 5, detailY + 2);

    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    const captionClean = post.caption.replace(/[^\x20-\x7E]/g, ' ');
    const lines = doc.splitTextToSize(captionClean, pageWidth - margin * 2 - 5);
    doc.text(lines.slice(0, 3), margin + 5, detailY + 7);

    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.text(`Platforms: ${post.platforms.join(', ')} | Time: ${post.bestTimeToPost} | Image: ${post.suggestedImageType}`, margin + 5, detailY + 7 + lines.slice(0, 3).length * 3 + 2);

    detailY += 12 + lines.slice(0, 3).length * 3;
  }

  doc.save(`content-calendar-${monthNames[month]}-${year}.pdf`);
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
