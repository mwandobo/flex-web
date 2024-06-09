export const statusFormatter = (status?: any) => {
    if (status?.toString() === "0") {
        return '0.00 %'
    }

    if (!status) {
        return '---'
    }

    return `${status} %`
};
