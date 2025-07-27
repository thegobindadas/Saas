"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";
import { OAuthStrategy } from "@clerk/types";
import { useSignIn } from "@clerk/nextjs";
import { ClerkAPIError } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useRouter } from "next/navigation";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BottomGradient from "@/components/ui/BottomGradient";
import Toast from "@/components/Toast";
import Link from "next/link";
import { ToastState } from "@/types";



function SignInPage() {

    const { isLoaded, setActive, signIn } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
    const [isGithubLoading, setIsGithubLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" });


    if (!isLoaded) {
        return null;
    }

    if (!signIn) return null


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const handelSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoaded) return;

        setIsLoading(true);
        setError("");
        setToast({ 
            show: false, 
            message: "", 
            type: "success"
        })
        
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password
            })

            if (signInAttempt.status !== "complete") {
                setError(JSON.stringify(signInAttempt, null, 2));
            }

            if (signInAttempt.status === "complete") {
                await setActive({ session: signInAttempt.createdSessionId })

                router.push("/home")
            }

        } catch (err: any) {
            const error = err.errors[0]
            console.log(error)
            setError(error.message || "Something went wrong. Please try again.");

            if (isClerkAPIResponseError(err) && error.code === "form_identifier_not_found") {
                setError("Please enter a valid email address.");              
            }

            if (isClerkAPIResponseError(err) && error.code === "form_password_incorrect") {
                setError("Please enter a valid password.");
                setToast({ 
                    show: true, 
                    message: "Please enter a valid password.", 
                    type: "error"
                })               
            }
        } finally {
            setIsLoading(false);
        }
    }


    const handleSignInWithGoogle = async () => {
        setIsGoogleLoading(true);
        setError("");
        
        try {
            return await signIn
                .authenticateWithRedirect({
                    strategy: "oauth_google",
                    redirectUrl: "/sign-in/sso-callback",
                    redirectUrlComplete: "/home",
                })

        } catch (err: any) {
            setError(err.errors[0].message || "Something went wrong. Please try again.");
            console.error(err, null, 2)
        } finally {
            setIsGoogleLoading(false);
        }
    }


    const handleSignInWithGithub = async () => {
        setIsGithubLoading(true);
        setError("");
        
        try {
            return await signIn
                .authenticateWithRedirect({
                    strategy: "oauth_github",
                    redirectUrl: "/sign-in/sso-callback",
                    redirectUrlComplete: "/home",
                })

        } catch (err: any) {
            setError(err.errors[0].message || "Something went wrong. Please try again.");
            console.error(err, null, 2)
        } finally {
            setIsGithubLoading(false);
        }
    }


    const handelCloseToast = () => {
        setToast({...toast, show: false})
    };



    return (
        <div className="flex items-center justify-center">
            {/* Custom Toast */}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={handelCloseToast}
                duration={5000} // 5 seconds
            />
            
            <div className="max-w-md w-full">
                {/* Main Login Card */}
                <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                <span className="text-white font-bold drop-shadow-lg">
                                    Welcome Back
                                </span>
                            </h1>
                            <p className="text-gray-400 text-sm font-medium">
                                Seamlessly manage and transform your digital content
                            </p>
                        </div>                       
                        
                        {/* Login Error Display */}
                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-800/50 backdrop-blur-sm">
                                <p className="text-red-400 text-sm font-medium">{error}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <Label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label htmlFor="password" className="block text-sm font-medium text-white">
                                    Password
                                </Label>
                                <Link
                                    href={"/forgot-password"}
                                    type="button"
                                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200 focus:outline-none focus:text-cyan-400"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your password"
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

                        {/* Login Button */}
                        <Button
                            type="button"
                            disabled={isLoading || isGoogleLoading || isGithubLoading}
                            onClick={handelSignIn}
                            className="relative group/btn w-full h-12 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            {isLoading ? "Logging in..." : "Log in →"}
                            <BottomGradient />
                        </Button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-900 text-gray-400">or continue with</span>
                            </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="space-y-3">
                            <button
                                type="button"
                                disabled={isLoading || isGoogleLoading || isGithubLoading}
                                onClick={() => handleSignInWithGoogle()}
                                className="relative group/btn w-full bg-gray-800 hover:bg-gray-700 disabled:hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-3 disabled:cursor-not-allowed"
                            >
                                {isGoogleLoading ? (
                                    <>
                                        {/* Professional spinning loader */}
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Connecting to Google...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                    Continue with Google
                                    </>
                                )}
                                <BottomGradient />
                            </button>

                            <button
                                type="button"
                                disabled={isLoading || isGoogleLoading || isGithubLoading}
                                onClick={() => handleSignInWithGithub()}
                                className="relative group/btn w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-3"
                            >
                                {isGithubLoading ? (
                                    <>
                                        {/* Professional spinning loader */}
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Connecting to GitHub...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                        Continue with GitHub
                                    </>
                                )}
                                <BottomGradient />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Register Prompt */}
                <div className="text-center mt-6">
                    <p className="text-gray-400 text-sm">
                        New to MediaMorph?{" "}
                        <Link href={"/sign-up"} className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium focus:outline-none focus:underline">
                            Create your account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}



export default SignInPage