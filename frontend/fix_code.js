const fs = require('fs');

let fileStr = fs.readFileSync('src/app/seller/onboarding/page.tsx', 'utf-8');

// Replace everything securely from `)}` after registered address with {step === 3 &&(.. closing curly variables locally properly.
fileStr = fileStr.replace(/<textarea rows=\{3\}(.|\n)*?\)\}\s*\}(\n\s*){1,2}\}\s*\{step === 3 && \(/m, `<textarea rows={3} className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all resize-none" placeholder="Full address with City, State, PIN Code" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        )}

                            {step === 3 && (`);
                            
fs.writeFileSync('src/app/seller/onboarding/page.tsx', fileStr);
console.log("Replaced strings successfully!");
