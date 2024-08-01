"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { ReusableButton } from '@/components/button/reusable-button'
import PageHeader from '@/components/header/page-header'
import { getValueFromLocalStorage } from '@/utils/actions/local-starage'
import { baseURL, get } from '@/utils/api'
import { Download, FileDown } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const ProjectCharterShow = ({ params }: { params: { projectCharterId: string } }) => {
    const id = params.projectCharterId
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [pdfData, setPdfData] = useState<any>(null);
    const [isloadingGenaratePdf, setIsLoadingGeneratePdf] = useState(false)
    const token = getValueFromLocalStorage('token')

    const url = `reports/gantt-chart/show/${id}`

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                setLoading(true)
                const res = await get(url, token)
                if (res && res.status === 200) {
                    setData(res.data.data)
                    setLoading(false)
                }
            }
        };
        fetchData()
    }, [url, token])

    const handleClick = async () => {
        return await generatePdf()
    }

    const refreshDownloadButton = () => {
        setIsDownloading(false)
    }

    const generatePdf = async () => {
        const strippedToken = token?.substring(1, token.length - 1)

        setIsLoadingGeneratePdf(true);
        try {
            const response = await fetch(`${baseURL}/reports/generate_pdf/${id}`, {
                headers: {
                    'Authorization': `Bearer ${strippedToken}`, // Include token if authentication is required
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const pdfBlob = await response.blob();

            setPdfData(URL.createObjectURL(pdfBlob));
            setIsDownloading(true);
        } catch (error) {
            console.error('Error in testFetch', error);
        } finally {
            setIsLoadingGeneratePdf(false);
        }
    };


    const ButtonDownloadComponent = () => {
        return (
            <>
                {
                    isloadingGenaratePdf ?
                        <p className="text-xs">Generating PDF ...</p>
                        :
                        <>
                            {
                                isDownloading ?
                                    <div className="flex gap-3 items-center">
                                        <p className="text-xs">{`${data.project_name}.pdf`}</p>
                                        <a className="flex text-xs items-center text-blue-700 shadow px-2 py-1 hover:bg-green-600 hover:text-white hover:px-3  hover:py-1" href={pdfData} download={`${data.project_name}.pdf`} onClick={refreshDownloadButton}>
                                            <Download className="me-1" size={15} />  Download PDF
                                        </a>
                                    </div>
                                    :
                                    < div className=''>
                                        <ReusableButton
                                            name={'Download'}
                                            onClick={() => handleClick()}
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

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <div className='flex flex-col'>
                        <PageHeader
                            links={[
                                { name: 'Project Charter', linkTo: '/report/project_charter', permission: '' },
                                { name: 'Show', linkTo: '/projects/show', permission: '' },
                            ]}
                            isShowPage={true}
                            isDownload={true}
                            ButtonDownloadComponent={ButtonDownloadComponent}
                        />
                        <div className='flex flex-col bg-white p-2 shadow-md text-xs'>
                            <h3 className='text-sm font-semibold mb-1'>Project Charter</h3>
                            <div className='w-full flex flex-col mb-3'>
                                <h4>1. General Information</h4>
                                <div className='ml-12'>
                                    <div className='flex mb-1'>
                                        <p className='w-32 mr-1'>Project Title:</p>
                                        <p className='font-medium'>Flex Projects</p>
                                    </div>
                                    <div className='flex mb-1'>
                                        <p className='w-32 mr-1'>Project Owner:</p>
                                        <p className='font-medium'>CITS</p>
                                    </div>
                                    <div className='flex mb-1'>
                                        <p className='w-32 mr-1'>Sponsor: </p>
                                        <p className='font-medium'>CITS</p>
                                    </div>
                                    <div className='flex mb-1'>
                                        <p className='w-32 mr-1'>Representative: </p>
                                        <p className='font-medium'>James Sweke </p>
                                    </div>
                                    <div className='flex mb-1'>
                                        <p className='w-32 mr-1'>Prepared by: </p>
                                        <p className='font-medium'>Ulisubisya Masetta </p>
                                    </div>
                                    <div className='flex'>
                                        <p className='w-32 mr-1'>Version:</p>
                                        <p className='font-medium'>xxL </p>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex flex-col mb-3'>
                                <h4>2. Project Stakeholders</h4>
                                <div className='ml-12'>
                                    <div className="flex border-l border-t border-b border-gray-500 font-semibold">
                                        <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500"></p>
                                        <p className="flex-grow w-48 p-1 border-r border-gray-500">Position</p>
                                        <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>
                                        <p className="flex-grow w-24 p-1 border-r border-gray-500">Phone</p>
                                        <p className="flex-grow w-32 p-1 border-r border-gray-500">Email</p>
                                    </div>
                                    <>
                                        <div className="flex border-l  border-b border-gray-500 font-semibold">
                                            <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">1</p>
                                            <p className="flex-grow w-48 p-1 border-r border-gray-500">Position</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Phone</p>
                                            <p className="flex-grow w-32 p-1 border-r border-gray-500">Email</p>
                                        </div>
                                        <div className="flex border-l  border-b border-gray-500 font-semibold">
                                            <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">2</p>
                                            <p className="flex-grow w-48 p-1 border-r border-gray-500">Position</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Phone</p>
                                            <p className="flex-grow w-32 p-1 border-r border-gray-500">Email</p>
                                        </div>
                                    </>
                                </div>
                            </div>
                            <div className='w-full flex flex-col mb-3'>
                                <h4>3. Executive Summary</h4>
                                <div className='ml-12'>
                                    <p>This is the Executive Sumarray</p>
                                </div>
                            </div>
                            <div className='w-full flex flex-col mb-3'>
                                <h4>4. Project Purpose</h4>
                                <div className='w-full flex flex-col mb-3 ml-12'>
                                    <h4>4.1. Business Need/Problem</h4>
                                    <div className='ml-12'>
                                        <p>This is the Project Business need Explained</p>
                                    </div>
                                </div>
                                <div className='w-full flex flex-col mb-3 ml-12'>
                                    <h4>4.2. Business Objective</h4>
                                    <div className='ml-12'>
                                        <div className="flex border-l border-t border-b border-gray-500 font-semibold">
                                            <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500"></p>
                                            <p className="flex-grow w-48 p-1 border-r border-gray-500">Strategic Plan Element</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Project Business Objective</p>
                                        </div>
                                        <>
                                            <div className="flex border-l  border-b border-gray-500 font-semibold">
                                                <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">1</p>
                                                <p className="flex-grow w-48 p-1 border-r border-gray-500">Position</p>
                                                <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                            </div>
                                            <div className="flex border-l  border-b border-gray-500 font-semibold">
                                                <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">2</p>
                                                <p className="flex-grow w-48 p-1 border-r border-gray-500">Position</p>
                                                <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                            </div>
                                        </>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex flex-col mb-3'>
                                <h4>5. Project Overview</h4>
                                <div className='w-full flex flex-col mb-3 ml-12'>
                                    <h4>5.1. Project Description</h4>
                                    <div className='ml-12'>
                                        <p>This is the Project Business need Explained</p>
                                    </div>
                                </div>
                                <div className='w-full flex flex-col mb-3 ml-12'>
                                    <h4>5.2. Scope</h4>
                                    <div className='ml-12'>
                                        <p>This is the Project Business need Explained</p>
                                    </div>
                                </div>

                                <div className='w-full flex flex-col mb-3 ml-12'>
                                    <h4>5.3. Assumption</h4>
                                    <div className='ml-12'>
                                        <div className='border-t border-gray-500 '>
                                            <div className="flex border-l  border-b border-gray-500 font-semibold">
                                                <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">1</p>
                                                <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                            </div>
                                            <div className="flex border-l  border-b border-gray-500 font-semibold">
                                                <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">2</p>
                                                <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full flex flex-col mb-3 ml-12'>
                                    <h4>5.3. Constraints</h4>
                                    <div className='ml-12'>
                                        <div className='border-t border-gray-500 '>
                                            <div className="flex border-l  border-b border-gray-500 font-semibold">
                                                <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">1</p>
                                                <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                            </div>
                                            <div className="flex border-l  border-b border-gray-500 font-semibold">
                                                <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">2</p>
                                                <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex flex-col mb-3 ml-12'>
                                <h4>6. Project Deliverables</h4>
                                <div className='ml-12'>
                                    <div className='border-t border-gray-500 '>
                                        <div className="flex border-l  border-b border-gray-500 font-semibold">
                                            <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">1</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                        </div>
                                        <div className="flex border-l  border-b border-gray-500 font-semibold">
                                            <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">2</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex flex-col mb-3 ml-12'>
                                <h4>7. Cost/Budget</h4>
                                <div className='ml-12'>
                                    <div className="flex border-l border-t border-b border-gray-500 font-semibold">
                                        {/* <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500"></p> */}
                                        <p className="flex-grow w-48 p-1 border-r border-gray-500">Purpose</p>
                                        <p className="flex-grow w-24 p-1 border-r border-gray-500">Amount</p>
                                        <p className="flex-grow w-24 p-1 border-r border-gray-500">Source</p>
                                    </div>
                                    <>
                                        <div className="flex border-l  border-b border-gray-500 font-semibold">
                                            <p className="flex-grow w-48 p-1 border-r border-gray-500">Position</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Position</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                        </div>
                                        <div className="flex border-l  border-b border-gray-500 font-semibold">
                                            {/* <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">2</p> */}
                                            <p className="flex-grow w-48 p-1 border-r border-gray-500">Position</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                        </div>
                                    </>
                                </div>
                            </div>
                            <div className='w-full flex flex-col mb-3 ml-12'>
                                <h4>8. Personnel &amp; Other Resources</h4>
                                <div className='ml-12'>
                                    <div className="flex border-l border-t border-b border-gray-500 font-semibold">
                                        {/* <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500"></p> */}
                                        <p className="flex-grow w-48 p-1 border-r border-gray-500">Resource</p>
                                        <p className="flex-grow w-24 p-1 border-r border-gray-500">Description</p>
                                    </div>
                                    <>
                                        <div className="flex border-l  border-b border-gray-500 font-semibold">
                                            <p className="flex-grow w-48 p-1 border-r border-gray-500">Position</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                        </div>
                                        <div className="flex border-l  border-b border-gray-500 font-semibold">
                                            {/* <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">2</p> */}
                                            <p className="flex-grow w-48 p-1 border-r border-gray-500">Name/Title/Organization</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                        </div>
                                    </>
                                </div>
                            </div>
                            <div className='w-full flex flex-col mb-3 ml-12'>
                                <h4> 9. Project Risks</h4>
                                <div className='ml-12'>
                                    <div className='border-t border-gray-500 '>
                                        <div className="flex border-l  border-b border-gray-500 font-semibold">
                                            <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">1</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                        </div>
                                        <div className="flex border-l  border-b border-gray-500 font-semibold">
                                            <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">2</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex flex-col mb-3'>
                                <h4>10. Project Organization</h4>
                                <div className='w-full flex flex-col mb-3 ml-12'>
                                    <h4>10.1. Project Organization Chart</h4>
                                    <div className='ml-12'>
                                        <p>This is the Project Business need Explained</p>
                                    </div>
                                </div>
                                <div className='w-full flex flex-col mb-3 ml-12'>
                                    <h4>10.2. Roles and Responsibilities</h4>
                                    <div className='ml-12'>
                                        <div className="flex border-l border-t border-b border-gray-500 font-semibold">
                                            {/* <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">Name</p> */}
                                            <p className="flex-grow w-48 p-1 border-r border-gray-500">Name</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Email/Phone</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Roles and Responsibilities</p>
                                        </div>
                                        <>
                                            <div className="flex border-l  border-b border-gray-500 font-semibold">
                                                <p className="flex-grow w-48 p-1 border-r border-gray-500">Name</p>
                                                <p className="flex-grow w-24 p-1 border-r border-gray-500">Position</p>
                                                <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                            </div>
                                            <div className="flex border-l  border-b border-gray-500 font-semibold">
                                                <p className="flex-grow w-48 p-1 border-r border-gray-500">Name</p>
                                                <p className="flex-grow w-24 p-1 border-r border-gray-500">Position</p>
                                                <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                            </div>
                                        </>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex flex-col mb-3 ml-12'>
                                <h4>11. Approval Signatures</h4>
                                <div className='ml-12'>
                                    <div className="flex border-l border-t border-b border-gray-500 font-semibold">
                                        {/* <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">Name</p> */}
                                        <p className="flex-grow w-48 p-1 border-r border-gray-500">Position/Title</p>
                                        <p className="flex-grow w-48 p-1 border-r border-gray-500">Name</p>
                                        <p className="flex-grow w-24 p-1 border-r border-gray-500">Signature</p>
                                        <p className="flex-grow w-24 p-1 border-r border-gray-500">Date</p>
                                    </div>
                                    <>
                                        <div className="flex border-l  border-b border-gray-500 font-semibold">
                                            <p className="flex-grow w-48 p-1 border-r border-gray-500">Position/Title</p>
                                            <p className="flex-grow w-48 p-1 border-r border-gray-500">Position</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                        </div>
                                        <div className="flex border-l  border-b border-gray-500 font-semibold">
                                            <p className="flex-grow w-48 p-1 border-r border-gray-500">Position/Title</p>
                                            <p className="flex-grow w-48 p-1 border-r border-gray-500">Position</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>
                                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Name/Title/Organization</p>

                                        </div>
                                    </>
                                </div>
                            </div>
                        </div>

                    </div>
            }
        </ProtectedRoute>
    )
}

export default ProjectCharterShow