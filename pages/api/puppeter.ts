import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const url = req.query.url as string; // Get URL from query parameter

    try {
        const browser = await puppeteer.launch(); // Launch Chromium browser
        const page = await browser.newPage(); // Create a new page

        await page.goto(url); // Navigate to the target URL

        // Your Puppeteer automation logic here

        // Example: Get page title
        const title = await page.title();

        await browser.close(); // Close the browser

        res.status(200).json({ title }); // Send response with extracted data
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error: ' + error.message });
    }
}
