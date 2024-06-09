"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import React from 'react'

function Dashboard() {
    return (
        <ProtectedRoute>
            <div className='text-sidebar-active'>Dashboard</div>
        </ProtectedRoute>
    )
}

export default Dashboard