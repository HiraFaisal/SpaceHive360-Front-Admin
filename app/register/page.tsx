"use client";
import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"

import { CompanyRegistrationForm } from "@/components/company-registration-form"

export default function RegisterPage() {
  return (
    <div className="theme-login login-gradient grid min-h-svh lg:grid-cols-2">
      <div className="relative flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-semibold text-primary transition-colors hover:opacity-80">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-xl shadow-lg shadow-primary/20">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <span className="text-xl tracking-tight">SpaceHive360</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="glass animate-fade-in-up w-full max-w-sm rounded-3xl p-8 md:max-w-xl">
            <CompanyRegistrationForm />
          </div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img
          src="/login-right-image.jpg"
          alt="Luxury Workspace"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-20" />
        <div className="absolute bottom-12 left-12 right-12 text-white z-30">
          <h2 className="mb-4 text-4xl font-bold leading-tight">Join Our Global Network</h2>
          <p className="text-lg font-medium opacity-90">Streamline your bookings, manage memberships, and grow your community with ease.</p>
        </div>
      </div>
    </div>
  )
}
