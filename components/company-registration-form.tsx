"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerCompany } from "@/lib/api/companies";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CompanyRegistrationForm({ className, ...props }: React.ComponentProps<"form">) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    taxId: "",
    contactPersonName: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await registerCompany(formData);
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || "Registration failed.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Registration Submitted!</h2>
        <p className="mb-6 text-muted-foreground">
          Your company <strong>{formData.name}</strong> has been registered successfully. 
          Our super admins will review your application soon.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <Button asChild className="w-full">
            <Link href="/registration-status">
              Check Status <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-3xl font-bold italic tracking-tight">Register Your Space</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Join SpaceHive360 and manage your coworking community with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field className="col-span-full md:col-span-1">
            <FieldLabel htmlFor="name">Company Name*</FieldLabel>
            <Input
              id="name"
              placeholder="e.g. Creative Hub"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </Field>

          <Field className="col-span-full md:col-span-1">
            <FieldLabel htmlFor="email">Business Email*</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="admin@creativehub.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </Field>

          <Field className="col-span-full md:col-span-1">
            <FieldLabel htmlFor="contactPersonName">Contact Person*</FieldLabel>
            <Input
              id="contactPersonName"
              placeholder="Full Name"
              required
              value={formData.contactPersonName}
              onChange={handleChange}
            />
          </Field>

          <Field className="col-span-full md:col-span-1">
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <Input
              id="phone"
              placeholder="+1 234 567 890"
              value={formData.phone}
              onChange={handleChange}
            />
          </Field>

          <Field className="col-span-full">
            <FieldLabel htmlFor="address">Official Address</FieldLabel>
            <Input
              id="address"
              placeholder="Street Name, City, Country"
              value={formData.address}
              onChange={handleChange}
            />
          </Field>

          <Field className="col-span-full md:col-span-1">
            <FieldLabel htmlFor="website">Website</FieldLabel>
            <Input
              id="website"
              placeholder="https://creativehub.com"
              value={formData.website}
              onChange={handleChange}
            />
          </Field>

          <Field className="col-span-full md:col-span-1">
            <FieldLabel htmlFor="taxId">Tax/Business ID</FieldLabel>
            <Input
              id="taxId"
              placeholder="VAT / REG-12345"
              value={formData.taxId}
              onChange={handleChange}
            />
          </Field>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive text-sm font-medium animate-in fade-in duration-200">
            <AlertCircle className="size-4" />
            <p>{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
          {loading ? "Submitting Application..." : "Register Company"}
        </Button>

        <div className="text-center text-sm">
          Already registered?{" "}
          <Link href="/registration-status" className="underline underline-offset-4 font-medium hover:text-primary">
            Check Status
          </Link>
          <div className="mt-2">
            <Link href="/login" className="text-muted-foreground hover:text-foreground">
              Back to Login
            </Link>
          </div>
        </div>
      </FieldGroup>
    </form>
  );
}
