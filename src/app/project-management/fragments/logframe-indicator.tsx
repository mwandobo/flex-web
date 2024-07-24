"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import MuiCardComponent from '@/components/card/mui-card.component'
import MuiTab from '@/components/tabs/mui-tab'
import React, { useEffect, useState } from 'react'
import LogFrame from './logframe'
import Indicator from './indicator'

interface Props {
    project?: any
}

function LogFrameIndicator({
    project,
}: Props) {
    const nodes: React.ReactNode[] = [
        <LogFrame
            key={'logframe'}
            project_id={project?.id}
            isHideAdd={true}
        />,
        <Indicator
            key={'indicator'}
            project_id={project?.id}
            isHideAdd={true}
        />,
    ];

    return (
        <ProtectedRoute>
            <MuiCardComponent>
                <MuiTab
                    columns={[
                        "Log Frame",
                        "Indicators",
                    ]}
                    nodes={nodes}
                >
                </MuiTab>
            </MuiCardComponent>
        </ProtectedRoute>
    )
}

export default LogFrameIndicator