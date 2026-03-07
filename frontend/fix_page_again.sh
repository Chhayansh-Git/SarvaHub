#!/bin/bash
sed -i '' -e '196,197d' ./src/app/seller/onboarding/page.tsx
sed -i '' -e '196i\
                    </div>\
                    {!isSuccess && (\
                        <div className="mt-8 pt-8 border-t border-border/50 flex items-center justify-between">\
                            <button onClick={prevStep} disabled={step === 1} className={`px-6 py-3 font-semibold rounded-xl transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'glass-panel hover:bg-muted text-foreground'}`}>Back</button>
' ./src/app/seller/onboarding/page.tsx
