"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import GeneratePdf from '@/components/pdf/generate-pdf'
import {  get } from '@/utils/api'
import React, { useEffect, useState } from 'react'

const ProjectCharterShow = ({ params }: { params: { projectCharterId: string } }) => {
    const id = params.projectCharterId
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const url = `reports/project-charter/show/${id}`
    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                setLoading(true)
                const res = await get(url)
                if (res && res.status === 200) {
                    setData(res.data.data)
                    setLoading(false)
                }
            }
        };
        fetchData()
    }, [url, id])

    const project = data

    const pageBody = () => {
        return (
            <div className='flex flex-col bg-white p-2 shadow-md text-xs'>
                <h3 className='text-sm font-semibold mb-1'>Project Charter</h3>
                <div className='w-full flex flex-col mb-3'>
                    <h4>1. General Information</h4>
                    <div className='ml-12'>
                        <div className='flex mb-1'>
                            <p className='w-32 mr-1'>Project Title:</p>
                            <p className='font-medium'>{project?.name}</p>
                        </div>
                        <div className='flex mb-1'>
                            <p className='w-32 mr-1'>Project Owner:</p>
                            <p className='font-medium'>{project?.owner}</p>
                        </div>
                        <div className='flex mb-1'>
                            <p className='w-32 mr-1'>Sponsor: </p>
                            <p className='font-medium'>
                                {project?.sponsors?.length > 0 ?
                                    <>{project?.sponsors.map(item => <span key={item.id}>{item.name}</span>)}
                                    </> :
                                    <>Not Available</>
                                }
                            </p>
                        </div>
                        <div className='flex mb-1'>
                            <p className='w-32 mr-1'>Representative: </p>
                            <p className='font-medium'>
                                {project?.representatives?.length > 0 ?
                                    <>{project?.representatives.map(item => <span key={item.id}>{item.name}</span>)}
                                    </> :
                                    <>Not Available</>
                                }
                            </p>
                        </div>

                        <div className='flex mb-1'>
                            <p className='w-32 mr-1'>Prepared by: </p>
                            <p className='font-medium'>{project?.prepared_by} </p>
                        </div>
                        <div className='flex mb-1'>
                            <p className='w-32 mr-1'>Version:</p>
                            <p className='font-medium'>1.00 </p>
                        </div>
                        <div className='flex mb-1'>
                            <p className='w-36 mr-1'>Communication Channel: </p>
                            <p className='font-medium'>{project?.communication_channel} </p>
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
                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Sponsorship</p>
                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Phone</p>
                            <p className="flex-grow w-32 p-1 border-r border-gray-500">Email</p>
                        </div>
                        <>
                            {
                                project?.stakeholders.length > 0 ?
                                    <>
                                        {
                                            project?.stakeholders.map((item, index) =>
                                                <div key={item.id} className="flex border-l  border-b border-gray-500">
                                                    <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">{index + 1}</p>
                                                    <p className="flex-grow w-48 p-1 border-r border-gray-500">{item.position}</p>
                                                    <p className="flex-grow w-24 p-1 border-r border-gray-500">{item.name}</p>
                                                    <p className="flex-grow w-24 p-1 border-r border-gray-500">{item.sponsorship}</p>
                                                    <p className="flex-grow w-24 p-1 border-r border-gray-500">{item.phone}</p>
                                                    <p className="flex-grow w-32 p-1 border-r border-gray-500">{item.email}</p>
                                                </div>
                                            )
                                        }</>
                                    :
                                    <div className="flex border-l border-b border-gray-500">
                                        <p className="flex-shrink-0 w-full text-center font-semibold p-1 border-r border-gray-500"> No Data</p>
                                    </div>

                            }
                        </>
                    </div>
                </div>
                <div className='w-full flex flex-col mb-3'>
                    <h4>3. Executive Summary</h4>
                    <div className='ml-12'>
                        <p>{project?.summary}</p>
                    </div>
                </div>
                <div className='w-full flex flex-col mb-3'>
                    <h4>4. Project Purpose</h4>
                    <div className='w-full flex flex-col mb-3 ml-12'>
                        <p>{project?.purpose}</p>
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
                                {
                                    project?.purposes?.length > 0 ?
                                        <>
                                            {
                                                project?.purposes?.map((item, index) =>
                                                    <div key={item.id} className="flex border-l  border-b border-gray-500">
                                                        <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">{index + 1}</p>
                                                        <p className="flex-grow w-48 p-1 border-r border-gray-500">{item.element}</p>
                                                        <p className="flex-grow w-24 p-1 border-r border-gray-500">{item.objective}</p>
                                                    </div>
                                                )
                                            }</>
                                        :
                                        <div className="flex border-l border-b border-gray-500">
                                            <p className="flex-shrink-0 w-full text-center font-semibold p-1 border-r border-gray-500"> Not Data </p>
                                        </div>
                                }
                            </>
                        </div>
                    </div>
                </div>
                <div className='w-full flex flex-col mb-3'>
                    <h4>5. Project Overview</h4>
                    <div className='w-full flex flex-col mb-3 ml-12'>
                        <h4>5.1. Project Description</h4>
                        <div className='ml-12'>
                            <p>{project?.description}</p>
                        </div>
                    </div>
                    <div className='w-full flex flex-col mb-3 ml-12'>
                        <h4>5.2. Scope</h4>
                        <div className='ml-12'>
                            <p> {project?.scope}</p>
                        </div>
                    </div>

                    <div className='w-full flex flex-col mb-3 ml-12'>
                        <h4>5.3. Assumption</h4>
                        <div className='ml-12'>
                            <div className="border-t border-gray-500">
                                {
                                    project?.assumptions?.length > 0 ?
                                        <>
                                            {
                                                project?.assumptions?.map((item, index) =>
                                                    <div key={item.id} className="flex border-l  border-b border-gray-500">

                                                        <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">{index + 1}</p>
                                                        <p className="flex-grow w-24 p-1 border-r border-gray-500">{`${item?.formatted_code} ${item?.name}`}</p>

                                                    </div>
                                                )
                                            }</>
                                        :
                                        <div className="flex border-l border-b  border-gray-500">
                                            <p className="flex-shrink-0 w-full text-center font-semibold p-1 border-r border-gray-500">Not Data </p>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex flex-col mb-3 ml-12'>
                        <h4>5.3. Constraints</h4>
                        <div className='ml-12'>
                            <div className="border-t border-gray-500">
                                {
                                    project?.constraints?.length > 0 ?
                                        <>
                                            {
                                                project?.constraints?.map((item, index) =>
                                                    <div key={item.id} className="flex border-l b border-b border-gray-500">

                                                        <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">{index + 1}</p>
                                                        <p className="flex-grow w-24 p-1 border-r border-gray-500">{`${item?.formatted_code} ${item?.name}`}</p>

                                                    </div>
                                                )
                                            }</>
                                        :
                                        <div className="flex border-l border-b  border-gray-500">
                                            <p className="flex-shrink-0 w-full text-center font-semibold p-1 border-r border-gray-500">Not Data </p>
                                        </div>
                                }
                            </div>

                        </div>
                    </div>
                </div>
                <div className='w-full flex flex-col mb-3 ml-12'>
                    <h4>6. Project Deliverables</h4>
                    <div className='ml-12'>
                        <>
                            {
                                project?.deliverables?.length > 0 ?
                                    <>
                                        {
                                            project?.deliverables?.map((item, index) =>
                                                <div key={item.id} className="flex border-l border-t border-b border-gray-500">

                                                    <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">{index + 1}</p>
                                                    <p className="flex-grow w-24 p-1 border-r border-gray-500">{item?.name}</p>

                                                </div>
                                            )
                                        }</>
                                    :
                                    <div className="flex border-l border-b border-t border-gray-500">
                                        <p className="flex-shrink-0 w-full text-center font-semibold p-1 border-r border-gray-500">Not Data </p>
                                    </div>
                            }
                        </>
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
                            {
                                project?.costs?.length > 0 ?
                                    <>
                                        {
                                            project?.costs?.map(item =>
                                                <div key={item.id} className="flex border-l  border-b border-gray-500">
                                                    <p className="flex-grow w-48 p-1 border-r border-gray-500">{item.purpose}</p>
                                                    <p className="flex-grow w-24 p-1 border-r border-gray-500">{item.amount}</p>
                                                    <p className="flex-grow w-24 p-1 border-r border-gray-500">{item.source}</p>
                                                </div>
                                            )
                                        }</>
                                    :
                                    <div className="flex border-l border-b border-gray-500">
                                        <p className="flex-shrink-0 w-full text-center font-semibold p-1 border-r border-gray-500">No Data </p>
                                    </div>
                            }
                        </>
                    </div>
                </div>
                <div className='w-full flex flex-col mb-3 ml-12'>
                    <h4>8. Personnel &amp; Other Resources</h4>
                    <div className='ml-12'>
                        <div className="flex border-l border-t border-b border-gray-500 font-semibold">
                            {/* <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500"></p> */}
                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Resource</p>
                            <p className="flex-grow w-48 p-1 border-r border-gray-500">Description</p>
                        </div>
                        <>
                            {
                                project?.resources?.length > 0 ?
                                    <>
                                        {
                                            project?.resources?.map((item, index) =>
                                                <div key={index} className="flex border-l  border-b border-gray-500">
                                                    <p className="flex-grow w-24 p-1 border-r border-gray-500">{item.name}</p>
                                                    <p className="flex-grow w-48 p-1 border-r border-gray-500">{item.details}</p>
                                                </div>
                                            )
                                        }</>
                                    :
                                    <div className="flex border-l border-b border-gray-500">
                                        <p className="flex-shrink-0 w-full text-center font-semibold p-1 border-r border-gray-500">No Data </p>
                                    </div>
                            }
                        </>
                    </div>
                </div>
                <div className='w-full flex flex-col mb-3 ml-12'>
                    <h4> 9. Project Risks</h4>
                    <div className='ml-12'>
                        <div className=' border-gray-500 '>
                            {
                                project?.risks?.length > 0 ?
                                    <>
                                        {
                                            project?.risks?.map((item, index) =>
                                                <div key={item.id} className="flex border-l border-t border-b border-gray-500">

                                                    <p className="flex-shrink-0 w-12 p-1 border-r border-gray-500">{index + 1}</p>
                                                    <p className="flex-grow w-24 p-1 border-r border-gray-500">{item?.name}</p>

                                                </div>
                                            )
                                        }</>
                                    :
                                    <div className="flex border-l border-b border-t border-gray-500">
                                        <p className="flex-shrink-0 w-full text-center font-semibold p-1 border-r border-gray-500">Not Data </p>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
                <div className='w-full flex flex-col mb-3'>
                    <h4>10. Project Organization</h4>
                    <div className='w-full flex flex-col mb-3 ml-12'>
                        <h4>10.1. Project Organization Chart</h4>
                        <div className='ml-12'>
                            <p> <span className='text-red-500'>*</span> Not In System</p>
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
                                {
                                    project?.assignments?.length > 0 ?
                                        <>
                                            {
                                                project?.assignments?.map((item, index) =>
                                                    <div key={index} className="flex border-l  border-b border-gray-500">
                                                        <p className="flex-grow w-48 p-1 border-r border-gray-500">{item.personnel_department}</p>
                                                        <p className="flex-grow w-24 p-1 border-r border-gray-500">{item.phone}</p>
                                                        <p className="flex-grow w-24 p-1 border-r border-gray-500">{item.description}</p>
                                                    </div>
                                                )
                                            }</>
                                        :
                                        <div className="flex border-l border-b border-gray-500">
                                            <p className="flex-shrink-0 w-full text-center font-semibold p-1 border-r border-gray-500">No Data </p>
                                        </div>
                                }
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
                            {
                                project?.approvals?.length > 0 ?
                                    <>
                                        {
                                            project?.approvals?.map((item, index) =>
                                                <div key={index} className="flex border-l  border-b border-gray-500">
                                                    <p className="flex-grow w-48 p-1 border-r border-gray-500">{item.personnel_department}</p>
                                                    <p className="flex-grow w-24 p-1 border-r border-gray-500">{item.phone}</p>
                                                    <p className="flex-grow w-24 p-1 border-r border-gray-500">{item.description}</p>
                                                </div>
                                            )
                                        }
                                    </>
                                    :
                                    <div className="flex border-l border-b border-gray-500">
                                        <p className="flex-shrink-0 w-full text-center font-semibold p-1 border-r border-gray-500"> <span className='text-red-500'>*</span> Pending </p>
                                    </div>
                            }
                        </>
                    </div>
                </div>
            </div>
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
                            ButtonDownloadComponent={<GeneratePdf
                                content={pageBody()}
                                fileName="MyDocument.pdf"
                                buttonLabel="Generate PDF"
                            />} />
                        {pageBody()}
                    </div>
            }
        </ProtectedRoute>
    )
}

export default ProjectCharterShow