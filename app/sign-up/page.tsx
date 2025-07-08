"use client";

import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import SignupForm from "@/components/SignUpForm";
import VerifyForm from "@/components/VerifyForm";



function SignUpPage() {

    const router = useRouter();
    const { isLoaded, setActive, signUp } = useSignUp();

    const [verifying, setVerifying] = useState(false);
    const [loading, setLoading] = useState(false)
    const [signupError, setSignupError] = useState("");
    const [veficationError, setVerificationError] = useState("");


    
    const signUpWithEmail = async (
        formData: 
        {
            firstName: string;
            lastName: string;
            emailAddress: string;
            password: string;
        }
    ) => {
        
        if (!isLoaded && !signUp) {
            return;
        }

        setLoading(true)
        setSignupError("");

        try {
            if (!formData.firstName || !formData.lastName || !formData.emailAddress || !formData.password) {
                setSignupError("Please fill in all required fields.");
                return;
            }


            const signupRes = await signUp.create(formData);
            console.log(signupRes)

            // send the email.
            await signUp.prepareEmailAddressVerification({strategy: "email_code"});

            console.log("After send otp:- ", signUp)
            // change the UI to our pending section.
            setVerifying(true);

        } catch (err: any) {
            setSignupError(err.errors[0].message);
        } finally {
            setLoading(false);
        }
    }


    const handleVerification = async (code: string) => {

        if (!isLoaded && !signUp) return;

        setLoading(true)
        setVerificationError("");

        try {

            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            
            if (signUpAttempt.status !== "complete") {
                console.error(JSON.stringify(signUpAttempt, null, 2));
                setVerificationError(JSON.stringify(signUpAttempt, null, 2))
            }

            if (signUpAttempt.status === "complete") {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.push("/")
            }

        } catch (err: any) {
            setVerificationError(err.errors[0].message);
        } finally {
            setLoading(false);
        }
    }



    return (
        <>
            {!verifying ?
                (<SignupForm 
                    signUpWithEmail={signUpWithEmail} 
                    signupError={signupError} 
                    loading={loading}
                />) 
                :
                (<VerifyForm 
                    handleVerification={handleVerification}
                    email={signUp?.emailAddress || "your@email.com"}
                    veficationError={veficationError}
                    isLoading={loading}
                />)
            }
        </>
    )
}



export default SignUpPage