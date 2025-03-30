"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import React, {useEffect, useState} from 'react'
import PageHeader from "@/components/header/page-header";
import GeneratePdf from "@/components/pdf/generate-pdf";
import {get} from "@/utils/api";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import CustomTable from "@/components/tables/flexible-normal-table";
import moneyFormater from "@/components/moneyFormater";
import {createUrlWithFilters} from "@/utils/report-filter.helper";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import ReportFilterComponent from "@/components/report-filter.component";

const columns = [
    {header: 'Project Name', accessor: 'name'},
    {header: 'Date', accessor: 'formatted_created_date'},
    {header: 'Total Budget (Tzs)', accessor: 'total_budget',isAlignRight: true, isMoney: true},
    {header: 'Total Expenses (Tzs)', accessor: 'total_expense',  isAlignRight: true, isMoney: true},
    {header: 'Total Asset Value (Tzs)', accessor: 'total_asset_value', isAlignRight: true, isMoney: true },
    {header: 'Total Sale (Tzs)', accessor: 'total_sale', isAlignRight: true, isMoney: true},
    {header: 'Profit/Loss (Budget)', accessor: 'profit_loss_budget',isAlignRight: true, isMoney: true },
    {header: 'Budget Status', accessor: 'profit_loss_budget_status'},
    {header: 'Profit/Loss (Expense)', accessor: 'profit_loss_expense', isAlignRight: true, isMoney: true},
    {header: 'Expense Status', accessor: 'profit_loss_expense_status'},
];

function ProfitLoss() {
    const [data, setData] = useState<any>([])
    const [metadata, setMetaData] = useState<any>()
    const [loading, setLoading] = useState(false)
    const url = 'report/project/profit-loss'

    const filter_key = 'project-loss-report'
    const {state}  = useGlobalContextHook()
    const filters = state.filterBody;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const final_url = createUrlWithFilters(url, filter_key)
                const res = await get(final_url )

                if ( res.status === 200) {
                    setData(res.data.data.data)
                    setMetaData(res.data.data.metadata)
                    setLoading(false)
                }

            } catch (error: any) {
                if (error?.code === "ERR_NETWORK") {
                    console.log('an error happened')
                }
            }
        };
        fetchData()
    }, [filters])

    const pageRender = () =>{
        return <div className={'mt-2'}>
            <ReportFilterComponent
                from={filter_key}
                statusBody={[
                    {label: 'In Progress', value: 1},
                    {label: 'Closed', value: 2},
                ]}
                isApprovalFilter={true}
            />
            <CustomTable
                columns={columns}
                data={data}
            />
            <div className={'w-full flex justify-end mt-2'}>
                <div>
                    <h3 className={'text-xs font-medium'}>Summary</h3>
                    <div className={'grid grid-cols-2 gap-2 text-xs font-medium'}>
                        <p className={'border-r border-gray-400 pr-2'}> Total Budget:</p>
                        <p>{moneyFormater({amount: metadata?.total_budget, isShowCurrency: true})}</p>
                        <p className={'border-r border-gray-400 pr-2'}> Total Expense:</p>
                        <p>{moneyFormater({amount: metadata?.total_expense, isShowCurrency: true})}</p>
                        <p className={'border-r border-gray-400 pr-2'}> Total Asset Value:</p>
                        <p>{moneyFormater({amount: metadata?.total_asset, isShowCurrency: true})}</p>
                        <p className={'border-r border-gray-400 pr-2'}> Total Sale:</p>
                        <p>{moneyFormater({amount: metadata?.total_sale, isShowCurrency: true})}</p>
                    </div>
                </div>
            </div>
        </div>
    }

    return (
        <ProtectedRoute>
            <>

                {loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            subHeader={'Profit/Loss Report'}
                            isShowPage={true}
                            isDownload={true}
                            filter={filter_key}
                            ButtonDownloadComponent={
                                <GeneratePdf
                                    content={pageRender()}
                                    fileName="MyDocument.pdf"
                                    buttonLabel="Generate PDF"
                                />
                            }
                        />
                        {pageRender()}
                    </>
                }
            </>
        </ProtectedRoute>
    )
}

export default ProfitLoss