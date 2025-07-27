"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import BottomGradient from "@/components/ui/BottomGradient";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { log } from "console";


interface OTPInputProps {
    value: string;
    onChange: (value: string) => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
}



// OTP Input Component
const OTPInput = ({ value, onChange, onKeyPress }: OTPInputProps) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {

        const val = e.target.value;

        if (val.length <= 1 && /^\d*$/.test(val)) {
            const newOTP = value.split('');
            newOTP[index] = val;
            onChange(newOTP.join(""));
            
            // Auto-focus next input
            if (val && index < 5) {
                const nextInput = e.target.parentNode?.children[index + 1];
                if (nextInput instanceof HTMLElement) nextInput.focus();
            }
        }
    };


    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !value[index] && index > 0) {
            const prevInput = (e.target as HTMLElement).parentNode?.children[index - 1];
            if (prevInput instanceof HTMLElement) prevInput.focus();
        } else if (e.key === "Enter") {
            onKeyPress(e);
        }
    };


    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        onChange(pastedData.padEnd(6, ""));
        
        // Focus the last filled input or the first empty one
        const nextIndex = Math.min(pastedData.length, 5);
        const nextInput = (e.target as HTMLElement).parentNode?.children[nextIndex];
        if (nextInput instanceof HTMLElement) nextInput.focus();
    };



    return (
        <div className="flex gap-3 justify-center">
            {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[index] || ""}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-semibold bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                />
            ))}
        </div>
    );
};



