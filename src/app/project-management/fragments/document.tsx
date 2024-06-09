'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getValueFromLocalStorage } from '@/utils/actions/local-starage';
import PopupModal from '@/components/modal/popup-modal';
import MuiBreadcrumbs from '@/components/breadcumb/mui-breadcumb';
import { ReusableButton } from '@/components/button/reusable-button';
import { Upload } from 'lucide-react';
import TextFieldComponent from '@/components/inputs/text-field';
import TextArea from '@/components/inputs/text-area';
import { Input } from '@mui/material';
import MuiTable from '@/components/tables/mui-table';
import { baseURL, get } from '@/utils/api';
import CrudButtonsComponent from '@/components/crud-operator-buttons';
interface Props {
    project_id: string
    activity_id: string
}

const FileUploadForm = (
    {
        project_id = '1',
        activity_id = '1'
    }: Props) => {
    const [file, setFile] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [isRefresh, setIsFresh] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [selected, setSelected] = useState('');
    const [action, setAction] = useState('store');
    const [description, setDescription] = useState('');

    const columns = [
        {
            id: 'file',
            numeric: false,
            hasUrl: true,
            disablePadding: false,
            label: 'File',
            width: '30%',
        },
        {
            id: 'description',
            numeric: false,
            disablePadding: false,
            label: 'Description',
            width: '65%',
        },
        {
            id: 'actions',
            numeric: false,
            disablePadding: false,
            label: 'Actions',
            width: '65%',
        },
    ]

    const url = `${baseURL}/file_upload/${project_id}/activity/${activity_id}`

    const handleClick = (type: string, payload?: any) => {

        if (type.toLowerCase() === 'create') {
            setIsModalOpen(true)
            setAction('Save')
        }

        if (type.toLowerCase() === 'edit') {
            setIsModalOpen(true)
            setName(payload.name)
            setDescription(payload.description)
            setFile(payload.file)
            setSelected(payload.id)
            setAction('Update')
        }

        if (type.toLowerCase() === 'delete') {
            setAction('Delete')
            setSelected(payload.id)
            setIsModalOpen(true)
        }
    }


    const token = getValueFromLocalStorage('token')

    const closeModel = () => {
        setIsModalOpen(false)
        clearForm()
    }


    const handleInputChange = (e: any, from?: any) => {
        if (from === 'name') {
            setName(e.target.value)
        }
        if (from === 'description') {
            setDescription(e.target.value)
        }
        if (from === 'file') {
            setFile(e.target.files[0]);
        }
    }

    const clearForm = () => {
        setName('')
        setDescription('')
        setFile('')
    }

    const handleSubmit = async (e, from?: string) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('description', description);

        const strippedToken = token?.substring(1, token.length - 1)

        try {
            let response;

            if (action === 'Save') {
                const final_url = `${url}/store`
                response = await axios.post(final_url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${strippedToken}`, // Include your token
                    },
                });
            }


            if (action === 'Update') {
                const final_url = `${url}/update/${selected}`
                response = await axios.put(final_url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${strippedToken}`, // Include your token
                    },
                });
            }


            if (action === 'Delete') {
                const final_url = `${url}/delete/${selected}`
                response = await axios.delete(final_url, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${strippedToken}`, // Include your token
                    },
                });
            }


            if (response.status === 200 || response.status === 201) {
                closeModel()
                setIsFresh(!isRefresh)
                console.log('Upload success:', response.data);
            }

        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const createFileRow = (input: any,) => {
        let row: any;
        row = [
            <p key={input.id} className="mb-1"><a href={input.location} className="text-blue-600 border-b border-gray-300">{input.name}</a></p>,
            input.description,
            <CrudButtonsComponent
                key={input.id + 'cr'}
                hide_approve={true}
                handleClick={handleClick}
                input={input}
                hide_view={true}
            />
        ]

        return row
    }

    const customFilesFunction = () => {
        let payload: any[] = []

        data.forEach((item: any) => {
            const row = createFileRow(item)
            payload.push(row)
        })

        return payload
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await get(url, token)
            if (res.status === 200) {
                setData(res.data.data)
                setLoading(false)
            }
        };
        fetchData()
    }, [isRefresh])

    return (
        <>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <div className='flex flex-col justify-between'>
                            <div className="flex justify-between space-x-2">
                                <MuiBreadcrumbs links={[{ name: 'Documents Upload', linkTo: '/', permission: '' }]} />
                                < div className=''>
                                    <ReusableButton
                                        name='Upload'
                                        onClick={() => handleClick('create')}
                                    >
                                        <Upload size={13} />
                                    </ReusableButton>
                                </div>
                            </div>

                            <MuiTable
                                data={customFilesFunction()}
                                columns={columns}
                            />

                        </div>

                        <PopupModal
                            isOpen={isModalOpen}
                            onSaveButtonName={'Save'}
                            onClose={closeModel}
                            isDisabled={isDisabled}
                            title={"Document"}
                        >
                            <form onSubmit={handleSubmit}>
                                {
                                    action === 'Delete' ? <p>Are you sure you want to delete this document</p> :
                                        <>
                                            < Input
                                                type="file"
                                                onChange={(event: any) => handleInputChange(event, 'file')}
                                                className='mb-5 w-full border-gray-600'

                                            />
                                            <TextFieldComponent
                                                placeholder={"Name"}
                                                from={"name"}
                                                label={"Name"}
                                                value={name}
                                                onChange={handleInputChange}
                                            />
                                            <TextArea
                                                onChange={handleInputChange}
                                                from={'description'}
                                                label={"Description"}
                                                value={description}
                                            />
                                        </>
                                }

                                <ReusableButton
                                    name={action}
                                    type='submit'
                                />
                                {/* <button type="submit">Upload</button> */}
                            </form>

                        </PopupModal>
                    </>
            }

        </>

    );
};

export default FileUploadForm;