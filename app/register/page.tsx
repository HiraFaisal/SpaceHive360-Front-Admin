import { GalleryVerticalEnd } from "lucide-react"
import { CompanyRegistrationForm } from "@/components/company-registration-form"

export default function RegisterPage() {
  return (
    <div className="theme-login grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            SpaceHive360
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm md:max-w-xl">
            <CompanyRegistrationForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-10" />
        <img
          src="/abc.png"
          alt="Luxury Workspace"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3]"
        />
        <div className="absolute bottom-10 left-10 right-10 z-20 text-white">
          <h3 className="text-3xl font-bold mb-2">Elevate Your Workspace</h3>
          <p className="text-white/80 max-w-md">
            Streamline your bookings, manage your memberships, and grow your community with our premium coworking management solution.
          </p>
        </div>
      </div>
    </div>
  )
}
