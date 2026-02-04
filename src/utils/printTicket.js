// src/utils/printTicket.js

// Browser print dialog
export const printQueueTicket = ({ queueCode, patientName, queueType }) => {
  const printWindow = window.open('', '', 'height=400,width=600');
  const content = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Queue Ticket</title>
        <style>
          body { font-family: monospace; text-align: center; padding: 20px; }
          .ticket { border: 2px solid #000; padding: 20px; width: 300px; margin: 0 auto; }
          .number { font-size: 48px; font-weight: bold; margin: 20px 0; }
          .label { font-size: 14px; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="label">QUEUE TICKET</div>
          <div class="number">${queueCode}</div>
          <div class="label">Patient: ${patientName}</div>
          <div class="label">Type: ${queueType}</div>
          <div style="margin-top: 20px; border-top: 1px dashed #000; padding-top: 10px; font-size: 12px;">
            ${new Date().toLocaleString()}
          </div>
        </div>
        <script>
          window.print();
          window.onafterprint = function() { window.close(); };
        </script>
      </body>
    </html>
  `;
  
  printWindow.document.write(content);
  printWindow.document.close();
  
  return { success: true, method: 'browser' };
};
