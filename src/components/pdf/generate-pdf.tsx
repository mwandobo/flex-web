import { Download, FileDown } from 'lucide-react';
import React, { useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { ReusableButton } from '../button/reusable-button';
import { nextBaseURL } from '@/utils/api';

const GeneratePdf = ({ content, fileName = 'document.pdf', buttonLabel = 'Download PDF' }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false)
    const imageUrl = `${nextBaseURL}/logo.png`

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
                <header class="flex justify-between items-center mb-8 px-8">
                    <div class="flex items-center">
                        <img src=${imageUrl} alt="Company Logo" class="h-12 w-auto mr-4">
                        <div>
                            <h1 class="text-xl font-bold">Flex Projects</h1>
                            <p class="text-sm">www.flex.com</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm">Second Floor Aficana Tower, Africana</p>
                        <p class="text-sm">Dar es Salaam, Tanzania</p>
                        <p class="text-sm">Phone: +255 687 199 133</p>
                        <p class="text-sm">Email: support@flex.co.tz</p>
                    </div>
                </header>
                
                ${renderedContent}
                <!-- Report Content -->
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
                                            rounded={'md'}
                                            padding={'p-1'}
                                            shadow={'shadow-md'}
                                            bg_color={'bg-gray-50'}
                                            hover={'hover:bg-gray-200 hover:border-gray-400'}
                                            hover_text={'hover:text-gray-900 hover:font-semibold'}
                                            border={'border border-gray-300'}
                                            text_color={'text-gray-700'}
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
