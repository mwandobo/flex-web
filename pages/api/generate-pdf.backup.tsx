import puppeteer from 'puppeteer';

export default async function handler(req, res) {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/documents/generate-pdf', {
            headers: {
                'Authorization': `Bearer ${req.headers.authorization}`, // Pass the token if needed
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            res.status(response.status).json({ message: 'Error generating PDF' });
            return;
        }

        const pdfBlob = await response.blob();
        const buffer = Buffer.from(await pdfBlob.arrayBuffer());



        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating PDF' });
    }
}
