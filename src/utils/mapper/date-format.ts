import dayjs from "dayjs"

export const dateFormatterHelper = (date: any, order?: number) => {
    if (!date) return '------------';
    let format = 'DD/MM/YYYY';
    if (order) format = 'YYYY/MM/DD';
    return dayjs(date).format(format)
}