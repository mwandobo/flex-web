import { Download, FileDown } from 'lucide-react';
import React, { useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { ReusableButton } from '../button/reusable-button';

const GeneratePdf = ({ content, fileName = 'document.pdf', buttonLabel = 'Download PDF' }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false)

    const [pdfUrl, setPdfUrl] = useState(null);

    const refreshDownloadButton = () => {
        setIsDownloading(false)
        setPdfUrl(null)
    }

    const handleGeneratePdf = async () => {
        setIsLoading(true);

        try {
            // Render the content to a static HTML string
            const renderedContent = ReactDOMServer.renderToStaticMarkup(content);

            // Wrap content in a full HTML document with Tailwind CSS
            const fullHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                <title>PDF Document</title>
            </head>
            <body class="p-8">
                <!-- Company Header -->
                <header class="flex justify-between items-center mb-8">
                    <div class="flex items-center">
                        <img src="/logo.png" alt="Company Logo" class="h-12 w-auto mr-4">
                        <div>
                            <h1 class="text-xl font-bold">Your Company Name</h1>
                            <p class="text-sm">www.your-company-website.com</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm">1234 Street Name</p>
                        <p class="text-sm">City, State, ZIP</p>
                        <p class="text-sm">Phone: (123) 456-7890</p>
                        <p class="text-sm">Email: info@your-company.com</p>
                    </div>
                </header>
        
                <!-- Report Content -->
                ${renderedContent}
            </body>
            </html>
        `;


            const response = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: fullHtml }),
            });

            if (response.ok) {
                const pdfBlob = await response.blob();
                const pdfUrl = URL.createObjectURL(pdfBlob);
                setIsDownloading(true)

                setPdfUrl(pdfUrl);
            } else {
                console.error('Error generating PDF');
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const buttonDownloadComponent = () => {
        return (
            <>
                {
                    isLoading ?
                        <p className="text-xs">Generating PDF ...</p>
                        :
                        <>
                            {
                                isDownloading ?
                                    <div className="flex gap-3 items-center">
                                        <p className="text-xs">{fileName}</p>
                                        <a className="flex text-xs items-center text-blue-700 shadow px-2 py-1 hover:bg-green-600 hover:text-white hover:px-3  hover:py-1"
                                            href={pdfUrl} download={fileName}
                                            onClick={refreshDownloadButton}>
                                            <Download className="me-1" size={15} /> Download PDF
                                        </a>
                                    </div>
                                    :
                                    < div className=''>
                                        <ReusableButton
                                            name={'Download'}
                                            onClick={() => handleGeneratePdf()}
                                        >
                                            <FileDown size={15} />
                                        </ReusableButton>
                                    </div>
                            }
                        </>
                }
            </>
        )
    }

    return buttonDownloadComponent()

};

export default GeneratePdf;
