
interface Props {
    status?: string
}

const ProgressStatus = ({
    status,
}: Props) => {
    let name: string;
    let background: string;





    switch (status) {
        case 'created':
            name = "Pending";
            background = "bg-blue-100";
            break;
        case 'start':
            name = "In Progress";
            background = "bg-yellow-100";
            break;

        case 'complete':
            name = "Completed";
            background = "bg-green-100";
            break;
        default: break;
    }

    return <p className={`${background} text-center`}> {name} </p>

}

export default ProgressStatus;