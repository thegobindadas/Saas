import { LucideIcon } from "lucide-react";



export type PublicMetadata = {
  role?: string;
};


export interface UserSignUpData {
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
}


export interface UserProfile {
    name: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    avatar: string;
}


export interface SidebarItem {
    id: string;
    href: string;
    label: string;
    icon: LucideIcon;
}