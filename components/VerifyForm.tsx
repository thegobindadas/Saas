"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import BottomGradient from "./ui/BottomGradient";
import Link from "next/link";
import Toast from "./Toast";


interface VerifyFormProps {
  handleVerification: (code: string) => Promise<void>;
  email?: string;
  veficationError?: string;
  isLoading?: boolean;
}



function VerifyForm(
    {
        handleVerification,
        email,
        veficationError,
        isLoading
    }: VerifyFormProps
) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState<string>("");
    const [resendCountdown, setResendCountdown] = useState<number>(60); // Start with 60 seconds countdown
    const [canResend, setCanResend] = useState<boolean>(false); // Initially disabled
    
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);


    // Handle countdown timer
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (resendCountdown > 0) {
            interval = setInterval(() => {
                setResendCountdown((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendCountdown]);


    const handleOtpChange = (index: number, value: string) => {
        // Only allow single digit
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        // Clear error when user starts typing
        if (error) {
            setError("");
        }
        
        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };


    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                // If current input is empty and backspace is pressed, focus previous input
                inputRefs.current[index - 1]?.focus();
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };


    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        
        setOtp(newOtp);
        
        // Focus the next empty input or the last input
        const nextEmptyIndex = newOtp.findIndex(digit => !digit);
        const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);
        inputRefs.current[focusIndex]?.focus();
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const otpString = otp.join("");
        
        if (otpString.length !== 6) {
            setError("Please enter the complete 6-digit verification code.");
            return;
        }

        setError("");

        try {
            await handleVerification(otpString);

        } catch (error) {
            setError("Something went wrong. Please try again.");
        }
    };


    const handleResendCode = async () => {
        if (!canResend) return;
        
        setCanResend(false);
        setResendCountdown(60); // Reset to 60 seconds countdown
        setError("");
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("Verification code resent to:", email);
        } catch (error) {
            setError("Failed to resend code. Please try again.");
            setCanResend(true);
            setResendCountdown(0);
        }
    };


    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };



    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {/* Custom Toast 
            <Toast 
                show={toast.show} 
                message={toast.message} 
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            /> */}
            <div className="w-full max-w-md">
                {/* Main Verification Card */}
                <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        {/* Back Button */}
                        <Link href={"/sign-up"} className="absolute top-6 left-6 p-2 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>

                        {/* Icon */}
                        <div className="mb-6">
                            <div className="mx-auto w-16 h-16 bg-cyan-500 bg-opacity-20 rounded-full flex items-center justify-center">
                                <Mail className="h-8 w-8 text-cyan-400" />
                            </div>
                        </div>

                        {/* Title and Description */}
                        <h2 className="text-2xl font-bold text-white mb-2">Verify your email</h2>
                        <p className="text-gray-400 text-sm mb-2">
                            We've sent a 6-digit verification code to
                        </p>
                        <p className="text-white font-medium text-sm mb-6">{email}</p>

                        {/* Verification Error Display */}
                        {(error || veficationError) && (
                            <div className="mb-6 p-3 rounded-lg bg-red-900/20 border border-red-800/50 backdrop-blur-sm">
                                <p className="text-red-400 text-sm font-medium">{error || veficationError}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* OTP Input Fields */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-4 text-center">
                                Enter verification code
                            </label>
                            <div className="flex gap-3 justify-center">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el: HTMLInputElement | null) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className="w-12 h-12 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                                        aria-label={`Digit ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="relative group/btn w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Verifying...
                                </div>
                            ) : (
                                "Verify Email"
                            )}
                            <BottomGradient />
                        </button>

                        {/* Resend Code Section */}
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-2">
                                Didn't receive the code?
                            </p>
                            {!canResend ? (
                                <p className="text-gray-500 text-sm">
                                    Resend code in {formatTime(resendCountdown)}
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium focus:outline-none focus:underline text-sm"
                                >
                                    Resend code
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <div className="text-center mt-6">
                    <p className="text-gray-400 text-xs">
                        Having trouble? Check your spam folder or{" "}
                        <Link href={"/contact"} className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus:underline">
                            contact support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}



export default VerifyForm;