'use client'

import { useEffect, useState } from "react"

const HydrationZustand = ({ children }) => {
    const [isHydrated, setIsHydrated] = useState(false)

    // Wait till Next.js rehydration completes
    useEffect(() => {
        setIsHydrated(true)
    }, [])

    return <>{isHydrated ? <div className="flex h-screen w-full">{children}</div> : null}</>
}

export default HydrationZustand