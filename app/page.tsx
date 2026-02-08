"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { User, Building2, Mail, MapPin, Map, Navigation, FileText, FileCheck, FileSpreadsheet, Hash, Calendar, Eye, LogOut, LayoutGrid } from "lucide-react";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { getUser, logout } from "@/lib/auth";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { DocCard } from "@/components/ui/DocCard";
import { ShineButton } from "@/components/ui/ShineButton";
import { InvoiceFields } from "@/components/feature/InvoiceFields";
import { ProposalFields } from "@/components/feature/ProposalFields";
import { LiveTotal } from "@/components/feature/LiveTotal";
import { VoiceManager } from "@/components/voice/VoiceManager";
import { DocumentSuccessModal } from "@/components/voice/DocumentSuccessModal";
import { DocType } from "@/lib/types";
import { API_URL } from "@/lib/constants";
import { documentFormSchema, DocumentFormValues } from "@/lib/schemas";


export default function Home() {
  const router = useRouter();
  const [docType, setDocType] = useState<DocType>("proposal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<{
    fileName: string;
    downloadUrl: string;
    viewUrl?: string;
  } | null>(null);



  // Initialize form
  const methods = useForm({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      clientDetails: {
        clientName: "",
        clientCompany: "",
        clientGstIn: "",
        clientEmail: "",
        projectNumber: "",
        date: new Date().toISOString().split('T')[0],
        clientLocality: "",
        clientCity: "",
        clientPincode: "",
        clientState: "",
      },
      invoiceDetails: {
        invoiceNumber: "",
        invoiceDate: new Date().toISOString().split('T')[0],
      },
      scopeOfWork: {
        sections: [],
        timelineEnabled: false,
        timeline: [],
      },
      estimation: [],
      items: [{ name: "", rate: 0, quantity: 1 }],
      gstList: [{ type: "CGST", rate: 9 }],
      export_invoice: false,
      lut_number: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  async function onSubmit(values: DocumentFormValues) {
    setIsSubmitting(true);
    const loadingToast = toast.loading("Generating document...");

    try {
      // Get currently logged-in user
      const currentUser = getUser();
      const username = currentUser?.username || "Unknown";

      // 1. Calculate Standard Totals
      const subTotal = values.items.reduce((sum, item) => {
        return sum + (Number(item.rate) || 0) * (Number(item.quantity) || 0);
      }, 0);

      let cgstPrice = 0;
      let sgstPrice = 0;
      let igstPrice = 0;

      if (!values.export_invoice && values.gstList && values.gstList.length > 0) {
        values.gstList.forEach((gst) => {
          const rate = Number(gst.rate) || 0;
          const taxAmount = (subTotal * rate) / 100;
          if (gst.type === "CGST") cgstPrice += taxAmount;
          if (gst.type === "SGST") sgstPrice += taxAmount;
          if (gst.type === "IGST") igstPrice += taxAmount;
        });
      }

      const grandTotal = subTotal + cgstPrice + sgstPrice + igstPrice;

      // 2. Build Normalized Data Schema
      const data = {
        meta: {
          username: username,
          clientName: values.clientDetails.clientName,
          clientCompany: values.clientDetails.clientCompany,
          clientEmail: values.clientDetails.clientEmail,
          projectNumber: values.clientDetails.projectNumber,
          date: values.clientDetails.date,
          clientLocality: values.clientDetails.clientLocality,
          clientCity: values.clientDetails.clientCity,
          clientPincode: values.clientDetails.clientPincode,
          clientState: values.clientDetails.clientState,
          invoiceNumber: values.invoiceDetails?.invoiceNumber,
          invoiceDate: values.invoiceDetails?.invoiceDate,
        },
        scopeOfWork: docType === "proposal" ? (values.scopeOfWork?.sections || []) : [],
        timeline: (docType === "proposal" && values.scopeOfWork?.timelineEnabled) ? (values.scopeOfWork?.timeline || []) : [],
        estimation: {
          rows: docType === "proposal" ? (values.estimation?.map(item => ({
            description: item.description,
            rate: Number(item.rate),
            qty: Number(item.qty),
            total: (Number(item.rate) || 0) * (Number(item.qty) || 0)
          })) || []) : [],
          subtotal: docType === "proposal" ? (values.estimation?.reduce((sum, item) => sum + (Number(item.rate) || 0) * (Number(item.qty) || 0), 0) || 0) : 0,
          total: docType === "proposal" ? (values.estimation?.reduce((sum, item) => sum + (Number(item.rate) || 0) * (Number(item.qty) || 0), 0) || 0) : 0,
        },
        standardItems: values.items.map(item => ({
          name: item.name,
          rate: Number(item.rate),
          quantity: Number(item.quantity),
          total: (Number(item.rate) || 0) * (Number(item.quantity) || 0)
        })),
        flags: {
          exportInvoice: values.export_invoice,
          timelineEnabled: values.scopeOfWork?.timelineEnabled || false,
        },
        compliance: {
          clientGstin: values.clientDetails.clientGstIn || "",
          lutNumber: values.export_invoice ? values.lut_number || "" : "",
        },
        // Totals for Root level integration
        subtotal: subTotal.toFixed(2),
        total: grandTotal.toFixed(2),
        value: subTotal.toFixed(2),
        taxDetails: {
          cgst: cgstPrice.toFixed(2),
          sgst: sgstPrice.toFixed(2),
          igst: igstPrice.toFixed(2)
        }
      };

      const payload = {
        documentType: docType,
        data,
      };

      console.log("FINAL PAYLOAD:", payload);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Request failed");

      const result = await res.json();

      // Handle n8n response structure (can be array or object, possibly nested)
      let finalItem = Array.isArray(result) ? result[0] : result;

      if (Array.isArray(result)) {
        const evaluatedItem = result.find(
          (item: { downloadUrl?: string; downloadUrl1?: string }) => {
            const dUrl = item.downloadUrl || item.downloadUrl1;
            return dUrl && !dUrl.includes("{{");
          }
        );
        if (evaluatedItem) finalItem = evaluatedItem;
      }

      const docResponse = finalItem?.data || finalItem?.json || finalItem;

      if (docResponse?.success || docResponse?.downloadUrl || docResponse?.downloadUrl1 || docResponse?.viewUrl || docResponse?.previewUrl1) {
        toast.dismiss(loadingToast);

        const sanitizeUrl = (url: unknown) => {
          if (typeof url !== "string") return "";
          const sanitized = url.trim().replace(/^- /, "");
          return sanitized.startsWith("{{") || sanitized.startsWith("={{") ? "" : sanitized;
        };

        const finalData = {
          fileName: String(docResponse.fileName || "document.pdf"),
          downloadUrl: sanitizeUrl(docResponse.downloadUrl || docResponse.downloadUrl1),
          viewUrl: sanitizeUrl(docResponse.viewUrl || docResponse.previewUrl || docResponse.previewUrl1 || docResponse.viewUrl1),
        };

        if (typeof finalData.fileName === "string" && finalData.fileName.includes("{{")) {
          finalData.fileName = "document.pdf";
        }

        setSuccessData(finalData);
        setShowSuccessModal(true);
        toast.success(docResponse.message || "Document generated successfully");
      } else {
        throw new Error("The server responded but did not provide a document URL.");
      }
    } catch (err: unknown) {
      toast.dismiss(loadingToast);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to generate document: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthProvider>
      <main className="min-h-screen bg-neutral-950 text-white relative overflow-hidden font-sans selection:bg-orange-500/30">
        {/* Background Mesh Gradient - Consistent with Dashboard */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-neutral-900/20 rounded-full blur-[120px] opacity-20" />
          <div className="absolute bottom-[0%] left-[-10%] w-[600px] h-[600px] bg-neutral-900/10 rounded-full blur-[100px] opacity-20" />
          {/* Subtler pulse */}
          <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-orange-500/2 rounded-full blur-[150px] opacity-10 animate-[pulse_4s_ease-in-out_infinite]" />
        </div>

        <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/50 supports-[backdrop-filter]:bg-neutral-950/60">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 group cursor-default">
                <Image
                  src="/logo.png"
                  alt="Tigrid Logo"
                  width={120}
                  height={32}
                  className="h-8 w-auto object-contain opacity-90 transition-opacity group-hover:opacity-100"
                  priority
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-neutral-900/50 border border-neutral-800/60 rounded-full">
                <User className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs font-medium text-neutral-300">{getUser()?.username || "User"}</span>
              </div>
              <button
                type="button"
                onClick={() => window.location.href = "/dashboard"}
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-900 bg-white hover:bg-neutral-100 transition-all px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full shadow-lg shadow-white/5 active:scale-[0.98] active:translate-y-[1px] duration-200 border border-transparent"
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 stroke-[2.5]" />
                <span>View Dashboard</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-all px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-neutral-800/60 hover:border-neutral-700 active:scale-[0.98] active:translate-y-[1px] duration-200"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="relative z-10 transition-all duration-1000 py-16 space-y-12">
          {/* HERO & SELECTION HEADER */}
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-4">
              <h1 className="font-bold tracking-tighter text-2xl sm:text-4xl md:text-5xl text-white drop-shadow-sm">
                Create New Document
              </h1>
              <p className="text-neutral-500 max-w-lg mx-auto text-sm leading-relaxed font-medium">
                Generate professional proposals, quotations, and invoices in seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <DocCard
                label="Proposal"
                description="Client pitch"
                type="proposal"
                currentType={docType}
                onSelect={setDocType}
                icon={<FileText className="w-5 h-5" />}
              />
              <DocCard
                label="Quotation"
                description="Price estimate"
                type="quotation"
                currentType={docType}
                onSelect={setDocType}
                icon={<FileCheck className="w-5 h-5" />}
              />
              <DocCard
                label="Invoice"
                description="Bill client"
                type="invoice"
                currentType={docType}
                onSelect={setDocType}
                icon={<FileSpreadsheet className="w-5 h-5" />}
              />
            </div>
          </div>

          <FormProvider {...methods}>
            <VoiceManager />
            <DocumentSuccessModal
              isOpen={showSuccessModal}
              onClose={() => setShowSuccessModal(false)}
              fileName={successData?.fileName || ""}
              downloadUrl={successData?.downloadUrl || ""}
              viewUrl={successData?.viewUrl}
              docType={docType}
            />
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative space-y-10 transition-all duration-300"
            >
              <Section title="Client Information">
                <div className="relative group/first-field">
                  <Input
                    {...register("clientDetails.clientName")}
                    placeholder="Client Name"
                    startIcon={<User className="w-4 h-4" />}
                    autoFocus
                    className="bg-neutral-800/20 ring-1 ring-white/10"
                  />
                </div>
                {errors.clientDetails?.clientName && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.clientDetails.clientName.message}
                  </p>
                )}
                <div className="relative">
                  <Input
                    {...register("clientDetails.clientCompany")}
                    placeholder="Company Name"
                    startIcon={<Building2 className="w-4 h-4" />}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {docType !== "proposal" ? (
                    <>
                      <Input
                        {...register("clientDetails.clientGstIn")}
                        placeholder="Client GSTIN"
                        startIcon={<FileText className="w-4 h-4" />}
                      />
                      <div>
                        <Input
                          {...register("clientDetails.clientEmail")}
                          placeholder="Email Address"
                          type="email"
                          startIcon={<Mail className="w-4 h-4" />}
                        />
                        {errors.clientDetails?.clientEmail && (
                          <p className="text-red-500 text-xs mt-1 ml-2">
                            {errors.clientDetails.clientEmail.message}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <Input
                        {...register("clientDetails.projectNumber")}
                        placeholder="Project Number"
                        startIcon={<Hash className="w-4 h-4" />}
                      />
                      <Input
                        {...register("clientDetails.date")}
                        placeholder="Date"
                        type="date"
                        startIcon={<Calendar className="w-4 h-4" />}
                        className="[color-scheme:dark]"
                      />
                    </>
                  )}
                </div>

                {(docType === "invoice" || docType === "quotation") && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-[fade-in_0.3s_ease-out]">
                    <Input
                      {...register("clientDetails.clientLocality")}
                      placeholder="Locality"
                      startIcon={<MapPin className="w-4 h-4" />}
                    />
                    <Input
                      {...register("clientDetails.clientCity")}
                      placeholder="City"
                      startIcon={<Building2 className="w-4 h-4" />}
                    />
                    <Input
                      {...register("clientDetails.clientPincode")}
                      placeholder="Pincode"
                      type="number"
                      startIcon={<Navigation className="w-4 h-4" />}
                    />
                    <Input
                      {...register("clientDetails.clientState")}
                      placeholder="State"
                      startIcon={<Map className="w-4 h-4" />}
                    />
                  </div>
                )}
              </Section>

              {(docType === "invoice" || docType === "quotation") && (
                <Section title="Invoice Details" className="animate-[fade-in_0.4s_ease-out]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      {...register("invoiceDetails.invoiceNumber")}
                      placeholder="Invoice Number"
                      startIcon={<Hash className="w-4 h-4" />}
                    />
                    <Input
                      {...register("invoiceDetails.invoiceDate")}
                      placeholder="Invoice Date"
                      type="date"
                      startIcon={<Calendar className="w-4 h-4" />}
                      className="[color-scheme:dark]"
                    />
                  </div>
                </Section>
              )}

              {/* Functional Fields based on Document Type */}
              <div className="transition-all duration-300">
                {docType === "proposal" ? (
                  <ProposalFields />
                ) : (docType === "quotation" || docType === "invoice") ? (
                  <InvoiceFields />
                ) : null}
              </div>

              {/* Live Dashboard Summary - Visible for all document types */}
              <LiveTotal docType={docType} />

              <div className="max-w-7xl mx-auto px-6 pt-4">
                <ShineButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-base font-semibold tracking-wide shadow-xl shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all"
                >
                  {isSubmitting ? "Generating..." : `Generate ${docType.charAt(0).toUpperCase() + docType.slice(1)}`}
                </ShineButton>
              </div>
            </form>
          </FormProvider>
        </div>
      </main>
    </AuthProvider>
  );
}