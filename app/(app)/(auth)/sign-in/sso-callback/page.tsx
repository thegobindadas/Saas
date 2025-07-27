"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";



function SSOCallbackPage() {


  return <AuthenticateWithRedirectCallback />
}



export default SSOCallbackPage