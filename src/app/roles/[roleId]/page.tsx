"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import { get } from "@/utils/api";
import { StatusCreatorHelperActive } from "@/utils/statusHelper/active";
import { useEffect, useState } from "react";
import { PermTableComponent } from "../fragments/perm.table.component";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";
import {ROLE_APPROVAL_SLUG} from "@/utils/constant";

const RolesShow = ({ params }: { params: { roleId: string } }) => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const token = getValueFromLocalStorage('token')
    const id = params.roleId

    const status = () => {
        const status = StatusCreatorHelperActive(data?.status)
        return <span className={`${status.color}`}>{status.label}</span>
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: ROLE_APPROVAL_SLUG,
        from: ROLE_APPROVAL_SLUG,
        from_id: id
    })


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await get(`role/show/${id}`, token)

            if (res && res.status === 200) {
                setData(res.data.data)
                setLoading(false)
            }
        };
        fetchData()
    }, [])

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            links={[
                                { name: 'Role', linkTo: '/roles', permission: 'roles', isClickable: true },
                                { name: 'Show', linkTo: '/roles/show', permission: '' },
                            ]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>

                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        { label: 'Role Name', value: data?.name },
                                    ]}
                                    titleA={`Role`}
                                    titleB={` ${data?.name} `}
                                    OptionalElement={approvalsAndButtonsWrapper({})}
                                />
                            </div>
                            <hr className="bg-gray-100" />
                            <div className="mt-3 px-3">
                                <div className="border border-solid border-gray-200 p-2">
                                    <h4 className="text-sm font-semibold">Permissions</h4>
                                    <PermTableComponent
                                        data={data.permissionGroups}
                                    />
                                </div>
                            </div>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default RolesShow;