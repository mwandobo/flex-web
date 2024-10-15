import Swal from 'sweetalert2';

interface ConfirmationModalProps {
    title: string;
    text: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

export function showConfirmationModal({
                                          title,
                                          text,
                                          confirmText = 'Yes',
                                          cancelText = 'No',
                                          onConfirm,
                                          onCancel
                                      }: ConfirmationModalProps) {
    Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true,
        customClass: {
            actions: 'flex justify-between w-full', // Custom class for action buttons
            confirmButton: 'mx-4 px-4 py-2 bg-green-500 text-white rounded',
            cancelButton: 'mx-4 px-4 py-2 bg-red-500 text-white rounded',
        },
        buttonsStyling: false, // Optional: swaps the order of the buttons
    }).then((result) => {
        if (result.isConfirmed) {
            // Handle the "Yes" action
            onConfirm();
        } else if (result.dismiss === Swal.DismissReason.cancel && onCancel) {
            // Handle the "No" action if provided
            onCancel();
        }
    });
}

// Example usage within your component
