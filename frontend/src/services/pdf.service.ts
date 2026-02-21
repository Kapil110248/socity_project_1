import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const PDFService = {
    generateInvoicePDF: (invoice: any, societyName: string = 'SocietyHub Management') => {
        try {
            console.log('PDFService: Starting PDF generation for invoice:', invoice.invoiceNo || invoice.id);

            const doc = new jsPDF();

            // Add branding
            doc.setFontSize(22);
            doc.setTextColor(30, 58, 95); // #1e3a5f
            doc.text(societyName, 14, 22);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text('Smart Living, Simplified', 14, 28);

            // Header Info
            doc.setFontSize(16);
            doc.setTextColor(0);
            doc.text('INVOICE', 14, 45);

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Invoice No: ${invoice.invoiceNo || invoice.id}`, 14, 55);
            doc.text(`Date: ${invoice.issueDate || new Date().toLocaleDateString()}`, 14, 60);
            doc.text(`Due Date: ${invoice.dueDate || 'N/A'}`, 14, 65);

            // Resident Info
            doc.text('Bill To:', 120, 45);
            doc.setFont('helvetica', 'bold');
            const residentName = typeof invoice.resident === 'string' ? invoice.resident : (invoice.resident?.name || 'Resident');
            doc.text(residentName, 120, 50);
            doc.setFont('helvetica', 'normal');
            const unitInfo = typeof invoice.unit === 'string' ? invoice.unit : (invoice.unit ? `${invoice.unit.block}-${invoice.unit.number}` : 'N/A');
            doc.text(`Unit: ${unitInfo}`, 120, 55);
            doc.text(`Phone: ${invoice.phone || invoice.resident?.phone || 'N/A'}`, 120, 60);

            // Table
            const tableColumn = ["Description", "Quantity", "Amount (INR)"];
            let tableRows = [];

            if (invoice.items && invoice.items.length > 0) {
                tableRows = invoice.items.map((item: any) => [
                    item.name,
                    "1",
                    item.amount.toLocaleString()
                ]);
            } else {
                tableRows = [
                    ["Maintenance Charges", "1", (invoice.maintenance || 0).toLocaleString()],
                    ["Utility Charges", "1", (invoice.utilities || 0).toLocaleString()],
                    ["Penalty / Late Fee", "1", (invoice.penalty || 0).toLocaleString()],
                ];
            }

            autoTable(doc, {
                startY: 80,
                head: [tableColumn],
                body: tableRows,
                theme: 'striped',
                headStyles: { fillColor: [30, 58, 95], textColor: [255, 255, 255] },
                margin: { top: 80 },
            });

            // Summary
            const finalY = (doc as any).lastAutoTable.finalY + 10;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`Total Amount: INR ${(invoice.amount || 0).toLocaleString()}`, 140, finalY);

            if (invoice.status === 'paid') {
                doc.setTextColor(0, 128, 0);
            } else {
                doc.setTextColor(255, 140, 0);
            }
            doc.text(`Status: ${(invoice.status || 'PENDING').toUpperCase()}`, 140, finalY + 7);

            // Footer
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text('This is a computer generated invoice and does not require a signature.', 14, 280);

            console.log('PDFService: Saving PDF...');
            doc.save(`invoice_${invoice.invoiceNo || invoice.id}.pdf`);
            console.log('PDFService: PDF generated successfully.');
        } catch (error) {
            console.error('PDFService: Error generating PDF:', error);
            throw error;
        }
    }
};
