"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import React from 'react'

const formInputs = [

]

const columns = [
  {
    id: 'approved_by',
    numeric: false,
    disablePadding: false,
    label: 'Approved By',
  },
  {
    id: 'level',
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
  project_id,
  from,
  isHideAdd

}: Props) {

  const url = `approved_items/${from}/${from_id}/`

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
    modalTitle: "Approve"
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