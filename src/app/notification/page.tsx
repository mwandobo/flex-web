"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'

const deptFormInputs = [

]

const columns = [
    {
        id: 'description',
        numeric: false,
        disablePadding: false,
        label: 'Text',
    },
]

function Notification() {
    const permission = 'notification'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: deptFormInputs,
        url: 'notifications',
        modalTitle: 'Notification',
        viewUrl: '/notification/',
        state_properties: [],
        permission: permission,
        from: 'notification'
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                handleClick={handleClick}
                                links={[
                                    { name: 'Notifications / List', linkTo: '/administration/approvals', permission: permission, isClickable: true },
                                ]} />
                            {tabular()}
                            {createdForm()}
                        </>
                    }
                </>
            }
            </>

        </ProtectedRoute>
    )
}

export default Notification