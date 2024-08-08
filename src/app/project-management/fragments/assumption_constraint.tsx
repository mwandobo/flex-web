"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import MuiCardComponent from '@/components/card/mui-card.component'
import MuiTab from '@/components/tabs/mui-tab'
import React from 'react'
import Constraint from './constraint'
import Assumption from './assumption'

interface Props {
    from_id?: any
    project_id?: any
    from?: any
    isHideAdd?: boolean
}

function AssumptionConstraint({
    from_id,
    project_id,
    from,
}: Props) {
    const nodes: React.ReactNode[] = [
        <Assumption
            key={'assumption'}
            from={from}
            from_id={from_id}
            project_id={project_id}
        />,
        <Constraint
            key={'constraint'}
            from={from}
            from_id={from_id}
            project_id={project_id}
        />,
    ];

    return (
        <ProtectedRoute>
            {
                <MuiCardComponent>
                    <MuiTab
                        columns={[
                            "Assumptions",
                            "Constraints",
                        ]}
                        nodes={nodes}
                    >
                    </MuiTab>
                </MuiCardComponent>
            }
        </ProtectedRoute >
    )
}

export default AssumptionConstraint