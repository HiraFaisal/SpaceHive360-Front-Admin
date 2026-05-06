import { GalleryVerticalEnd } from "lucide-react"
import { CompanyStatusCheck } from "@/components/company-status-check"

export default function RegistrationStatusPage() {
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
          <div className="w-full max-w-sm md:max-w-md">
            <CompanyStatusCheck />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10" />
        <img
          src="/abc.png"
          alt="Luxury Workspace"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center text-white w-full px-10">
          <h2 className="text-4xl font-extrabold mb-4 tracking-tighter italic">Track Your Journey</h2>
          <p className="text-white/80 text-lg">
            We are carefully reviewing your application to ensure the best possible experience for our community.
          </p>
        </div>
      </div>
    </div>
  )
}
