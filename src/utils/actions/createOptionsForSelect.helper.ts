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

    if (payload && payload.length && from === 'approvals') {
        payload.map(approval => {
            const data = { label: `${approval.slug} `, value: approval.id }
            output.push(data)
        })
    }

    if (payload && payload.length && from === 'supplier-items-category') {
        payload.map(item => {
            const data = { name: item.name, value: item.id }
            output.push(data)
        })
    }

    return output
}
export default CreateOptionsForselectHelper