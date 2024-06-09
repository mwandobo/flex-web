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



    return output
}
export default CreateOptionsForselectHelper