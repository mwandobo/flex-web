
import {toast, ToastPosition} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
interface Props {
    position?: ToastPosition;
    text: string;
    duration?: number; // Optional columns for nested tables
}

const ToastComponent = ({ text, position = "top-center", duration = 5000 }: Props) => {
    console.log('in toast in toast')
 toast.success(text, {
        position,
        autoClose: duration,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

export default ToastComponent;
