"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import MuiCardComponent from '@/components/card/mui-card.component'
import MuiTab from '@/components/tabs/mui-tab'
import React from 'react'
import TimesheetDepartment from "@/app/report/timesheet/timesheet-department";
import TimesheetPersonnel from "@/app/report/timesheet/timesheet-personnel";


function Timesheet() {
    const nodes: React.ReactNode[] = [
        <TimesheetPersonnel key={'personnel'}
        />,
        <TimesheetDepartment key={'department'}
        />,
    ];

    return (
        <ProtectedRoute>
            {
                <MuiCardComponent>
                    <MuiTab
                        columns={[
                            "Personnel",
                            "Departments",
                        ]}
                        nodes={nodes}
                    >
                    </MuiTab>
                </MuiCardComponent>
            }
        </ProtectedRoute >
    )
}

export default Timesheet