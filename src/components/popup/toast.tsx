import {toast, ToastPosition} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    type?: 'error' | 'success';
    position?: ToastPosition;
    text: string;
    duration?: number; // Optional columns for nested tables
}

const ToastComponent = ({text, position = "top-center", duration = 5000, type}: Props) => {
    type === 'error' ?
        toast.error(text, {
            position,
            autoClose: duration,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
        :
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
