"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { forgotPassword, resetPassword } from "@/lib/api/auth";
import { Loader2, Mail, Lock, CheckCircle2, ArrowRight, KeyRound } from "lucide-react";

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const [step, setStep] = useState(1); // 1: Email, 2: Reset
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await forgotPassword(email);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to request reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      await resetPassword({ email, code, newPassword });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center animate-fade-in-up">
        <div className="mb-6 rounded-2xl bg-primary/10 p-5 text-primary shadow-lg shadow-primary/5">
          <CheckCircle2 size={48} className="animate-in zoom-in-50 duration-500" />
        </div>
        <h2 className="mb-2 text-3xl font-bold tracking-tight">Password Reset!</h2>
        <p className="mb-8 text-muted-foreground max-w-md">
          Your password has been successfully updated. You can now log in with your new credentials.
        </p>
        <Button asChild className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            {step === 1 ? "Forgot Password?" : "Reset Password"}
          </h1>
          <p className="text-muted-foreground text-sm text-balance max-w-sm">
            {step === 1 
              ? "No worries! Enter your email and we'll send you a reset code." 
              : `We've sent a 6-digit code to ${email}`}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="email">Business Email</FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@creativehub.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </Field>

            {error && <p className="text-destructive text-sm text-center font-medium">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
              {loading ? <Loader2 className="animate-spin size-5 mr-2" /> : null}
              {loading ? "Sending..." : "Send Reset Code"}
              {!loading && <ArrowRight className="ml-2 size-4" />}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
             <Field>
              <FieldLabel htmlFor="code">Verification Code</FieldLabel>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="code"
                  placeholder="123456"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="pl-10 h-12 tracking-[0.5em] font-bold text-center"
                  maxLength={6}
                />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </Field>

            {error && <p className="text-destructive text-sm text-center font-medium">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
              {loading ? <Loader2 className="animate-spin size-5 mr-2" /> : null}
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="w-full text-sm text-muted-foreground hover:text-primary transition-colors py-2"
            >
              Use a different email
            </button>
          </form>
        )}

        <div className="text-center pt-4 border-t border-primary/10 mt-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Back to Login
          </Link>
        </div>
      </FieldGroup>
    </div>
  );
}
