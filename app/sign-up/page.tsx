"use client";

import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import SignupForm from "@/components/SignUpForm";
import VerifyForm from "@/components/VerifyForm";
import { UserSignUpData, ToastState } from "@/types";



function SignUpPage() {

    const router = useRouter();
    const { isLoaded, setActive, signUp } = useSignUp();

    const [emailAddress, setEmailAddress] = useState<string>("");
    const [verifying, setVerifying] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const [error , setError] = useState<string>("");
    const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" });


    const signUpWithEmail = async (
        formData: UserSignUpData
    ) => {
        
        if (!isLoaded && !signUp) {
            return;
        }

        setLoading(true);
        setError("");
        setToast({ 
            show: false, 
            message: "", 
            type: "success" 
        });

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
                message: "A verification code sent to your email. Please check your inbox.", 
                type: "success" 
            });

        } catch (err: any) {
            setError(err.errors[0].message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }


    const handleVerification = async (code: string) => {

        if (!isLoaded && !signUp) return;

        setLoading(true);
        setError("");
        setToast({ 
            show: false, 
            message: "", 
            type: "success" 
        });
        

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

                setToast({ 
                    show: true, 
                    message: "Email verified successfully! Redirecting...", 
                    type: "success" 
                });

                router.push("/home")
            }

        } catch (err: any) {
            setError(err.errors[0].message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }


    const handleResendCode = async () => {
        if (!isLoaded) return;

        try {
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        } catch (err: any) {
            setError(err.errors[0].message || "Failed to resend code. Please try again.");
        }
    };



    return (
        <>
            {!verifying ?
                (<SignupForm 
                    signUpWithEmail={signUpWithEmail} 
                    signupError={error}
                    loading={loading}
                    toast={toast}
                    setToast={setToast}
                />) 
                :
                (<VerifyForm 
                    handleVerification={handleVerification}
                    email={emailAddress}
                    veficationError={error}
                    isLoading={loading}
                    toast={toast}
                    setToast={setToast}
                    resendCode={handleResendCode}
                />)
            }
        </>
    )
}



export default SignUpPage