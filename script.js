/* ==========================================================================
   AICTE APPROVAL PROCESS PORTAL - CLIENT FRONTEND LOGIC (REST INTEGRATION)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------------------------
    // 1. Session Helper Utilities
    // ----------------------------------------------------------------------
    const Session = {
        getCurrentUser() {
            return JSON.parse(localStorage.getItem("currentUser")) || null;
        },

        setCurrentUser(user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
        },

        logout() {
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        }
    };

    // Global UI Session Management
    const currentUser = Session.getCurrentUser();
    const loginBtnContainer = document.querySelector(".header-btn");

    if (loginBtnContainer) {
        if (currentUser) {
            loginBtnContainer.innerHTML = `
                <div class="user-profile-menu">
                    <i class="fa-solid fa-user-shield" style="color: var(--primary);"></i>
                    <span>${currentUser.org || currentUser.email}</span>
                    <i class="fa-solid fa-power-off logout-icon" id="logoutBtn" title="Logout"></i>
                </div>
            `;
            
            const logoutBtn = document.getElementById("logoutBtn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", () => {
                    Session.logout();
                });
            }
        }
    }

    // Role Enforcement Navigation Guard
    const path = window.location.pathname;
    const pageName = path.split("/").pop();

    if (pageName === "approval.html") {
        if (!currentUser) {
            alert("Access Denied: Please log in to submit approval requests.");
            window.location.href = "login.html";
        } else if (currentUser.role !== "institution") {
            alert("Access Denied: Only Institution accounts can apply for approvals.");
            window.location.href = "dashboard.html";
        }
    }

    // ----------------------------------------------------------------------
    // 2. Landing Page Interactions (index.html)
    // ----------------------------------------------------------------------
    if (pageName === "index.html" || pageName === "") {
        // Counter Animation
        const counters = document.querySelectorAll(".counter");
        
        const runCounters = () => {
            counters.forEach(counter => {
                const target = +counter.getAttribute("data-target");
                const speed = 200;
                const increment = target / speed;
                
                let count = 0;
                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target.toLocaleString() + (target === 58000 || target === 18940 || target === 2450 ? "+" : "");
                    }
                };
                updateCount();
            });
        };

        // Scroll Indicator
        const scrollIndicator = document.querySelector(".scroll");
        if (scrollIndicator) {
            scrollIndicator.addEventListener("click", () => {
                document.querySelector(".dashboard").scrollIntoView({ behavior: "smooth" });
            });
        }

        // Trigger counters on scroll
        const dashboardSection = document.querySelector(".dashboard");
        if (dashboardSection) {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        runCounters();
                        observer.unobserve(dashboardSection);
                    }
                });
            }, { threshold: 0.2 });
            observer.observe(dashboardSection);
        }

        // Action button redirects
        const heroGetStarted = document.querySelector(".hero-buttons .primary");
        const heroViewDashboard = document.querySelector(".hero-buttons .secondary");

        if (heroGetStarted) {
            heroGetStarted.addEventListener("click", () => {
                if (currentUser) {
                    window.location.href = currentUser.role === "institution" ? "approval.html" : "dashboard.html";
                } else {
                    window.location.href = "login.html";
                }
            });
        }

        if (heroViewDashboard) {
            heroViewDashboard.addEventListener("click", () => {
                window.location.href = "dashboard.html";
            });
        }

        // Assistant dynamic log streaming
        const controlChat = document.querySelector(".chat-box");
        if (controlChat) {
            const logEntries = [
                "🔍 Initializing regulatory baseline checks...",
                "📄 Structural certificates verified: Approved.",
                "👨‍🏫 Faculty Aadhaar biometrics validation matching database: 100%.",
                "🤖 Automated satellite GIS inspection completed successfully.",
                "✅ Institution ABC Eng. College status set to READY FOR BOARD."
            ];

            let index = 0;
            const appendLog = () => {
                if (index < logEntries.length) {
                    const log = document.createElement("div");
                    log.className = "bot";
                    log.innerText = logEntries[index];
                    controlChat.appendChild(log);
                    controlChat.scrollTop = controlChat.scrollHeight;
                    index++;
                    setTimeout(appendLog, 3000);
                }
            };
            setTimeout(appendLog, 2000);
        }
    }

    // ----------------------------------------------------------------------
    // 3. Authentications (login.html, register.html)
    // ----------------------------------------------------------------------
    if (pageName === "login.html") {
        const loginForm = document.getElementById("loginForm");
        const otpForm = document.getElementById("otpForm");
        const loginSection = document.getElementById("loginSection");
        const otpSection = document.getElementById("otpSection");
        const notificationHub = document.getElementById("simulatedNotificationHub");
        const notificationText = document.getElementById("notificationText");
        const otpDigits = document.querySelectorAll(".otp-digit");
        const resendOtpBtn = document.getElementById("resendOtpBtn");
        const otpCountdown = document.getElementById("otpCountdown");
        const backToLoginBtn = document.getElementById("backToLoginBtn");

        let tempEmail = "";
        let tempPassword = "";
        let countdownInterval = null;

        // Start Countdown Timer for Resend OTP
        const startCountdown = () => {
            clearInterval(countdownInterval);
            let timeLeft = 60;
            resendOtpBtn.disabled = true;
            resendOtpBtn.style.opacity = "0.6";
            resendOtpBtn.style.cursor = "not-allowed";
            resendOtpBtn.innerHTML = `Resend in <span id="otpCountdown">${timeLeft}</span>s`;
            
            const countdownSpan = document.getElementById("otpCountdown");

            countdownInterval = setInterval(() => {
                timeLeft--;
                if (countdownSpan) countdownSpan.innerText = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    resendOtpBtn.disabled = false;
                    resendOtpBtn.style.opacity = "1";
                    resendOtpBtn.style.cursor = "pointer";
                    resendOtpBtn.innerHTML = "Resend Code";
                }
            }, 1000);
        };

        // Show Simulated SMS/Email Notification Banner
        const showSimulatedNotification = (code) => {
            if (notificationHub && notificationText) {
                notificationText.innerHTML = `Simulated SMS/Email code: Your AICTE OTP is <strong style="font-size: 0.95rem; letter-spacing: 1px; color: var(--primary);">${code}</strong>. Valid for 5 minutes.`;
                notificationHub.style.top = "24px";
                // Auto hide banner after 15 seconds
                setTimeout(() => {
                    notificationHub.style.top = "-110px";
                }, 15000);
            }
        };

        if (loginForm) {
            loginForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;
                
                try {
                    const response = await fetch("/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password })
                    });
                    
                    let data = {};
                    try {
                        data = await response.json();
                    } catch (parseErr) {
                        console.error("Response parse error:", parseErr);
                        throw new Error(`Server returned status ${response.status}. Failed to parse response.`);
                    }
                    
                    if (response.ok) {
                        if (data.status === "otp_required") {
                            // Save credentials temporarily for potential resend
                            tempEmail = email;
                            tempPassword = password;

                            // Smooth slide/transition
                            loginSection.style.display = "none";
                            otpSection.style.display = "block";

                            // Clear and Focus first input
                            otpDigits.forEach(input => input.value = "");
                            if (otpDigits[0]) otpDigits[0].focus();

                            // Trigger SMS Notification simulation
                            showSimulatedNotification(data.demoOtp);
                            
                            // Trigger Resend countdown timer
                            startCountdown();
                        } else {
                            // Fallback: If OTP is disabled on backend, log in directly
                            Session.setCurrentUser(data);
                            window.location.href = "dashboard.html";
                        }
                    } else {
                        alert(data.error || "Authentication failed. Double check credentials.");
                    }
                } catch (err) {
                    console.error("Auth error:", err);
                    alert("Unable to connect to full-stack server. Details: " + err.message);
                }
            });
        }

        // OTP inputs auto-tabbing and control behavior
        if (otpDigits.length > 0) {
            otpDigits.forEach((digitInput, idx) => {
                // Focus next on input
                digitInput.addEventListener("input", (e) => {
                    const val = e.target.value;
                    if (val && idx < otpDigits.length - 1) {
                        otpDigits[idx + 1].focus();
                    }
                });

                // Focus previous on Backspace
                digitInput.addEventListener("keydown", (e) => {
                    if (e.key === "Backspace" && !e.target.value && idx > 0) {
                        otpDigits[idx - 1].focus();
                    }
                });

                // Support paste of entire 6-digit code
                digitInput.addEventListener("paste", (e) => {
                    e.preventDefault();
                    const text = (e.clipboardData || window.clipboardData).getData("text").trim();
                    if (/^\d{6}$/.test(text)) {
                        otpDigits.forEach((input, i) => {
                            input.value = text[i];
                        });
                        if (otpDigits[otpDigits.length - 1]) {
                            otpDigits[otpDigits.length - 1].focus();
                        }
                    }
                });
            });
        }

        // Resend OTP Action
        if (resendOtpBtn) {
            resendOtpBtn.addEventListener("click", async () => {
                if (!tempEmail || !tempPassword) return;
                
                resendOtpBtn.disabled = true;
                resendOtpBtn.innerText = "Sending...";
                
                try {
                    const response = await fetch("/api/auth/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: tempEmail, password: tempPassword })
                    });
                    const data = await response.json();
                    if (response.ok) {
                        showSimulatedNotification(data.demoOtp);
                        startCountdown();
                    } else {
                        alert(data.error || "Failed to resend code.");
                    }
                } catch (err) {
                    console.error("Resend error:", err);
                    alert("Error reaching server to resend code.");
                }
            });
        }

        // Back to credentials screen
        if (backToLoginBtn) {
            backToLoginBtn.addEventListener("click", (e) => {
                e.preventDefault();
                clearInterval(countdownInterval);
                otpSection.style.display = "none";
                loginSection.style.display = "block";
                if (notificationHub) {
                    notificationHub.style.top = "-110px";
                }
            });
        }

        // OTP verification submission
        if (otpForm) {
            otpForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                
                // Concatenate code digits
                let otpCode = "";
                otpDigits.forEach(input => otpCode += input.value);
                
                if (otpCode.length !== 6) {
                    alert("Please enter all 6 verification digits.");
                    return;
                }

                try {
                    const response = await fetch("/api/auth/verify-otp", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: tempEmail, otp: otpCode })
                    });
                    
                    let data = {};
                    try {
                        data = await response.json();
                    } catch (parseErr) {
                        console.error("Verify OTP parse error:", parseErr);
                        throw new Error(`Server returned status ${response.status}. Failed to parse response.`);
                    }

                    if (response.ok) {
                        // Success! Redirect to dashboard
                        Session.setCurrentUser(data);
                        if (notificationHub) {
                            notificationHub.style.top = "-110px";
                        }
                        window.location.href = "dashboard.html";
                    } else {
                        alert(data.error || "Verification failed. Please double check the code.");
                    }
                } catch (err) {
                    console.error("Verify OTP error:", err);
                    alert("Unable to verify code with server. Details: " + err.message);
                }
            });
        }
    }

    if (pageName === "register.html") {
        const registerForm = document.getElementById("registerForm");
        if (registerForm) {
            registerForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;
                const org = document.getElementById("org").value;
                const role = document.getElementById("role").value;
                
                try {
                    const response = await fetch("/api/auth/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password, org, role })
                    });
                    
                    let data = {};
                    try {
                        data = await response.json();
                    } catch (parseErr) {
                        console.error("Response parse error:", parseErr);
                        throw new Error(`Server returned status ${response.status}. Failed to parse response.`);
                    }
                    
                    if (response.ok) {
                        alert("Account created successfully! Redirecting to login...");
                        window.location.href = "login.html";
                    } else {
                        alert(data.error || "Registration failed.");
                    }
                } catch (err) {
                    console.error("Register error:", err);
                    alert("Unable to connect to full-stack server. Details: " + err.message);
                }
            });
        }
    }

    // ----------------------------------------------------------------------
    // 4. Multi-Step Approval Workspace (approval.html)
    // ----------------------------------------------------------------------
    if (pageName === "approval.html") {
        let currentStep = 1;
        const totalSteps = 5;
        
        const stepContents = document.querySelectorAll(".form-step-content");
        const stepIndicators = document.querySelectorAll(".step-item");
        
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");
        const submitBtn = document.getElementById("submitAppBtn");

        // Dynamic fee parameters calculations
        const colTypeSelect = document.getElementById("colType");
        const calculatedFeeText = document.getElementById("calculatedFee");
        const feesMapping = {
            "Engineering": "₹1,50,000",
            "Pharmacy": "₹1,00,000",
            "Polytechnic": "₹75,000",
            "Management": "₹1,20,000",
            "Architecture": "₹1,10,000"
        };

        if (colTypeSelect && calculatedFeeText) {
            colTypeSelect.addEventListener("change", () => {
                const val = colTypeSelect.value;
                calculatedFeeText.innerText = feesMapping[val] || "₹1,50,000";
            });
        }

        const updateStepsUI = () => {
            stepContents.forEach((content, i) => {
                if (i + 1 === currentStep) {
                    content.classList.add("active");
                } else {
                    content.classList.remove("active");
                }
            });

            stepIndicators.forEach((indicator, i) => {
                const stepNum = i + 1;
                if (stepNum === currentStep) {
                    indicator.classList.add("active");
                    indicator.classList.remove("completed");
                } else if (stepNum < currentStep) {
                    indicator.classList.remove("active");
                    indicator.classList.add("completed");
                } else {
                    indicator.classList.remove("active");
                    indicator.classList.remove("completed");
                }
            });

            // Navigation Button controls
            if (currentStep === 1) {
                prevBtn.style.display = "none";
            } else {
                prevBtn.style.display = "inline-flex";
            }

            if (currentStep === totalSteps) {
                nextBtn.style.display = "none";
                submitBtn.style.display = "inline-flex";
            } else {
                nextBtn.style.display = "inline-flex";
                submitBtn.style.display = "none";
            }
        };

        // Form Step Nav validation
        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                if (currentStep === 1) {
                    const cName = document.getElementById("colName").value;
                    const cType = document.getElementById("colType").value;
                    if (!cName || !cType) {
                        alert("Please fill in the Institution Name and Type before continuing.");
                        return;
                    }
                }
                
                if (currentStep === 3 && uploadedFiles.length === 0) {
                    alert("Please upload at least one document checklist PDF to continue.");
                    return;
                }

                if (currentStep === 4 && !paymentCompleted) {
                    alert("Please process and verify the processing fee payment before continuing.");
                    return;
                }

                if (currentStep < totalSteps) {
                    currentStep++;
                    updateStepsUI();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                if (currentStep > 1) {
                    currentStep--;
                    updateStepsUI();
                }
            });
        }

        updateStepsUI();

        // Step 2: Faculty roster adding
        const facultyContainer = document.getElementById("facultyListContainer");
        const addFacultyBtn = document.getElementById("addFacultyBtn");

        if (addFacultyBtn && facultyContainer) {
            addFacultyBtn.addEventListener("click", () => {
                const entry = document.createElement("div");
                entry.className = "faculty-entry-row";
                entry.innerHTML = `
                    <div class="form-group">
                        <label>Faculty Name</label>
                        <div class="input-wrapper">
                            <input type="text" class="fac-name" placeholder="Full Name" required>
                            <i class="fa-solid fa-user"></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Qualification</label>
                        <div class="input-wrapper">
                            <input type="text" class="fac-qual" placeholder="e.g. Ph.D." required>
                            <i class="fa-solid fa-graduation-cap"></i>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Experience</label>
                        <div class="input-wrapper">
                            <input type="text" class="fac-exp" placeholder="e.g. 5 Years" required>
                            <i class="fa-solid fa-briefcase"></i>
                        </div>
                    </div>
                    <button type="button" class="remove-faculty-btn" title="Remove Faculty">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;
                facultyContainer.appendChild(entry);

                entry.querySelector(".remove-faculty-btn").addEventListener("click", () => {
                    entry.remove();
                });
            });
        }

        // Step 3: Document uploads
        const dropzone = document.getElementById("dropzone");
        const docFileInput = document.getElementById("docFileInput");
        const fileListContainer = document.getElementById("fileListContainer");
        let uploadedFiles = [];

        if (dropzone && docFileInput) {
            dropzone.addEventListener("click", () => docFileInput.click());
            
            dropzone.addEventListener("dragover", (e) => {
                e.preventDefault();
                dropzone.classList.add("dragover");
            });

            dropzone.addEventListener("dragleave", () => {
                dropzone.classList.remove("dragover");
            });

            dropzone.addEventListener("drop", (e) => {
                e.preventDefault();
                dropzone.classList.remove("dragover");
                handleFiles(e.dataTransfer.files);
            });

            docFileInput.addEventListener("change", () => {
                handleFiles(docFileInput.files);
            });
        }

        const handleFiles = (files) => {
            for (let file of files) {
                if (uploadedFiles.length >= 5) {
                    alert("Maximum 5 documents checklist PDFs allowed.");
                    break;
                }
                uploadedFiles.push(file.name);
            }
            renderFileList();
        };

        const renderFileList = () => {
            if (fileListContainer) {
                fileListContainer.innerHTML = "";
                uploadedFiles.forEach((fileName, index) => {
                    const item = document.createElement("div");
                    item.className = "file-item";
                    item.innerHTML = `
                        <div class="file-item-left">
                            <i class="fa-solid fa-file-pdf"></i>
                            <span>${fileName}</span>
                        </div>
                        <i class="fa-solid fa-xmark remove-file" data-index="${index}"></i>
                    `;
                    fileListContainer.appendChild(item);
                });

                document.querySelectorAll(".remove-file").forEach(btn => {
                    btn.addEventListener("click", (e) => {
                        const idx = e.target.getAttribute("data-index");
                        uploadedFiles.splice(idx, 1);
                        renderFileList();
                    });
                });
            }
        };

        // Step 4: Processing Fee Gateway Channels toggle & payment
        const gatewaySelect = document.getElementById("paymentGateway");
        const cardDetailsBox = document.getElementById("cardPaymentDetails");
        const upiDetailsBox = document.getElementById("upiPaymentDetails");
        const simulatePaymentBtn = document.getElementById("simulatePaymentBtn");
        const paymentStatusBox = document.getElementById("paymentStatusBox");
        let paymentCompleted = false;

        if (gatewaySelect) {
            gatewaySelect.addEventListener("change", () => {
                const val = gatewaySelect.value;
                if (val === "card") {
                    cardDetailsBox.style.display = "block";
                    upiDetailsBox.style.display = "none";
                } else if (val === "upi") {
                    cardDetailsBox.style.display = "none";
                    upiDetailsBox.style.display = "block";
                } else {
                    cardDetailsBox.style.display = "none";
                    upiDetailsBox.style.display = "none";
                }
            });
        }

        if (simulatePaymentBtn) {
            simulatePaymentBtn.addEventListener("click", () => {
                simulatePaymentBtn.disabled = true;
                simulatePaymentBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Processing Gateway transaction...`;
                
                setTimeout(() => {
                    paymentCompleted = true;
                    simulatePaymentBtn.style.display = "none";
                    paymentStatusBox.style.display = "block";
                    alert("Fee Payment successfully verified!");
                }, 1500);
            });
        }

        // Step 5: AI Verification Sandbox
        const runOcrBtn = document.getElementById("runOcrBtn");
        const ocrSteps = document.querySelectorAll(".sandbox-step");
        const scoreVal = document.getElementById("scoreVal");
        const scannerLaser = document.getElementById("scannerLaser");
        const scannerOverlay = document.getElementById("scannerOverlay");
        const ocrTerminalLogs = document.getElementById("ocrTerminalLogs");
        let ocrCompleted = false;

        if (runOcrBtn) {
            runOcrBtn.addEventListener("click", () => {
                runOcrBtn.disabled = true;
                runOcrBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Running Audit...`;
                
                // Show laser scanning lines
                if (scannerLaser) scannerLaser.style.display = "block";
                if (scannerOverlay) scannerOverlay.style.display = "block";

                ocrSteps.forEach(s => {
                    s.className = "sandbox-step pending";
                    s.querySelector("i").className = "fa-solid fa-circle-notch";
                });
                
                if (ocrTerminalLogs) ocrTerminalLogs.innerHTML = `[System] Initiating AI Audit Engine v2.4...<br>`;
                
                const logStatements = [
                    // Step 1 logs
                    { step: 0, text: "[System] Verifying PDF digital security signatures...", delay: 500 },
                    { step: 0, text: "[System] Legal stamp matched: TAMIL NADU CHIEF AUDIT OFFICE.", delay: 1000 },
                    { step: 0, text: "[COMPLIANCE] Security & signature check: PASS.", delay: 1500, completeStep: 0 },
                    
                    // Step 2 logs
                    { step: 1, text: "[OCR] Reading document text blocks and extracting characters...", delay: 2000 },
                    { step: 1, text: "[OCR] Extracted coordinates: 12.9516 N, 80.1411 E (Anna Salai, Chennai).", delay: 2800 },
                    { step: 1, text: "[OCR] Extracted land boundary properties: 12.0 ACRES.", delay: 3500 },
                    { step: 1, text: "[COMPLIANCE] Required land: 10.0 Acres. Result: PASS.", delay: 4200, completeStep: 1 },
                    
                    // Step 3 logs
                    { step: 2, text: "[OCR] Reading Fire Safety NOC expiry details...", delay: 4800 },
                    { step: 2, text: "[OCR] Extracted Expiry: 2028-12-15. Status: VALID.", delay: 5500 },
                    { step: 2, text: "[COMPLIANCE] Structural and safety parameter check: PASS.", delay: 6200, completeStep: 2 },
                    
                    // Step 4 logs
                    { step: 3, text: "[System] Cross-referencing registered faculty roster with educational board...", delay: 6800 },
                    { step: 3, text: "[System] Cross-reference check: 0 faculty double-registered at other colleges.", delay: 7500 },
                    { step: 3, text: "[COMPLIANCE] Faculty qualifications verification check: PASS.", delay: 8200, completeStep: 3 }
                ];

                let logIdx = 0;
                const runLogs = () => {
                    if (logIdx < logStatements.length) {
                        const entry = logStatements[logIdx];
                        
                        setTimeout(() => {
                            if (ocrTerminalLogs) {
                                ocrTerminalLogs.innerHTML += `${entry.text}<br>`;
                                ocrTerminalLogs.scrollTop = ocrTerminalLogs.scrollHeight;
                            }
                            
                            // Highlight steps actively
                            if (entry.step < ocrSteps.length) {
                                const currentStep = ocrSteps[entry.step];
                                if (currentStep.classList.contains("pending")) {
                                    currentStep.className = "sandbox-step active";
                                    currentStep.querySelector("i").className = "fa-solid fa-spinner fa-spin";
                                }
                            }

                            // Complete steps
                            if (entry.completeStep !== undefined) {
                                const targetStep = ocrSteps[entry.completeStep];
                                targetStep.className = "sandbox-step done";
                                targetStep.querySelector("i").className = "fa-solid fa-circle-check";
                            }
                            
                            logIdx++;
                            runLogs();
                        }, logIdx === 0 ? 0 : (logStatements[logIdx].delay - logStatements[logIdx-1].delay));
                    } else {
                        // All steps finished
                        setTimeout(() => {
                            if (scannerLaser) scannerLaser.style.display = "none";
                            if (scannerOverlay) scannerOverlay.style.display = "none";
                            if (scoreVal) scoreVal.innerText = "98.9%";
                            if (ocrTerminalLogs) {
                                ocrTerminalLogs.innerHTML += `<span style="color:var(--success);font-weight:700;">[System] Audit complete. Compliance Match: 98.9% (PASS)</span><br>`;
                                ocrTerminalLogs.scrollTop = ocrTerminalLogs.scrollHeight;
                            }
                            
                            runOcrBtn.innerHTML = `<i class="fa-solid fa-rotate-right"></i> Re-run Audit`;
                            runOcrBtn.disabled = false;
                            ocrCompleted = true;
                        }, 500);
                    }
                };
                
                runLogs();
            });
        }

        // Submitting approval application to Express backend
        if (submitBtn) {
            submitBtn.addEventListener("click", async () => {
                if (!ocrCompleted) {
                    alert("Please run the AI Verification diagnostics check before submitting.");
                    return;
                }

                const colName = document.getElementById("colName").value;
                const colType = document.getElementById("colType").value;
                const region = document.getElementById("region").value;
                const landArea = document.getElementById("landArea").value;
                const builtUpArea = document.getElementById("builtUpArea").value;
                
                const facultyRows = document.querySelectorAll(".faculty-entry-row");
                const facultyList = [];
                facultyRows.forEach(row => {
                    const name = row.querySelector(".fac-name").value;
                    const qual = row.querySelector(".fac-qual").value;
                    const exp = row.querySelector(".fac-exp").value;
                    if (name && qual && exp) {
                        facultyList.push({ name, qualification: qual, experience: exp });
                    }
                });

                const payload = {
                    college: colName,
                    submittedBy: currentUser.email,
                    type: colType,
                    region: region,
                    landArea: landArea || "10 Acres",
                    builtUpArea: builtUpArea || "35,000 sq m",
                    faculty: facultyList.length > 0 ? facultyList : [{ name: "Dr. Faculty Head", qualification: "Ph.D.", experience: "10 Years" }],
                    documents: uploadedFiles.length > 0 ? uploadedFiles : ["Land_Certificate.pdf"],
                    confidence: "98.9%"
                };

                try {
                    const response = await fetch("/api/applications", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        alert("Application " + data.application.id + " successfully registered in central board database!");
                        window.location.href = "dashboard.html";
                    } else {
                        alert(data.error || "Submission failed.");
                    }
                } catch (err) {
                    console.error("Submission error:", err);
                    alert("Unable to reach backend API server.");
                }
            });
        }
    }

    // ----------------------------------------------------------------------
    // 5. Interactive Dashboard (dashboard.html)
    // ----------------------------------------------------------------------
    if (pageName === "dashboard.html") {
        const openCertificateWindow = (app) => {
            const printWindow = window.open("", "_blank");
            printWindow.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>AICTE Approval Certificate - ${app.id}</title>
                    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
                    <style>
                        body {
                            background: #fdfdfd;
                            color: #111;
                            font-family: 'Poppins', sans-serif;
                            padding: 2.5rem;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 90vh;
                        }
                        .cert-border {
                            border: 15px double #c5a059;
                            padding: 3rem;
                            width: 100%;
                            max-width: 800px;
                            background: #fff;
                            position: relative;
                            box-shadow: 0 0 20px rgba(0,0,0,0.05);
                            text-align: center;
                        }
                        .cert-header {
                            margin-bottom: 2.5rem;
                        }
                        .cert-header h1 {
                            font-family: 'Cinzel', serif;
                            font-size: 2rem;
                            color: #8b6508;
                            margin: 0;
                            letter-spacing: 2px;
                            line-height: 1.3;
                        }
                        .cert-header h2 {
                            font-size: 1rem;
                            font-weight: 600;
                            letter-spacing: 1px;
                            color: #444;
                            margin: 0.5rem 0 0;
                            text-transform: uppercase;
                        }
                        .cert-divider {
                            height: 2px;
                            background: linear-gradient(90deg, transparent, #c5a059, transparent);
                            margin: 1.5rem auto;
                            width: 70%;
                        }
                        .cert-title {
                            font-family: 'Cinzel', serif;
                            font-size: 1.8rem;
                            font-weight: 700;
                            color: #222;
                            margin: 2rem 0;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                        }
                        .cert-body {
                            font-size: 0.95rem;
                            line-height: 1.8;
                            color: #333;
                            margin-bottom: 3.5rem;
                        }
                        .cert-body strong {
                            color: #000;
                        }
                        .cert-footer {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-end;
                            margin-top: 4rem;
                            padding: 0 1rem;
                        }
                        .signature-block {
                            text-align: center;
                            width: 220px;
                        }
                        .signature-line {
                            border-top: 1px solid #777;
                            margin-top: 2rem;
                            padding-top: 0.5rem;
                            font-size: 0.8rem;
                            color: #555;
                            font-weight: 600;
                            text-transform: uppercase;
                        }
                        .qr-code {
                            width: 90px;
                            height: 90px;
                            border: 1px solid #c5a059;
                            padding: 5px;
                            background: #fff;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            font-size: 0.65rem;
                            color: #555;
                            line-height: 1.3;
                        }
                        @media print {
                            body {
                                padding: 0;
                                background: none;
                            }
                            .cert-border {
                                box-shadow: none;
                                border-width: 10px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="cert-border">
                        <div class="cert-header">
                            <h1>ALL INDIA COUNCIL FOR TECHNICAL EDUCATION</h1>
                            <h2>Central Approval Board of India</h2>
                        </div>
                        <div class="cert-divider"></div>
                        <div class="cert-title">Certificate of Academic Approval</div>
                        <div class="cert-body">
                            This is to officially certify that the technical educational institution<br>
                            <strong style="font-size: 1.1rem; display: inline-block; margin: 0.5rem 0;">${app.college}</strong><br>
                            located under regional office jurisdiction of the <strong>${app.region} Office</strong>, having submitted academic build structures measuring 
                            <strong>${app.builtUpArea}</strong> and campus properties of <strong>${app.landArea}</strong>, has successfully met 
                            all statutory standards, infrastructure parameters, safety measures, and roster requirements of the Council.<br><br>
                            Therefore, AICTE grants official authorization of program approvals under category 
                            <strong>${app.type}</strong> for the upcoming academic terms.
                        </div>
                        <div class="cert-footer">
                            <div class="qr-code">
                                <strong style="color: #8b6508; font-size: 0.7rem; margin-bottom: 2px;">VERIFIED</strong>
                                <span>ID: ${app.id}</span>
                                <span>Confidence: ${app.confidence}</span>
                            </div>
                            <div class="signature-block">
                                <div style="font-family: 'Cinzel', serif; font-style: italic; color: #8b6508; font-size: 1.15rem; font-weight: 700;">Prof. Anil Sahasrabudhe</div>
                                <div class="signature-line">Chairman, AICTE</div>
                            </div>
                        </div>
                    </div>
                    <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                            }, 500);
                        }
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        };

        const renderDashboard = async () => {
            const appListTable = document.getElementById("appListTable");
            const filterStatus = document.getElementById("filterStatus");
            const createBtnBox = document.getElementById("createBtnBox");
            
            if (!appListTable) return;
            
            if (createBtnBox && currentUser) {
                if (currentUser.role === "institution") {
                    createBtnBox.innerHTML = `
                        <button class="primary" onclick="window.location.href='approval.html'">
                            <i class="fa-solid fa-plus"></i> New Application
                        </button>
                    `;
                }
            }

            const filterValue = filterStatus ? filterStatus.value : "all";
            const emailParam = currentUser ? currentUser.email : "";
            const roleParam = currentUser ? currentUser.role : "";

            try {
                const response = await fetch(`/api/applications?email=${emailParam}&role=${roleParam}&status=${filterValue}`);
                const applications = await response.json();

                appListTable.innerHTML = "";
                
                if (applications.length === 0) {
                    appListTable.innerHTML = `
                        <tr>
                            <td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 3rem;">
                                No applications found.
                            </td>
                        </tr>
                    `;
                    return;
                }

                applications.forEach(app => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td><strong>${app.id}</strong></td>
                        <td>${app.college}</td>
                        <td>${app.submittedDate}</td>
                        <td><span class="status ${app.status}">${app.status.toUpperCase()}</span></td>
                        <td>
                            <button class="secondary action-view-btn" data-id="${app.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; font-weight: 600; border-radius: 6px;">
                                View Details
                            </button>
                        </td>
                    `;
                    appListTable.appendChild(tr);
                });

                document.querySelectorAll(".action-view-btn").forEach(btn => {
                    btn.addEventListener("click", () => {
                        const appId = btn.getAttribute("data-id");
                        openAppDetailModal(appId, applications);
                    });
                });
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                appListTable.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--danger)">Error loading dashboard data.</td></tr>`;
            }
        };

        const openAppDetailModal = (appId, applicationsList) => {
            const modal = document.getElementById("detailModal");
            const modalBody = document.getElementById("modalBody");
            const modalFooter = document.getElementById("modalFooter");
            
            if (!modal || !modalBody || !modalFooter) return;
            
            const app = applicationsList.find(a => a.id === appId);
            if (!app) return;

            // Render Body HTML
            modalBody.innerHTML = `
                <div class="modal-section">
                    <h4>Institution Details</h4>
                    <div class="details-grid">
                        <div class="detail-item"><label>ID</label><span>${app.id}</span></div>
                        <div class="detail-item"><label>College Name</label><span>${app.college}</span></div>
                        <div class="detail-item"><label>Type</label><span>${app.type}</span></div>
                        <div class="detail-item"><label>Region</label><span>${app.region}</span></div>
                        <div class="detail-item"><label>Land Area</label><span>${app.landArea}</span></div>
                        <div class="detail-item"><label>Built-up Area</label><span>${app.builtUpArea}</span></div>
                    </div>
                </div>

                <div class="modal-section">
                    <h4>Faculty Members (${app.faculty.length})</h4>
                    <table style="margin-top: 0.5rem; border: 1px solid var(--border-color); border-radius: 8px;">
                        <thead>
                            <tr>
                                <th style="padding: 0.5rem 1rem; border-bottom: 1px solid var(--border-color);">Name</th>
                                <th style="padding: 0.5rem 1rem; border-bottom: 1px solid var(--border-color);">Qualification</th>
                                <th style="padding: 0.5rem 1rem; border-bottom: 1px solid var(--border-color);">Experience</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${app.faculty.map(f => `
                                <tr>
                                    <td style="padding: 0.5rem 1rem;">${f.name}</td>
                                    <td style="padding: 0.5rem 1rem;">${f.qualification}</td>
                                    <td style="padding: 0.5rem 1rem;">${f.experience}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>

                <div class="modal-section">
                    <h4>AI Validation Verification</h4>
                    <div class="details-grid">
                        <div class="detail-item"><label>OCR Scan Status</label><span>${app.ocrStatus}</span></div>
                        <div class="detail-item"><label>AI Match Confidence</label><span style="color: var(--success); font-weight: 700;">${app.confidence}</span></div>
                        <div class="detail-item" style="grid-column: span 2;"><label>Attached Files</label><span>${app.documents.join(", ")}</span></div>
                    </div>
                </div>

                <div class="modal-section">
                    <h4>AI Compliance Checks Checklist</h4>
                    <div class="compliance-checklist">
                        <div class="compliance-item">
                            <span class="title">Land Ratio Requirement</span>
                            <span class="status-badge pass"><i class="fa-solid fa-circle-check"></i> Compliant</span>
                        </div>
                        <div class="compliance-item">
                            <span class="title">Built-up Academic Area</span>
                            <span class="status-badge pass"><i class="fa-solid fa-circle-check"></i> Compliant</span>
                        </div>
                        <div class="compliance-item">
                            <span class="title">Faculty Student Ratio</span>
                            <span class="status-badge pass"><i class="fa-solid fa-circle-check"></i> Compliant</span>
                        </div>
                        <div class="compliance-item">
                            <span class="title">Fire & Structural Safety</span>
                            <span class="status-badge pass"><i class="fa-solid fa-circle-check"></i> Compliant</span>
                        </div>
                    </div>
                </div>

                <div class="modal-section">
                    <h4>Remarks & Evaluator Notes</h4>
                    <p style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); padding: 1rem; border-radius: 8px; font-size: 0.85rem; color: var(--text-secondary);">
                        ${app.remarks || "No evaluation remarks posted yet."}
                    </p>
                </div>

                <div class="modal-section">
                    <h4>Verification Process Audit Timeline</h4>
                    <div class="audit-timeline">
                        <div class="timeline-event completed">
                            <div class="timeline-event-header">
                                <span>Institutional Form Received</span>
                                <span class="date">${app.submittedDate}</span>
                            </div>
                            <p>All basic info records, facility dimensions, and land profiles registered by administrator.</p>
                        </div>
                        <div class="timeline-event completed">
                            <div class="timeline-event-header">
                                <span>AI Format Check & Document OCR Parsing</span>
                                <span class="date">${app.submittedDate}</span>
                            </div>
                            <p>Automated OCR verification scan completed on PDFs with match index of ${app.confidence}.</p>
                        </div>
                        <div class="timeline-event ${app.status === "approved" || app.status === "rejected" || app.status === "review" ? "completed" : ""}">
                            <div class="timeline-event-header">
                                <span>Board Evaluator Assigned</span>
                                <span class="date">${app.submittedDate}</span>
                            </div>
                            <p>Case registered under regional office board evaluators for physical auditing audits.</p>
                        </div>
                        ${app.status !== "pending" ? `
                        <div class="timeline-event success">
                            <div class="timeline-event-header">
                                <span>Board Resolution & Status Set to ${app.status.toUpperCase()}</span>
                                <span class="date">${app.updatedAt || app.submittedDate}</span>
                            </div>
                            <p>Evaluators concluded processing. Decisions recorded in active centralized board register.</p>
                        </div>
                        ` : ""}
                    </div>
                </div>
            `;

            // If Evaluator logged in and case is unresolved, show controls
            if (currentUser && currentUser.role === "evaluator" && app.status !== "approved" && app.status !== "rejected") {
                modalBody.innerHTML += `
                    <div class="evaluator-actions-card">
                        <h4 style="border-bottom: none; padding-bottom: 0;">Evaluator Controls</h4>
                        <div class="form-group" style="margin-top: 1rem;">
                            <label>Add Evaluation Remarks</label>
                            <div class="input-wrapper">
                                <textarea id="evalRemarks" placeholder="Provide details regarding the status decision..." style="padding-left: 1rem; min-height: 80px;"></textarea>
                            </div>
                        </div>
                        <div class="evaluator-buttons">
                            <button class="btn-approve" data-id="${app.id}">Approve</button>
                            <button class="btn-request-review" data-id="${app.id}">Request Review</button>
                            <button class="btn-reject" data-id="${app.id}">Reject</button>
                        </div>
                    </div>
                `;
            }

            // Close button & Certificate button in footer
            let footerBtns = `<button class="secondary close-modal-btn">Close Window</button>`;
            if (app.status === "approved") {
                footerBtns = `
                    <button class="btn-certificate print-cert-btn" style="margin-right: auto;">
                        <i class="fa-solid fa-medal"></i> Generate Approval Certificate
                    </button>
                ` + footerBtns;
            }
            modalFooter.innerHTML = footerBtns;

            modal.classList.add("active");

            // Attach events
            const closeBtn = modal.querySelector(".close-modal");
            const closeBtnFooter = modal.querySelector(".close-modal-btn");
            const printCertBtn = modal.querySelector(".print-cert-btn");
            
            const closeModal = () => modal.classList.remove("active");
            
            if (closeBtn) closeBtn.addEventListener("click", closeModal);
            if (closeBtnFooter) closeBtnFooter.addEventListener("click", closeModal);
            if (printCertBtn) {
                printCertBtn.addEventListener("click", () => {
                    openCertificateWindow(app);
                });
            }

            // Evaluator decision actions mapping to Express Backend PUT requests
            const approveBtn = modal.querySelector(".btn-approve");
            const rejectBtn = modal.querySelector(".btn-reject");
            const reviewBtn = modal.querySelector(".btn-request-review");

            const handleDecision = async (newStatus) => {
                const remarksText = document.getElementById("evalRemarks")?.value || "";
                
                try {
                    const response = await fetch(`/api/applications/${app.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: newStatus, remarks: remarksText })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        alert(`Application ${app.id} status successfully updated to ${newStatus.toUpperCase()}!`);
                        closeModal();
                        renderDashboard();
                    } else {
                        alert(data.error || "Decision update failed.");
                    }
                } catch (err) {
                    console.error("PUT request error:", err);
                    alert("Unable to connect to backend server.");
                }
            };

            if (approveBtn) approveBtn.addEventListener("click", () => handleDecision("approved"));
            if (rejectBtn) rejectBtn.addEventListener("click", () => handleDecision("rejected"));
            if (reviewBtn) reviewBtn.addEventListener("click", () => handleDecision("review"));
        };

        const filterStatus = document.getElementById("filterStatus");
        if (filterStatus) {
            filterStatus.addEventListener("change", renderDashboard);
        }

        renderDashboard();
    }

    // ----------------------------------------------------------------------
    // 6. Interactive Analytics Charts (analytics.html)
    // ----------------------------------------------------------------------
    if (pageName === "analytics.html") {
        const renderCharts = async () => {
            try {
                const response = await fetch("/api/stats");
                const stats = await response.json();

                // Update summary stat boxes
                document.getElementById("totalAppsStat").innerText = stats.total;
                document.getElementById("approvedAppsStat").innerText = stats.approved;
                document.getElementById("avgConfidenceStat").innerText = stats.avgConfidence;

                if (typeof Chart === "undefined") {
                    console.error("Chart.js failed to load.");
                    return;
                }

                // Theme colors
                const primaryColor = "#00f2fe";
                const secondaryColor = "#7f00ff";
                const successColor = "#00e676";
                const dangerColor = "#ff1744";
                const pendingColor = "#ffb300";
                const textColor = "#a0aec0";
                const gridBorderColor = "rgba(255, 255, 255, 0.05)";

                const chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: textColor, font: { family: "Poppins", size: 11 } } }
                    },
                    scales: {
                        x: {
                            grid: { color: gridBorderColor },
                            ticks: { color: textColor, font: { family: "Poppins", size: 10 } }
                        },
                        y: {
                            grid: { color: gridBorderColor },
                            ticks: { color: textColor, font: { family: "Poppins", size: 10 } }
                        }
                    }
                };

                // Doughnut chart: Status allocations
                const ctxStatus = document.getElementById("statusChart")?.getContext("2d");
                if (ctxStatus) {
                    new Chart(ctxStatus, {
                        type: "doughnut",
                        data: {
                            labels: ["Approved", "Pending", "Under Review", "Rejected"],
                            datasets: [{
                                data: [stats.approved, stats.pending, stats.review, stats.rejected],
                                backgroundColor: [successColor, pendingColor, "#ff5722", dangerColor],
                                borderColor: "#0d142d",
                                borderWidth: 2
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: "bottom",
                                    labels: { color: textColor, font: { family: "Poppins" } }
                                }
                            }
                        }
                    });
                }

                // Bar chart: Regional distribution
                const ctxRegions = document.getElementById("regionChart")?.getContext("2d");
                if (ctxRegions) {
                    new Chart(ctxRegions, {
                        type: "bar",
                        data: {
                            labels: Object.keys(stats.regions),
                            datasets: [{
                                label: "Applications Case Count",
                                data: Object.values(stats.regions),
                                backgroundColor: "rgba(0, 242, 254, 0.5)",
                                borderColor: primaryColor,
                                borderWidth: 1.5
                            }]
                        },
                        options: chartOptions
                    });
                }

                // Radar chart: Program categories distribution
                const ctxTypes = document.getElementById("typeChart")?.getContext("2d");
                if (ctxTypes) {
                    new Chart(ctxTypes, {
                        type: "radar",
                        data: {
                            labels: Object.keys(stats.types),
                            datasets: [{
                                label: "Program Types Count",
                                data: Object.values(stats.types),
                                backgroundColor: "rgba(127, 0, 255, 0.2)",
                                borderColor: secondaryColor,
                                pointBackgroundColor: primaryColor,
                                borderWidth: 2
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { labels: { color: textColor, font: { family: "Poppins" } } }
                            },
                            scales: {
                                r: {
                                    grid: { color: gridBorderColor },
                                    angleLines: { color: gridBorderColor },
                                    pointLabels: { color: textColor, font: { family: "Poppins", size: 10 } },
                                    ticks: { display: false }
                                }
                            }
                        }
                    });
                }
            } catch (err) {
                console.error("Stats loading failure:", err);
            }
        };

        renderCharts();
    }

    // ----------------------------------------------------------------------
    // 7. Support & AI Assistant Chatbot (support.html)
    // ----------------------------------------------------------------------
    if (pageName === "support.html") {
        const faqItems = document.querySelectorAll(".faq-item");
        faqItems.forEach(item => {
            item.addEventListener("click", () => {
                const isActive = item.classList.contains("active");
                faqItems.forEach(i => i.classList.remove("active"));
                if (!isActive) {
                    item.classList.add("active");
                }
            });
        });

        const chatMessages = document.getElementById("supportChatMessages");
        const chatInput = document.getElementById("chatInput");
        const sendBtn = document.getElementById("sendBtn");
        
        const appendMessage = (sender, text) => {
            if (!chatMessages) return;
            
            const msg = document.createElement("div");
            msg.className = sender === "bot" ? "bot" : "user";
            
            if (sender === "bot") {
                msg.innerHTML = `<i class="fa-solid fa-robot" style="color: var(--primary); margin-right: 0.5rem;"></i><span>${text}</span>`;
            } else {
                msg.innerText = text;
            }
            
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const showTypingIndicator = () => {
            const ind = document.createElement("div");
            ind.className = "bot typing-indicator";
            ind.id = "typingIndicator";
            ind.innerHTML = `<i class="fa-solid fa-robot" style="color: var(--primary); margin-right: 0.5rem;"></i><span>AI Assistant is drafting response...</span>`;
            chatMessages.appendChild(ind);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const removeTypingIndicator = () => {
            const ind = document.getElementById("typingIndicator");
            if (ind) ind.remove();
        };

        const handleSend = async (customText = "") => {
            const text = customText || chatInput.value.trim();
            if (!text) return;
            
            if (!customText) chatInput.value = "";
            appendMessage("user", text);
            
            showTypingIndicator();
            
            try {
                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: text })
                });
                
                const data = await response.json();
                
                setTimeout(() => {
                    removeTypingIndicator();
                    appendMessage("bot", data.reply || "Unable to parse request.");
                }, 1000);
            } catch (err) {
                console.error("Chat API error:", err);
                setTimeout(() => {
                    removeTypingIndicator();
                    appendMessage("bot", "Error connecting to AI central board helpdesk backend.");
                }, 1000);
            }
        };

        if (sendBtn && chatInput) {
            sendBtn.addEventListener("click", () => handleSend());
            chatInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") handleSend();
            });
        }

        document.querySelectorAll(".chat-suggestion-chips .chip").forEach(chip => {
            chip.addEventListener("click", () => {
                handleSend(chip.innerText);
            });
        });
    }
});
