"use client"

interface Props {
    directCost?: any[],
    resourceCost?: any[],
}

export const useCostCalculator = ({ directCost, resourceCost }: Props) => {

    const calculateCostByMonth = (month: string, from: string) => {
        let monthTotalCost = 0;
        const dataToManipulate: any[] = from === 'direct_cost' ? directCost : resourceCost

        if (dataToManipulate && dataToManipulate.length > 0) {
            const filteredData = dataToManipulate.filter((entry: any) => {
                const entryMonth = new Date(entry.created_at).getMonth() + 1; // Months are zero-indexed
                return entryMonth.toString() === month;
            });

            if (filteredData && filteredData.length > 0) {
                monthTotalCost = filteredData.reduce((acc: any, entry: any) => acc + Number(entry.amount), 0);
            }
        }

        return monthTotalCost
    }

    let totalDirectCost = 0;
    let totalResourceCost = 0;

    if (directCost && directCost.length > 0) {
        totalDirectCost = directCost.reduce((acc: any, entry: any) => acc + Number(entry.amount), 0);
    }

    if (resourceCost && resourceCost.length > 0) {
        totalResourceCost = resourceCost.reduce((acc: any, entry: any) => acc + Number(entry.amount), 0);
    }

    const totalCost = totalDirectCost + totalResourceCost


    return {
        calculateCostByMonth,
        totalDirectCost,
        totalResourceCost,
        totalCost,
    }
}