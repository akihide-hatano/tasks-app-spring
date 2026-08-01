import { useState } from "react";
import type { Notice } from "../types/Notice";

export function useNotice() {
    const [notice,setNotice] = useState<Notice | null>(null);

    const showNotice = (newNotice: Notice) => {
        setNotice(newNotice);
        setTimeout(() => {
            setNotice(null);
        }, 3000);
    }

    const showSuccess = (message: string) => {
        showNotice({
            type: "success",
            message,
        });
    };

    const showError = (message: string) => {
        showNotice({
            type:"error",
            message,
        })
    };

    return {
        notice,
        showNotice,
        showSuccess,
        showError
    };
}