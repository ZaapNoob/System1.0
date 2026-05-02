// src/utils/printTicket.js

/**
 * Print queue ticket to XPrinter thermal printer (58mm)
 * Controls output format, margins, and paper size for thermal paper
 */
export const printQueueTicket = ({ queueCode, patientName, queueType }) => {
  const printWindow = window.open('', '', 'width=300,height=500');
  
  // Generate timestamp
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  
  const content = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Queue Ticket Print</title>
        <style>
          /* CRITICAL: Remove all margins and padding */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          /* Page setup for 58mm thermal paper */
          @page {
            size: 58mm auto;
            margin: 0;
            padding: 0;
          }

          html, body {
            width: 58mm;
            height: auto;
            margin: 0;
            padding: 0;
            font-family: 'Courier New', monospace;
            background: white;
            color: black;
          }

          /* Main ticket container */
          .ticket {
            width: 58mm;
            padding: 4mm 2mm;
            text-align: center;
            line-height: 1.3;
            font-size: 10pt;
          }

          /* Queue number - LARGE */
          .queue-code {
            font-size: 36pt;
            font-weight: bold;
            letter-spacing: 2pt;
            margin: 4mm 0;
            line-height: 1.1;
          }

          /* Queue type label */
          .queue-type {
            font-size: 14pt;
            font-weight: bold;
            margin: 3mm 0;
            letter-spacing: 1pt;
          }

          /* Patient name */
          .patient-name {
            font-size: 14pt;
            margin: 4mm 0;
            word-wrap: break-word;
            overflow-wrap: break-word;
            font-weight: bold;
          }

          /* Divider line */
          .divider {
            border-top: 1px dashed #000;
            margin: 3mm 0;
            padding-top: 2mm;
          }

          /* Timestamp */
          .timestamp {
            font-size: 12pt;
            line-height: 1.4;
            font-weight: bold;
          }

          /* Footer spacing */
          .footer {
            margin-top: 3mm;
            font-size: 7pt;
            color: #444;
          }

          /* Print-specific rules */
          @media print {
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }
            .ticket {
              margin: 0 !important;
              break-after: always;
            }
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <!-- Queue number -->
          <div class="queue-code">${queueCode}</div>

          <!-- Queue type -->
          <div class="queue-type">
            ${queueType === 'PRIORITY' ? '*** PRIORITY ***' : 'REGULAR'}
          </div>

          <!-- Patient name -->
          <div class="patient-name">
            ${patientName}
          </div>

          <!-- Divider -->
          <div class="divider"></div>

          <!-- Timestamp -->
          <div class="timestamp">
            <div>${dateStr}</div>
            <div>${timeStr}</div>
          </div>

          <!-- Footer -->
          <div class="footer">
            Thank you
          </div>
        </div>

        <script>
          // Auto print on load
          window.addEventListener('load', function() {
            setTimeout(function() {
              window.print();
            }, 100);
          });
          
          // Close after print
          window.addEventListener('afterprint', function() {
            window.close();
          });
        </script>
      </body>
    </html>
  `;
  
  printWindow.document.write(content);
  printWindow.document.close();
  
  return { success: true, method: 'thermal-optimized' };
};