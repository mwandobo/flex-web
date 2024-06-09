// ClientProviders.tsx

"use client"


import React from 'react';
import { SessionProvider } from 'next-auth/react';

export default function ClientProviders({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider session={null}> {/* Pass in null initially */}
            {children}
        </SessionProvider>
    );
}