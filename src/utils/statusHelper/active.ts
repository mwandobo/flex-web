export const StatusCreatorHelperActive = (status?: number) => {

    let label = ''
    let color = ''
    if (Number(status) === 0) {
        label = "Active"
        color = "text-sky-600"
    }
    if (Number(status) === 1) {
        label = "Disabled"
        color = "text-red-600"
    }

    return { label, color }

}