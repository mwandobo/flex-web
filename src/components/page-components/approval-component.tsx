"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import React from 'react'

const formInputs = [

]

const columns = [
  {
    id: 'approved_by_name',
    numeric: false,
    disablePadding: false,
    label: 'Approved By',
  },
  {
    id: 'approval_level_name',
    numeric: false,
    disablePadding: false,
    label: 'Level',
  },
  {
    id: 'remark',
    numeric: false,
    disablePadding: false,
    label: 'Remarks',
  },
]

interface Props {
  from_id?: any
  project_id?: any
  from?: any
  isHideAdd?: boolean
}

function ApprovalComponent({
  from_id,
  from,
  isHideAdd

}: Props) {

  const url = `approval/approved-items/by-item?from=${from}&&from_id=${from_id}`

  const {
    loading,
    createdForm,
    handleClick,
    tabular

  } = usePageData({
    columns: columns,
    url: url,
    isHideShow: true,
    state_properties: [],
    formInputs: formInputs,
    modalTitle: "Approve",
    isHideDelete: true,
  })

  return (
    <ProtectedRoute>
      {
        loading ? <p>Loading...</p>
          :
          <>
            <PageHeader
              handleClick={handleClick}
              subHeader='Approved Item / List'
              links={[{ name: 'Approvals', linkTo: `/admnistration/external/` }]}
              isHideAdd={isHideAdd}

            />
            {tabular()}
            {createdForm()}
          </>
      }
    </ProtectedRoute>
  )
}

export default ApprovalComponent