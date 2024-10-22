"use client";
import React from 'react';

const DocumentViewer = ({ data }) => {
    const fileUrl = data.file_url;

    const isImage = (url) => /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(url);
    const isDocument = (url) => /\.(pdf|doc|docx|xls|xlsx)$/i.test(url);

    return (
        <div className="flex justify-start items-start mt-2" style={{ maxHeight: '60vh', overflow: 'hidden' }}>
            {isImage(fileUrl) ? (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    <img
                        src={fileUrl}
                        alt="Document Preview"
                        style={{
                            maxWidth: '100%', // Ensure the image doesn't exceed container width
                            maxHeight: '60vh', // Set max height for the image
                            objectFit: 'contain', // Preserve aspect ratio
                            display: 'block', // Prevent inline spacing issues
                        }}
                    />
                </a>
            ) : isDocument(fileUrl) ? (
                <div className="flex gap-3 items-center">
                    <p className="text-sm">Document: </p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline text-blue-500">
                        {fileUrl.split('/').pop()} {/* Display only the file name */}
                    </a>
                </div>
            ) : (
                <span className="text-red-500">Unsupported file type</span>
            )}
        </div>
    );
};

export default DocumentViewer;
