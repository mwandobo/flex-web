
import {toast, ToastPosition} from "react-toastify";


interface Props {
    position?: ToastPosition;
    text: string;
    duration?: number; // Optional columns for nested tables
}

const ToastComponent = ({ text, position = "top-right", duration = 5000 }: Props) => {
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
