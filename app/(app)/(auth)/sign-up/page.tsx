"use client";

import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import SignupForm from "@/components/SignUpForm";
import VerifyForm from "@/components/VerifyForm";
import Toast from "@/components/Toast";
import { UserSignUpData, ToastState } from "@/types";


function SignUpPage() {

    const router = useRouter();
    const { isLoaded, setActive, signUp } = useSignUp();

    const [emailAddress, setEmailAddress] = useState<string>("");
    const [verifying, setVerifying] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
    const [isGithubLoading, setIsGithubLoading] = useState<boolean>(false)
    const [error , setError] = useState<string>("");
    const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" });



    const handleSignUpWithEmail = async (
        formData: UserSignUpData
    ) => {
        
        if (!isLoaded && !signUp) {
            return;
        }

        setIsLoading(true);
        setError("");
        setToast({ 
            show: false, 
            message: "", 
            type: "success"
        })
        
        try {
            if (!formData.firstName || !formData.lastName || !formData.emailAddress || !formData.password) {
                setError("Please fill in all required fields.");
                return;
            }


            await signUp.create({
                firstName: formData.firstName,
                lastName: formData.lastName,
                emailAddress: formData.emailAddress,
                password: formData.password,
            });
            

            // send the email.
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            // set the email address
            setEmailAddress(signUp?.emailAddress || formData?.emailAddress);

            // change the UI to our pending section.
            setVerifying(true);

            setToast({ 
                show: true, 
                message: "We've sent a verification code to your registered email. Please check your inbox (and spam folder) to proceed.", 
                type: "success"
            })

        } catch (err: any) {
            setError(err.errors[0].message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }


    const handleVerification = async (code: string) => {

        if (!isLoaded && !signUp) return;

        setIsLoading(true);
        setError("");
        setToast({ 
            show: false, 
            message: "", 
            type: "success"
        })

        try {

            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            
            if (signUpAttempt.status !== "complete") {
                console.error(JSON.stringify(signUpAttempt, null, 2));
                setError(JSON.stringify(signUpAttempt, null, 2))
            }

            if (signUpAttempt.status === "complete") {
                await setActive({ session: signUpAttempt.createdSessionId })

                router.push("/home")

                setToast({ 
                    show: true, 
                    message: "Email verified successfully!", 
                    type: "success"
                })
            }

        } catch (err: any) {
            console.log(err.errors)
            if (err.errors[0].code === "form_code_incorrect" && err.errors[0].longMessage === "Incorrect code") {
                setError(err.errors[0].longMessage)
                setToast({ 
                    show: true, 
                    message: "Oops! That code doesn’t match. Please re-enter the correct code.", 
                    type: "error"
                })
            } else {
                setError(err.errors[0].message || "Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }


    const handleResendCode = async () => {
        if (!isLoaded) return;

        try {
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            setToast({ 
                show: true, 
                message: "A new verification code has been sent to your registered email.", 
                type: "success"
            })

        } catch (err: any) {
            setError(err.errors[0].message || "Failed to resend code. Please try again.");
        }
    };


    const handleGoogleSignUp = async () => {  
        if (!isLoaded) return;

        setIsGoogleLoading(true);
        setError("");

        try {
            await signUp.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sign-in/sso-callback",
                redirectUrlComplete: "/home",
            });
        } catch (err: any) {
            if (err.code === "authentication_failed") {
                setError("Authentication with Google failed. Please try again.");
            } else if (err.code === "form_identifier_exists") {
                setError("An account with this Google email already exists. Please sign in instead.");
            } else {
                setError(err.errors[0]?.message || "An error occurred during Google sign-up. Please try again.");
            }
            console.log(err?.errors[0])
        } finally {
           setIsGoogleLoading(false);
        }
    }


    const handleGithubSignUp = async () => {  
        if (!isLoaded) return;

        setIsGithubLoading(true);
        setError("");

        try {
            await signUp.authenticateWithRedirect({
                strategy: "oauth_github",
                redirectUrl: "/sign-in/sso-callback",
                redirectUrlComplete: "/home",
            });
        } catch (err: any) {
            if (err.code === "authentication_failed") {
                setError("Authentication with Github failed. Please try again.");
            } else if (err.code === "form_identifier_exists") {
                setError("An account with this Google email already exists. Please sign in instead.");
            } else {
                setError(err.errors[0]?.message || "An error occurred during Github sign-up. Please try again.");
            }
        } finally {
           setIsGithubLoading(false);
        }
    }


    const handelCloseToast = () => {
        setToast({...toast, show: false})
    };



    return (
        <div className="flex items-center justify-center">
            {/* Custom Toast  */}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={handelCloseToast}
                duration={5000} // 5 seconds
            />

            {!verifying ?
                (<SignupForm 
                    handleSignUpWithEmail={handleSignUpWithEmail}
                    isLoading={isLoading}
                    handleGoogleSignUp={handleGoogleSignUp}
                    isGoogleLoading={isGoogleLoading}
                    handleGithubSignUp={handleGithubSignUp}
                    isGithubLoading={isGithubLoading}
                    signupError={error}
                />) 
                :
                (<VerifyForm 
                    handleVerification={handleVerification}
                    email={emailAddress}
                    veficationError={error}
                    isLoading={isLoading}
                    resendCode={handleResendCode}
                />)
            }
        </div>
    )
}



export default SignUpPage