'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { getValueFromLocalStorage } from '@/utils/actions/local-starage';

interface Props {
    url: string
}

const FileUploadForm = ({
    url
}: Props
) => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const token = getValueFromLocalStorage('token')

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('description', description);

        const strippedToken = token?.substring(1, token.length - 1)

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/file_upload/store', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${strippedToken}`, // Include your token
                },
            });
            console.log('Upload success:', response.data);
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button type="submit">Upload</button>
        </form>
    );
};

export default FileUploadForm;