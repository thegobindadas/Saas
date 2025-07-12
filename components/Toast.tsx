"use client";

import React, { useEffect, useRef } from "react";
import { ToastState } from "@/types";


type ToastProps = ToastState & {
    onClose: () => void;
};



function Toast({ show, message, type = "success", onClose }: ToastProps) {
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);


    useEffect(() => {
        if (show) {
            // Clear any existing timers before setting a new one
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            timerRef.current = setTimeout(() => {
                onClose();
            }, 4000); // Auto-dismiss after 4 seconds
        }

        return () => {
            // Clear timer when component unmounts or on re-run
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [show, onClose]);


    if (!show) return null;



    return (
        <div>

        </div>
    )
}



export default Toast