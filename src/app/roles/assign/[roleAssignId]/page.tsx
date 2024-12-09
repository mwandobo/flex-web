"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import {get, post} from "@/utils/api";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation"
import MuiCheckbox from "@/components/inputs/mui-checkbox";
import {ReusableButton} from "@/components/button/reusable-button";
import {CheckCircle2} from "lucide-react";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";


const createPermissionCheckData = (permissionGroups: any[], user_permissions: any[]) => {
    let result = [];
    if (permissionGroups && permissionGroups.length > 0)

        result = permissionGroups.map((group: any) => ({
            ...group,
            checked: group.permissions.some((perm: any) =>
                user_permissions.some(_perm => Number(_perm.id) === Number(perm.id))
            ),
            permissions: group.permissions.map((perm: any) => ({
                ...perm,
                checked: !!user_permissions.find(_perm => Number(_perm.id) === Number(perm.id))
            }))
        }));

    return result
};


const RolesAssign = ({params}: { params: { roleAssignId: string } }) => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const token = getValueFromLocalStorage('token')
    const id = params.roleAssignId

    const router = useRouter()
    const [checkAll, setCheckAll] = useState(false);
    const [groups, setGroups] = useState<any[]>(createPermissionCheckData(data?.permissionGroups, data?.rolePermissions));

    const handleCheck = (event: any, from?: string) => {
        const value = event?.target?.value;
        let updatedGrops: any[] = [];

        if (from === 'all') {
            setCheckAll(!checkAll)

            updatedGrops = groups.map((group: any) => {
                let updatedPerms = group.permissions.map((perm: any) => {
                    return {...perm, checked: !checkAll}
                });
                return {...group, checked: !checkAll, permissions: updatedPerms}
            });
        } else {
            let array_strin: any | undefined[] = from?.split('_');
            const groupName = array_strin[0]
            const groupId = array_strin[1]

            if (groupName === 'group') {

                updatedGrops = groups.map((group: any) => {
                    if (Number(group.id) === Number(groupId)) {
                        let updatedPerms = group.permissions.map((perm: any) => {
                            return {...perm, checked: !group.checked}
                        });
                        return {...group, checked: !group.checked, permissions: updatedPerms}
                    }
                    return group
                });
                const checkA = updatedGrops.every((per: any) => per.checked === true)
                setCheckAll(checkA)
            }
            if (groupName === 'perm') {
                updatedGrops = groups.map((group: any) => {
                    let updatedPerms = group.permissions.map((perm: any) => {
                        if (Number(perm.id) === Number(groupId)) {
                            return {...perm, checked: !perm.checked}
                        }

                        return perm;
                    });

                    const checkg = updatedPerms.every((per: any) => per.checked === true)
                    return {...group, checked: checkg, permissions: updatedPerms}
                });
            }
        }

        setGroups(updatedGrops)
    }


    const createPermissionPayload = () => {
        const _perms: any[] = [];

        groups.map((group: any) => {
            group.permissions.map((perm: any) => {
                if (perm.checked === true) {
                    _perms.push(perm.id)
                }
            })
        })

        return _perms
    }

    const handleSave = async () => {
        try {
            setLoading(true)
            const payload = {
                role_id: 1,
                permissions: createPermissionPayload()
            }

            const res = await post(`role/assign/${id}`, payload, token);

            if (res.status === 200) {
                setLoading(false)
                router.push(`/roles/${id}`)
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await get(`role/show_assign/${id}`, token)

            if (res && res.status === 200) {
                setData(res.data.data)
                setGroups(createPermissionCheckData(res?.data?.data?.permissionGroups, res?.data?.data?.rolePermissions))
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
                                {name: 'Role', linkTo: '/roles', permission: 'roles', isClickable: true},
                                {name: 'Assign', linkTo: '/roles/show', permission: ''},
                            ]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Name', value: data?.name},
                                    ]}
                                    titleA={`Role`}
                                    titleB={` ${data?.name} `}
                                />
                            </div>
                            <hr className="bg-gray-100"/>

                            <div className="mt-3 px-3">
                                <div className="border border-solid border-gray-200 p-4 tetx-xs">
                                    <>
                                        <h4 className="text-sm font-semibold">Permissions</h4>
                                    <div
                                        className={'flex w-full mb-2 border border-gray-300 shadow-md rounded-sm  p-2'}
                                    >
                                        <MuiCheckbox
                                            handleChange={handleCheck}
                                            label="All Permissions"
                                            from='all'
                                            checked={checkAll}
                                        />
                                    </div>
                                        <div className={'grid grid-cols-2 gap-2'}>
                                            {
                                                groups && groups.map((group, index) => (
                                                    <div
                                                        key={group.id}
                                                        className={'flex w-full border border-gray-300 shadow-md rounded-sm bg-gray-50 p-2'}
                                                        // sx={{
                                                        //     marginBottom: '20px',
                                                        //     paddingLeft: '20px'
                                                        // }}
                                                    >
                                                        <div className={'w-1/4'}>
                                                            <MuiCheckbox
                                                                handleChange={handleCheck}
                                                                label={group.name}
                                                                from={`group_${group.id}`}
                                                                checked={group.checked}
                                                            />
                                                        </div>

                                                        <hr/>
                                                        <div className="grid grid-cols-3 item-start ps-20 w-3/4">
                                                            {group.permissions && group.permissions.map((permission: any) => (
                                                                <MuiCheckbox
                                                                    key={permission.id}
                                                                    handleChange={handleCheck}
                                                                    label={permission.name}
                                                                    from={`perm_${permission.id}`}
                                                                    checked={permission.checked}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            }


                                        </div>



                                        <div className="flex justify-end mt-2">
                                            <ReusableButton name={'save'}
                                                            onClick={handleSave}
                                                            rounded={'md'}
                                                            padding={'p-3'}
                                                            shadow={'shadow-md'}
                                                            bg_color={'bg-gray-200'}
                                                            hover={'hover:bg-gray-300 hover:border-gray-400'}
                                                            hover_text={'hover:text-gray-900 hover:font-semibold'}
                                                            border={'border border-gray-300'}
                                                            text_color={'text-gray-900'}
                                            >
                                                <CheckCircle2/>
                                            </ReusableButton>
                                        </div>
                                    </>
                                </div>
                            </div>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default RolesAssign;