// Main Forgot Password Page Component
const ForgotPasswordPage = () => {

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isEmailValidated, setIsEmailValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendCountdown, setResendCountdown] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const [animationState, setAnimationState] = useState("initial"); // "initial", "expanding", "expanded"

    const router = useRouter()
    const { isSignedIn } = useAuth()
    const { isLoaded, signIn, setActive } = useSignIn()


    useEffect(() => {
        if (isSignedIn) {
            router.push("/home")
        }
    }, [isSignedIn, router])


    if (!isLoaded) {
        return null
    }


    // Format time for countdown display
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };


    // Countdown timer effect
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


    // Email validation function
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    // Handle sending reset code
    const handleSendCode = async () => {
        setError("");
        setIsLoading(true);

        // Validate email
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        try {
                        
            await signIn
                ?.create({
                    strategy: "reset_password_email_code",
                    identifier: email,
                })

            console.log('====================================');
            console.log(signIn);
            console.log('====================================');

            // Start animation sequence
            setIsEmailValidated(true);
            setAnimationState("expanding");
            
            // Smooth transition timing
            setTimeout(() => {
                setAnimationState("expanded");
            }, 150);
            
            // Start countdown
            setResendCountdown(60);
            setCanResend(false);
        } catch (err: any) {
            setError(err.errors[0].longMessage || "Failed to send reset code. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    // Handle resend code
    const handleResendCode = async () => {
        setError("");
        
        try {
            // Simulate API call for resending code
            await new Promise(resolve => setTimeout(resolve, 1000));
 
            // Reset countdown
            setResendCountdown(60);
            setCanResend(false);
        } catch (err) {
            setError("Failed to resend code. Please try again.");
        }
    };


    // Handle password reset
    const handleResetPassword = async () => {
        setError("");
        setIsLoading(true);

        if (otp.length !== 6) {
            setError("Please enter the complete 6-digit code");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            setIsLoading(false);
            return;
        }

        try {
            const result = await signIn
                ?.attemptFirstFactor({
                    strategy: "reset_password_email_code",
                    code: otp,
                    password,
                })
            

            if (result.status === "needs_second_factor") {
                    console.log("Second factor required");
                    setError('')
            } else if (result.status === "complete") {
                setActive({ session: result.createdSessionId })
                setError("")
            } else {
                console.log(result)
            }


            // Reset form after successful password reset
            setTimeout(() => {
                setEmail("");
                setOtp("");
                setPassword("");
                setConfirmPassword("");
                setIsEmailValidated(false);
                setAnimationState("initial");
                setError("");
                setResendCountdown(0);
                setCanResend(false);
            }, 3000);
        } catch (err: any) {
            setError(err.errors[0].longMessage || "Failed to reset password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            if (!isEmailValidated) {
                handleSendCode();
            } else if (otp.length === 6 && password && confirmPassword && password === confirmPassword) {
                handleResetPassword();
            }
        }
    };


    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);


    // Animation classes for smooth transitions
    const getAnimationClasses = () => {
        switch (animationState) {
            case "initial":
                return "max-h-0 opacity-0 -translate-y-8 pointer-events-none";
            case "expanding":
                return "max-h-96 opacity-0 -translate-y-4 pointer-events-none";
            case "expanded":
                return "max-h-96 opacity-100 translate-y-0 pointer-events-auto";
            default:
                return "max-h-0 opacity-0 -translate-y-8 pointer-events-none";
        }
    };



    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {/* Custom Toast */}
            
            <div className="max-w-md w-full">
                {/* Main Card */}
                <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl overflow-hidden">
                    <div className="text-center mb-8">
                        
                        {/* Dynamic Title */}
                        <div className="transition-all duration-500 ease-out">
                            <h2 className="text-xl font-semibold text-white mb-2">
                                {!isEmailValidated ? "Reset your password" : "Set new password"}
                            </h2>
                            <p className="text-gray-400 text-sm">
                                {!isEmailValidated 
                                    ? "Enter your email address and we\'ll send you a password reset code"
                                    : `Enter the code sent to ${email} and set your new password`
                                }
                            </p>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-900/20 border border-red-800/50 backdrop-blur-sm animate-fadeIn">
                            <p className="text-red-400 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <div className="space-y-0">
                        {/* Email Field */}
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isEmailValidated}
                                className={`w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 ease-out ${
                                    isEmailValidated ? "opacity-60 cursor-not-allowed bg-gray-800 bg-opacity-30" : ""
                                }`}
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* Expandable Section */}
                        <div className={`transition-all duration-700 ease-out overflow-hidden ${getAnimationClasses()}`}>
                            <div className="space-y-6 pb-2">
                                {/* OTP Field */}
                                <div>
                                    <label className="block text-sm font-medium text-white mb-3 text-center">
                                        Enter 6-digit verification code
                                    </label>
                                    <OTPInput
                                        value={otp}
                                        onChange={setOtp}
                                        onKeyPress={handleKeyPress}
                                    />
                                    {otp.length > 0 && otp.length < 6 && (
                                        <p className="text-amber-400 text-xs mt-2 text-center">
                                            Please enter all 6 digits
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="w-full px-4 py-3 pr-12 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Enter your new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="w-full px-4 py-3 pr-12 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Confirm your new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleConfirmPasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:text-white"
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    {password && confirmPassword && password !== confirmPassword && (
                                        <p className="text-red-400 text-sm mt-2">Passwords do not match</p>
                                    )}
                                </div>

                                {/* Resend Code Section */}
                                <div className="text-center pt-2">
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

                        {/* Action Button */}
                        <div className="pt-0">
                            <button
                                type="button"
                                onClick={isEmailValidated ? handleResetPassword : handleSendCode}
                                disabled={
                                    isLoading || 
                                    (isEmailValidated && (
                                        otp.length !== 6 || 
                                        password !== confirmPassword || 
                                        !password || 
                                        !confirmPassword
                                    ))
                                }
                                className="relative group/btn w-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading 
                                    ? (isEmailValidated ? "Resetting password..." : "Sending code...") 
                                    : (isEmailValidated ? "Reset password →" : "Send password reset code →")
                                }
                                <BottomGradient />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Back to Login Prompt */}
                <div className="text-center mt-6">
                    <p className="text-gray-400 text-sm">
                        Remember your password?{" "}
                        <Link href={"/sign-in"} className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium focus:outline-none focus:underline">
                            Back to login
                        </Link>
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};



export default ForgotPasswordPage;