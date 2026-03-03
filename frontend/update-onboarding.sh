#!/bin/bash
# Move handling functions back to top of document where definitions reside properly before components.
sed -i '' -e '/const handleFileUpload = async /,/isBusiness ? setUploadingDoc(false) : setUploadingKyc(false);/d' -e '/} \/\/ Fallback direct upload bypass since `api.ts` expects JSON/d' -e '/} \/ Fallback direct/d' ./src/app/seller/onboarding/page.tsx
sed -i '' -e '/const handleSubmit = async () => {/i\
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "business" | "kyc") => {\
        const file = e.target.files?.[0];\
        if (!file) return;\
        const isBusiness = type === "business";\
        isBusiness ? setUploadingDoc(true) : setUploadingKyc(true);\
        try {\
            const fileData = new FormData();\
            fileData.append("file", file);\
            fileData.append("folder", "kyc");\
            const res = await api.post("/upload", fileData, {\
                headers: {"Content-Type": "multipart/form-data"}\
            });\
        } catch {\
        }\
    };\
\
    const uploadDirect = async (file: File, type: "business" | "kyc") => {\
        const isBusiness = type === "business";\
        isBusiness ? setUploadingDoc(true) : setUploadingKyc(true);\
        try {\
            const fileData = new FormData();\
            fileData.append("file", file);\
            fileData.append("folder", "kyc");\
            const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1] || "";\
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";\
            const res = await fetch(`${API_URL}/upload`, {\
                method: "POST",\
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },\
                body: fileData\
            });\
            const data = await res.json();\
            if (data.url) {\
                if (isBusiness) setFormData({...formData, businessDocUrl: data.url});\
                else setFormData({...formData, kycDocUrl: data.url});\
            }\
        } catch (error) {\
            console.error(error);\
        } finally {\
            isBusiness ? setUploadingDoc(false) : setUploadingKyc(false);\
        }\
    };\
' ./src/app/seller/onboarding/page.tsx
