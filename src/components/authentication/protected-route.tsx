"use client"

import { checkPermissions } from '@/utils/actions/check-permissions';
import { getValueFromLocalStorage } from '@/utils/actions/local-starage';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode
  permission?: string
}

const ProtectedRoute = ({
  children,
  permission
}: Props) => {
  const router = useRouter();
  const token = getValueFromLocalStorage('token');


  useEffect(() => {
    if (!token) {
      router.push('/login'); // Redirect to login page if token is not present
    }
  }, [token]);

  return <>

    <Suspense fallback={<div>Loading...</div>}>
      <>
        {
          checkPermissions(permission) && <>{children}</>
        }
      </>
    </Suspense></>;
};

export default ProtectedRoute;