const CreateOptionsForselectHelper = (payload?: any[], from?: string, id?: string) => {
    let output: any[] = []
    if (payload && payload.length && from === 'departments') {
        payload.map(department => {
            const data = { label: department.name, value: department.id }
            output.push(data)
        })
    }

    if (payload && payload.length && from === 'indicators') {
        payload.map(indicator => {
            const data = { label: `${indicator.formatted_code} - ${indicator.name}`, value: indicator.id }
            output.push(data)
        })
    }

    if (payload && payload.length && from === 'users') {
        payload.map(user => {
            const data = { label: `${user.full_name} `, value: user.id }
            output.push(data)
        })
    }

    if (payload && payload.length && from === 'workshop-service') {
        payload.map(user => {
            const data = { label: `${user.purchase_order_name} -${user.name}  `, value: user.order_item_id }
            output.push(data)
        })
    }

    if (payload && payload.length && from === 'approvals') {
        payload.map(approval => {
            const data = { label: `${approval.slug} `, value: approval.id }
            output.push(data)
        })
    }

    if (payload && payload.length && from === 'supplier-items-category') {
        payload.map(item => {
            const data = { label: item.name, value: item.id }
            output.push(data)
        })
    }

    if (payload && payload.length && from === 'quotation-item') {
        payload.map(item => {
            const data = { label: item.name, value: item.id }
            output.push(data)
        })
    }

    if (payload && payload.length && from === 'invoice-type') {
        payload.map(item => {
            const data = { label: item, value: item }
            output.push(data)
        })
    }

    if (payload && payload.length && from === 'rfq') {
        payload.map(item => {
            const data = { label: item.formatted_code, value: item.id }
            output.push(data)
        })
    }

    return output
}
export default CreateOptionsForselectHelper