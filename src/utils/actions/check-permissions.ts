import { getValueFromLocalStorage } from "./local-starage";

export const checkPermissions = (permission: string) => {

    const permissionsJson = getValueFromLocalStorage('permissions');
    let permissions: any[] = [];
    let allowAccess = false;

    if (permissionsJson) {
        permissions = JSON.parse(permissionsJson);
    }

    if (!permission) {
        allowAccess = true;
    } else {
        const foundIndex = permissions && permissions.findIndex((permission => permission.mapped_name === permission))
        allowAccess = foundIndex ? true : false
    }

    return allowAccess;
};
