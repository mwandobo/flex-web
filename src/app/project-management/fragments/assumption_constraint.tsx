"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import MuiCardComponent from '@/components/card/mui-card.component'
import MuiTab from '@/components/tabs/mui-tab'
import React from 'react'
import Constraint from './constraint'
import Assumption from './assumption'

interface Props {
    from_id?: any
    project?: any
    from?: any
    isHideAdd?: boolean
}

function AssumptionConstraint({
    from_id,
    project,
    from,
}: Props) {
    const nodes: React.ReactNode[] = [
        <Assumption
            key={'assumption'}
            from={from}
            from_id={from_id}
            project={project}
        />,
        <Constraint
            key={'constraint'}
            from={from}
            from_id={from_id}
            project_id={project?.id}
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