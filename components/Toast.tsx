"use client";

import { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";


type ToastProps = {
    show: boolean;
    message: string;
    type?: "success" | "error";
    onClose: () => void;
};



const Toast = ({ show, message, type = "success", onClose } : ToastProps) => {

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000); // Auto-dismiss after 4 seconds
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);


    if (!show) return null;



    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
            <div className={`
                px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm border max-w-sm
                ${type === "success" 
                    ? "bg-green-900/20 border-green-800/50 text-green-400" 
                    : "bg-red-900/20 border-red-800/50 text-red-400"
                }
            `}>
                <div className="flex items-center gap-3">
                    {type === "success" ? (
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    ) : (
                        <X className="h-5 w-5 text-red-400 flex-shrink-0" />
                    )}
                    <p className="text-sm font-medium">{message}</p>
                    <button
                        onClick={onClose}
                        className="ml-auto text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};



export default Toast;