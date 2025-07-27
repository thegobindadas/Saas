"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import BottomGradient from "./ui/BottomGradient";
import Link from "next/link";
import { UserSignUpData } from "@/types";


interface SignUpFormProps {
    handleSignUpWithEmail: (formData: UserSignUpData) => void;
    isLoading?: boolean;
    handleGoogleSignUp: () => void;
    isGoogleLoading?: boolean
    handleGithubSignUp: () => void;
    isGithubLoading?: boolean
    signupError: string;
}



export default function SignupForm(
    {
        handleSignUpWithEmail,
        isLoading,
        handleGoogleSignUp,
        isGoogleLoading,
        handleGithubSignUp,
        isGithubLoading,
        signupError,
    } : SignUpFormProps
) {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserSignUpData>({
        firstName: "",
        lastName: "",
        emailAddress: "",
        password: "",
    });
    

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        handleSignUpWithEmail(formData);
        console.log("Form submitted:", formData);
    };



    return (
        <div className="w-full max-w-lg">
            {/* Main Signup Card */}
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8 shadow-2xl">
                <div className="text-center mb-8">
                    {/* Signup Section Title */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            <span className="text-white font-bold drop-shadow-lg">
                                Create your account
                            </span>
                        </h1>
                        <p className="text-gray-400 text-sm font-medium">
                            Unlock powerful tools for media processing and collaboration
                        </p>
                    </div>  
                    
                    {/* Signup Error Display */}
                    {signupError && (
                        <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-800/50 backdrop-blur-sm">
                            <p className="text-red-400 text-sm font-medium">{signupError}</p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Name Fields Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="Enter first name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Enter last name"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <Label htmlFor="emailAddress" className="block text-sm font-medium text-white mb-2">
                            Email Address
                        </Label>
                        <Input
                            id="emailAddress"
                            name="emailAddress"
                            type="email"
                            value={formData.emailAddress}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <Label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Create a password"
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

                    {/* Captcha */}
                    <div id="clerk-captcha" className="hidden"></div>

                    {/* Sign Up Button */}
                    <Button
                        type="button"
                        disabled={isLoading || isGoogleLoading || isGithubLoading}
                        onClick={handleSubmit}
                        className="relative group/btn w-full h-12 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Creating Account...
                            </span>
                            ) : (
                            "Create Account"
                        )}
                        <BottomGradient />
                    </Button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-900 text-gray-400">or sign up with</span>
                        </div>
                    </div>

                    {/* Social Sign Up Buttons */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            disabled={isLoading || isGoogleLoading || isGithubLoading}
                            onClick={handleGoogleSignUp}
                            className="relative group/btn w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center gap-3"
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
                            onClick={handleGithubSignUp}
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

            {/* Login Prompt */}
            <div className="text-center mt-6">
                <p className="text-gray-400 text-sm">
                    Already have an account?{" "}
                    <Link href={"/sign-in"} className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium focus:outline-none focus:underline">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}