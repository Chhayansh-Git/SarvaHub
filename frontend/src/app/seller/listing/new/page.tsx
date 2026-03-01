"use client";

import { useState } from "react";
import { Check, ChevronRight, UploadCloud, Box, ShieldCheck, Tag, LayoutGrid, Settings, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

// Form Components
import { BasicDetailsForm } from "./_steps/BasicDetailsForm";
import { AuthenticityForm } from "./_steps/AuthenticityForm";
import { CategoryAttributesForm } from "./_steps/CategoryAttributesForm";
import { ProductMediaUpload } from "./_steps/ProductMediaUpload";
import { PricingInventoryForm } from "./_steps/PricingInventoryForm";
import { ShippingReturnsForm } from "./_steps/ShippingReturnsForm";
import { ListingReview } from "./_steps/ListingReview";

const STEPS = [
    { title: "Basic Details", icon: Box },
    { title: "Authenticity", icon: ShieldCheck },
    { title: "Attributes", icon: LayoutGrid },
    { title: "Media", icon: UploadCloud },
    { title: "Pricing & Stock", icon: Tag },
    { title: "Shipping", icon: Truck },
    { title: "Review", icon: Settings }
];

export default function NewListingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Master Form State
    const [formData, setFormData] = useState<any>({
        // Basic
        name: "", shortDescription: "", category: "", brand: "", condition: "new",
        // Authenticity
        sellerType: "reseller", mpn: "", countryOfOrigin: "India", manufactureDate: "",
        // Pricing
        mrp: "", sellingPrice: "", inventory: "", hsnCode: "", taxCategory: "18",
        // Shipping
        weight: "", length: "", width: "", height: "", returnPolicy: "default"
    });

    const handleNext = () => {
        if (currentStep < 7) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-700 text-center">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                    <Check className="h-12 w-12 text-emerald-500" />
                </div>
                <h1 className="text-4xl font-heading font-black tracking-tight mb-4">Product Submitted</h1>
                <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                    Your listing has been submitted and is currently undergoing Authenticity Verification. It will be live on the marketplace within 24 hours.
                </p>
                <div className="flex gap-4">
                    <button onClick={() => router.push("/seller/dashboard")} className="px-6 py-3 glass-panel rounded-xl font-medium hover:bg-muted transition-colors">
                        Go to Dashboard
                    </button>
                    <button onClick={() => window.location.reload()} className="px-6 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors shadow-lg">
                        List Another Product
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">

            <div className="mb-8">
                <h1 className="text-3xl font-heading font-black tracking-tight">Create New Listing</h1>
                <p className="text-muted-foreground mt-2">All products must undergo strict authenticity verification before going live.</p>
            </div>

            {/* Progress Stepper */}
            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 custom-scrollbar">
                {STEPS.map((step, idx) => {
                    const stepNumber = idx + 1;
                    const isActive = currentStep === stepNumber;
                    const isCompleted = currentStep > stepNumber;

                    return (
                        <div key={idx} className="flex items-center">
                            <div className={`flex flex-col items-center gap-2 group transition-all duration-300 w-24 ${isActive ? "opacity-100" : isCompleted ? "opacity-70" : "opacity-40"
                                }`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20 scale-110" :
                                        isCompleted ? "bg-emerald-500 text-white" :
                                            "glass-panel border-border"
                                    }`}>
                                    {isCompleted ? <Check className="h-6 w-6" /> : <step.icon className={`h-5 w-5 ${isActive ? "" : "text-muted-foreground"}`} />}
                                </div>
                                <span className={`text-[10px] font-bold uppercase text-center w-full leading-tight ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                                    {step.title}
                                </span>
                            </div>

                            {idx < STEPS.length - 1 && (
                                <div className={`w-12 md:w-20 h-0.5 mx-2 rounded-full transition-all duration-500 ${isCompleted ? "bg-emerald-500" : "bg-border"
                                    }`} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Form Area Wrapper */}
            <div className="glass-panel p-6 md:p-8 rounded-3xl border-border/50 min-h-[500px] mb-8 relative bg-background/50">
                {currentStep === 1 && <BasicDetailsForm formData={formData} setFormData={setFormData} />}
                {currentStep === 2 && <AuthenticityForm formData={formData} setFormData={setFormData} />}
                {currentStep === 3 && <CategoryAttributesForm formData={formData} setFormData={setFormData} />}
                {currentStep === 4 && <ProductMediaUpload formData={formData} setFormData={setFormData} />}
                {currentStep === 5 && <PricingInventoryForm formData={formData} setFormData={setFormData} />}
                {currentStep === 6 && <ShippingReturnsForm formData={formData} setFormData={setFormData} />}
                {currentStep === 7 && <ListingReview formData={formData} />}

                {/* Loading overlay */}
                {isSubmitting && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-3xl z-50 flex items-center justify-center flex-col gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-accent border-r-transparent animate-spin" />
                        <h3 className="font-heading font-black text-xl animate-pulse">Verifying payload...</h3>
                    </div>
                )}
            </div>

            {/* Form Controls */}
            <div className="flex items-center justify-between">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 1 || isSubmitting}
                    className={`px-6 py-3 font-semibold rounded-xl transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'glass-panel hover:bg-muted text-foreground'
                        }`}
                >
                    Back
                </button>

                <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-primary transition-colors shadow-lg disabled:opacity-50"
                >
                    {currentStep === 7 ? (isSubmitting ? "Submitting..." : "Submit for Verification") : "Continue"}
                    {currentStep !== 7 && !isSubmitting && <ChevronRight className="h-5 w-5" />}
                </button>
            </div>

        </div>
    );
}
