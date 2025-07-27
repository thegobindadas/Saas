import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";
import { ToastState } from "@/types";


type ToastProps = ToastState & {
    onClose: () => void;
    duration: number
};



const Toast = ({ show, message, type, onClose, duration = 5000 }: ToastProps) => {

  const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
        
            // Auto-close timer
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [show, duration]);


    const handleClose = () => {
        setIsVisible(false);
        // Small delay before calling onClose to allow fade out animation
        setTimeout(() => {
            onClose?.();
        }, 300);
    };


    if (!show && !isVisible) return null;


    const bgColor = type === "success" 
        ? "bg-green-900/20 border-green-800/50" 
        : "bg-red-900/20 border-red-800/50";
  
    const textColor = type === "success" 
        ? "text-green-400" 
        : "text-red-400";



    return (
        <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
        }`}>
            <Alert className={`${bgColor} px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm border relative pr-10 max-w-sm`}>
                <AlertDescription className={`${textColor} font-medium`}>
                    {message}
                </AlertDescription>
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-200"
                    aria-label="Close toast"
                >
                    <X size={16} />
                </button>
            </Alert>
        </div>
    );
};



export default Toast