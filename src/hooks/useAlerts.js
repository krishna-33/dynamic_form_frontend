import React from 'react'
import { toast } from 'react-toastify'

export default function useAlerts() {
    const successMessage = (message = "") => {
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000
        });
    }
    const errorMessage = (message = "") => {
        toast.error(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000
        });
    }
    return {
        success: successMessage,
        error: errorMessage
    }
}
