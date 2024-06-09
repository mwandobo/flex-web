"use client"

import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useRouter } from 'next/navigation';
import { checkPermissions } from '@/utils/actions/check-permissions';

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
}
interface Props {
    links: any[]
}

export default function MuiBreadcrumbs({
    links
}: Props) {
    const router = useRouter()

    const navigate = (linkData: any) => {
        if (checkPermissions(linkData.permission) && linkData.isClickable) {
            router.push(linkData.linkTo)
        }
    }
    const navigateHome = () => router.push('/dashboard')

    return (
        <div role="presentation" onClick={handleClick}>
            <Breadcrumbs aria-label="breadcrumb">
                <p
                    className='cursor-pointer '
                    color="inherit"
                    onClick={() => navigateHome()}>
                    Home
                </p>
                {
                    links.slice(0, -1)?.map((link, index) => (
                        <p key={index}
                            onClick={() => navigate(link)}
                            color="inherit"
                            className='cursor-pointer '
                        >
                            {link.name}
                        </p>
                    ))
                }
                <Typography color="text.primary">{links[links?.length - 1]?.name}</Typography>
            </Breadcrumbs>
        </div>
    );
}