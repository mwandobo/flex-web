import puppeteer from 'puppeteer';

export default async function handler(req, res) {
    const content = req.body.content; // Replace with your content fetching logic

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // const html = ReactDOMServer.renderToStaticMarkup(content);
        // const formattedHtml = await prettier.format(html, { parser: 'html' });

        await page.setContent(content, { waitUntil: 'networkidle0' }); // Wait for page to load

        const pdfBuffer = await page.pdf({ format: 'A4' }); // Adjust format as needed

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating PDF' });
    }
}
