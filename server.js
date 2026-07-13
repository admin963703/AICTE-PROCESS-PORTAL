/* ==========================================================================
   AICTE APPROVAL PROCESS PORTAL - FULL-STACK BACKEND SERVER (NODE.JS + EXPRESS)
   ========================================================================== */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Serve static frontend files directly from the current folder
app.use(express.static(path.join(__dirname)));

// File-based Database paths
const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure db directory exists
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR);
}

// --------------------------------------------------------------------------
// Database Helper Controllers
// --------------------------------------------------------------------------
const getInitialDb = () => {
    return {
        users: [
            { email: "admin@aicte.gov.in", password: "Password123", role: "evaluator", org: "AICTE Central Board" },
            { email: "admin@mit.edu", password: "Password123", role: "institution", org: "MIT Engineering College" },
            { email: "director@abc.edu", password: "Password123", role: "institution", org: "ABC Engineering College" }
        ],
        institutions: [
            {
                email: "admin@mit.edu",
                name: "MIT Engineering College",
                shortName: "MITEC",
                type: "Engineering",
                established: 1998,
                affiliation: "Anna University",
                autonomyStatus: "Autonomous",
                naacGrade: "A+",
                naacScore: "3.62",
                nbaAccredited: true,
                nirfRank: 48,
                address: {
                    street: "12, MIT Campus Road, Chromepet",
                    city: "Chennai",
                    state: "Tamil Nadu",
                    pincode: "600044",
                    region: "South"
                },
                contact: {
                    phone: "+91-44-2256-1000",
                    altPhone: "+91-44-2256-1001",
                    fax: "+91-44-2256-1002",
                    email: "admin@mit.edu",
                    website: "www.mitcollege.edu.in",
                    principalName: "Dr. R. Krishnamurthy",
                    principalPhone: "+91-98765-43210",
                    principalEmail: "principal@mit.edu"
                },
                infrastructure: {
                    totalLand: "12 Acres",
                    builtUpArea: "45,000 sq m",
                    classrooms: 48,
                    tutorialRooms: 12,
                    drawingHalls: 4,
                    computerLabs: 8,
                    engineeringLabs: 16,
                    researchLabs: 6,
                    librarySeats: 500,
                    libraryBooks: 45000,
                    eJournals: 12000,
                    hostelBoys: 600,
                    hostelGirls: 400,
                    sportsGround: true,
                    indoorSports: true,
                    cafeteria: true,
                    medicalRoom: true,
                    auditoriumCapacity: 1200,
                    seminarHalls: 8,
                    conferenceRooms: 4,
                    workshopArea: "2,400 sq m",
                    generatorBackup: "2 x 500 KVA",
                    internetBandwidth: "1 Gbps",
                    cctvCount: 240
                },
                programs: [
                    { code: "CSE",  name: "B.Tech Computer Science & Engineering",       intake: 120, duration: "4 Years", annualFee: 85000,  approvalStatus: "approved", approvedYear: 2001 },
                    { code: "ECE",  name: "B.Tech Electronics & Communication Engg.",   intake: 60,  duration: "4 Years", annualFee: 80000,  approvalStatus: "approved", approvedYear: 2001 },
                    { code: "MECH", name: "B.Tech Mechanical Engineering",               intake: 60,  duration: "4 Years", annualFee: 75000,  approvalStatus: "approved", approvedYear: 2003 },
                    { code: "CIVIL",name: "B.Tech Civil Engineering",                    intake: 60,  duration: "4 Years", annualFee: 72000,  approvalStatus: "approved", approvedYear: 2005 },
                    { code: "EEE",  name: "B.Tech Electrical & Electronics Engg.",      intake: 60,  duration: "4 Years", annualFee: 78000,  approvalStatus: "approved", approvedYear: 2007 },
                    { code: "IT",   name: "B.Tech Information Technology",               intake: 60,  duration: "4 Years", annualFee: 82000,  approvalStatus: "approved", approvedYear: 2009 },
                    { code: "AIDS", name: "B.Tech AI & Data Science",                   intake: 60,  duration: "4 Years", annualFee: 95000,  approvalStatus: "approved", approvedYear: 2021 },
                    { code: "MCS",  name: "M.Tech Computer Science & Engineering",       intake: 24,  duration: "2 Years", annualFee: 95000,  approvalStatus: "approved", approvedYear: 2010 },
                    { code: "MBA",  name: "Master of Business Administration",           intake: 60,  duration: "2 Years", annualFee: 90000,  approvalStatus: "pending",  approvedYear: 2026 }
                ],
                faculty: [
                    { name: "Dr. R. Krishnamurthy", designation: "Principal",            department: "Administration", qualification: "Ph.D. Computer Science",  experience: "28 Years", publications: 45 },
                    { name: "Dr. Ananya Sen",        designation: "HOD & Professor",      department: "CSE",           qualification: "Ph.D. AI & Machine Learning",experience: "18 Years", publications: 32 },
                    { name: "Dr. Rajesh Sharma",     designation: "Professor",            department: "ECE",           qualification: "Ph.D. VLSI Design",         experience: "15 Years", publications: 28 },
                    { name: "Dr. Priya Venkat",      designation: "Associate Professor",  department: "MECH",          qualification: "Ph.D. Thermal Engineering",  experience: "12 Years", publications: 19 },
                    { name: "Prof. Karthik Rajan",   designation: "Assistant Professor",  department: "CSE",           qualification: "M.Tech Networks",           experience: "8 Years",  publications: 11 },
                    { name: "Dr. Sunita Iyer",       designation: "Professor",            department: "CIVIL",         qualification: "Ph.D. Structural Engineering",experience: "20 Years", publications: 36 },
                    { name: "Prof. Mohan Das",       designation: "Assistant Professor",  department: "EEE",           qualification: "M.Tech Power Systems",      experience: "6 Years",  publications: 7  },
                    { name: "Dr. Deepa Nair",        designation: "Associate Professor",  department: "IT",            qualification: "Ph.D. Cyber Security",      experience: "14 Years", publications: 22 }
                ],
                documents: [
                    { name: "Land_Ownership_Certificate.pdf", category: "Land & Building",  ocrStatus: "Verified",    confidence: "99.1%", uploadDate: "2026-06-14", size: "2.4 MB" },
                    { name: "Building_Plan_Approval.pdf",     category: "Land & Building",  ocrStatus: "Verified",    confidence: "98.7%", uploadDate: "2026-06-14", size: "5.8 MB" },
                    { name: "Fire_Safety_Certificate.pdf",    category: "Safety",           ocrStatus: "Verified",    confidence: "97.3%", uploadDate: "2026-06-14", size: "1.2 MB" },
                    { name: "NAAC_Grade_Certificate.pdf",     category: "Accreditation",    ocrStatus: "Verified",    confidence: "99.5%", uploadDate: "2026-06-14", size: "0.8 MB" },
                    { name: "NBA_Accreditation_Letter.pdf",   category: "Accreditation",    ocrStatus: "Verified",    confidence: "98.9%", uploadDate: "2026-06-14", size: "1.1 MB" },
                    { name: "Faculty_List_Signed.pdf",        category: "Faculty",          ocrStatus: "Verified",    confidence: "96.8%", uploadDate: "2026-06-14", size: "3.2 MB" },
                    { name: "Fee_Structure_2026.pdf",         category: "Finance",          ocrStatus: "Verified",    confidence: "99.2%", uploadDate: "2026-06-14", size: "0.6 MB" },
                    { name: "Bank_Solvency_Certificate.pdf",  category: "Finance",          ocrStatus: "Verified",    confidence: "98.1%", uploadDate: "2026-06-14", size: "0.9 MB" },
                    { name: "Affiliation_Certificate.pdf",    category: "Affiliation",      ocrStatus: "Verified",    confidence: "99.4%", uploadDate: "2026-06-14", size: "1.5 MB" },
                    { name: "ESC_Compliance_Report.pdf",      category: "Compliance",       ocrStatus: "Scanning...", confidence: "88.5%", uploadDate: "2026-07-05", size: "4.1 MB" }
                ],
                finances: {
                    processingFees: [
                        { applicationId: "#1021", amount: 150000, currency: "INR", date: "2026-06-14", mode: "UPI",          txnId: "TXN8821447", status: "Success" },
                        { applicationId: "#1005", amount: 150000, currency: "INR", date: "2026-07-08", mode: "Net Banking",   txnId: "TXN9934512", status: "Success" }
                    ],
                    totalPaid: 300000,
                    pendingFees: 0,
                    bankName: "State Bank of India",
                    bankBranch: "Chennai - Anna Salai",
                    accountNumber: "XXXX XXXX 7832",
                    ifscCode: "SBIN0001234"
                },
                auditLog: [
                    { date: "2026-06-13", time: "10:22 AM", action: "Registration Completed",      by: "admin@mit.edu",        category: "auth",       note: "Institution account created on AICTE portal" },
                    { date: "2026-06-14", time: "02:15 PM", action: "Application Submitted",        by: "admin@mit.edu",        category: "submission", note: "Application #1021 submitted with 10 documents" },
                    { date: "2026-06-14", time: "02:17 PM", action: "Processing Fee Paid",          by: "admin@mit.edu",        category: "payment",    note: "Rs.1,50,000 paid via UPI. TXN: TXN8821447" },
                    { date: "2026-06-15", time: "09:00 AM", action: "AI OCR Document Scan Initiated",by: "AICTE AI Engine",     category: "ai",         note: "All 10 documents queued for OCR verification" },
                    { date: "2026-06-15", time: "09:08 AM", action: "OCR Scan Completed",          by: "AICTE AI Engine",      category: "ai",         note: "Avg confidence: 98.9%. 9/10 documents verified" },
                    { date: "2026-06-15", time: "09:10 AM", action: "Compliance Auto-Check Passed", by: "AICTE AI Engine",     category: "ai",         note: "Infrastructure, faculty, financials all meet AICTE norms" },
                    { date: "2026-06-16", time: "11:30 AM", action: "Evaluator Assigned",           by: "admin@aicte.gov.in",   category: "review",     note: "Dr. S. Patel (AICTE Regional Officer, Chennai) assigned" },
                    { date: "2026-06-17", time: "03:00 PM", action: "Physical Inspection Scheduled",by: "admin@aicte.gov.in",  category: "review",     note: "Inspection date: June 18, 2026 at 10:00 AM" },
                    { date: "2026-06-18", time: "12:45 PM", action: "Application Approved",         by: "admin@aicte.gov.in",   category: "decision",   note: "All criteria met. Full approval granted for 2026-27 academic session" },
                    { date: "2026-07-05", time: "04:30 PM", action: "Expansion Application Submitted",by: "admin@mit.edu",     category: "submission", note: "Application #1005 submitted for new MBA program" },
                    { date: "2026-07-08", time: "10:20 AM", action: "Payment Confirmed",            by: "Payment Gateway",      category: "payment",    note: "Rs.1,50,000 paid via Net Banking. TXN: TXN9934512" }
                ]
            },
            {
                email: "director@abc.edu",
                name: "ABC Engineering College",
                shortName: "ABCEC",
                type: "Engineering",
                established: 2005,
                affiliation: "VTU (Visvesvaraya Technological University)",
                autonomyStatus: "Affiliated",
                naacGrade: "B++",
                naacScore: "2.94",
                nbaAccredited: false,
                nirfRank: 124,
                address: {
                    street: "45, ABC College Road, Rajajinagar",
                    city: "Bangalore",
                    state: "Karnataka",
                    pincode: "560010",
                    region: "South-West"
                },
                contact: {
                    phone: "+91-80-2340-5678",
                    altPhone: "+91-80-2340-5679",
                    fax: "+91-80-2340-5680",
                    email: "director@abc.edu",
                    website: "www.abcengg.edu.in",
                    principalName: "Dr. Sanjay Kumar",
                    principalPhone: "+91-98400-12345",
                    principalEmail: "principal@abc.edu"
                },
                infrastructure: {
                    totalLand: "12 Acres",
                    builtUpArea: "45,000 sq m",
                    classrooms: 36,
                    tutorialRooms: 8,
                    drawingHalls: 3,
                    computerLabs: 6,
                    engineeringLabs: 12,
                    researchLabs: 2,
                    librarySeats: 300,
                    libraryBooks: 28000,
                    eJournals: 6000,
                    hostelBoys: 350,
                    hostelGirls: 250,
                    sportsGround: true,
                    indoorSports: false,
                    cafeteria: true,
                    medicalRoom: true,
                    auditoriumCapacity: 800,
                    seminarHalls: 4,
                    conferenceRooms: 2,
                    workshopArea: "1,600 sq m",
                    generatorBackup: "1 x 320 KVA",
                    internetBandwidth: "500 Mbps",
                    cctvCount: 120
                },
                programs: [
                    { code: "CSE",  name: "B.Tech Computer Science & Engineering",  intake: 60,  duration: "4 Years", annualFee: 75000, approvalStatus: "approved", approvedYear: 2005 },
                    { code: "ECE",  name: "B.Tech Electronics & Communication Engg.",intake: 60,  duration: "4 Years", annualFee: 70000, approvalStatus: "approved", approvedYear: 2005 },
                    { code: "MECH", name: "B.Tech Mechanical Engineering",           intake: 60,  duration: "4 Years", annualFee: 68000, approvalStatus: "approved", approvedYear: 2007 },
                    { code: "CIVIL",name: "B.Tech Civil Engineering",                intake: 60,  duration: "4 Years", annualFee: 65000, approvalStatus: "approved", approvedYear: 2009 }
                ],
                faculty: [
                    { name: "Dr. Sanjay Kumar",    designation: "Principal",           department: "Administration", qualification: "Ph.D. Electrical Engg.",    experience: "22 Years", publications: 18 },
                    { name: "Dr. Meena Rao",       designation: "HOD & Professor",     department: "CSE",           qualification: "Ph.D. Data Mining",         experience: "16 Years", publications: 24 },
                    { name: "Prof. Vijay Shetty",  designation: "Associate Professor", department: "ECE",           qualification: "M.Tech Signal Processing",  experience: "10 Years", publications: 13 },
                    { name: "Dr. Kavitha Gowda",   designation: "Assistant Professor", department: "MECH",          qualification: "Ph.D. Fluid Mechanics",     experience: "9 Years",  publications: 9  }
                ],
                documents: [
                    { name: "Land_Certificate.pdf",    category: "Land & Building", ocrStatus: "Verified", confidence: "98.9%", uploadDate: "2026-06-15", size: "2.1 MB" },
                    { name: "Building_Plan.pdf",       category: "Land & Building", ocrStatus: "Verified", confidence: "97.4%", uploadDate: "2026-06-15", size: "4.6 MB" },
                    { name: "Fire_Safety.pdf",         category: "Safety",          ocrStatus: "Verified", confidence: "96.1%", uploadDate: "2026-06-15", size: "1.0 MB" },
                    { name: "NAAC_Certificate.pdf",    category: "Accreditation",   ocrStatus: "Verified", confidence: "98.2%", uploadDate: "2026-06-15", size: "0.7 MB" },
                    { name: "Faculty_Records.pdf",     category: "Faculty",         ocrStatus: "Verified", confidence: "95.5%", uploadDate: "2026-06-15", size: "2.9 MB" },
                    { name: "Fee_Receipt.pdf",         category: "Finance",         ocrStatus: "Verified", confidence: "99.0%", uploadDate: "2026-06-15", size: "0.5 MB" }
                ],
                finances: {
                    processingFees: [
                        { applicationId: "#1021", amount: 150000, currency: "INR", date: "2026-06-15", mode: "UPI", txnId: "TXN7712344", status: "Success" }
                    ],
                    totalPaid: 150000,
                    pendingFees: 0,
                    bankName: "Canara Bank",
                    bankBranch: "Bangalore - Rajajinagar",
                    accountNumber: "XXXX XXXX 5541",
                    ifscCode: "CNRB0005432"
                },
                auditLog: [
                    { date: "2026-06-13", time: "11:00 AM", action: "Registration Completed",     by: "director@abc.edu",     category: "auth",       note: "Institution registered on AICTE portal" },
                    { date: "2026-06-15", time: "10:30 AM", action: "Application Submitted",       by: "director@abc.edu",     category: "submission", note: "Application #1021 submitted with 6 documents" },
                    { date: "2026-06-15", time: "10:32 AM", action: "Processing Fee Paid",         by: "director@abc.edu",     category: "payment",    note: "Rs.1,50,000 via UPI. TXN: TXN7712344" },
                    { date: "2026-06-16", time: "08:55 AM", action: "OCR Scan Completed",          by: "AICTE AI Engine",      category: "ai",         note: "Avg confidence: 97.5%. All 6 documents verified" },
                    { date: "2026-06-17", time: "02:00 PM", action: "Evaluator Assigned",          by: "admin@aicte.gov.in",   category: "review",     note: "Evaluator Dr. Ramesh assigned for Southwest zone" },
                    { date: "2026-06-18", time: "04:00 PM", action: "Application Approved",        by: "admin@aicte.gov.in",   category: "decision",   note: "All criteria met. Approval granted 2026-27" }
                ]
            }
        ],
        applications: [
            {
                id: "#1021",
                college: "ABC Engineering College",
                submittedBy: "director@abc.edu",
                submittedDate: "2026-06-15",
                status: "approved",
                type: "Engineering",
                region: "South-West",
                landArea: "12 Acres",
                builtUpArea: "45,000 sq m",
                faculty: [
                    { name: "Dr. Rajesh Sharma", qualification: "Ph.D. CSE", experience: "15 Years" },
                    { name: "Prof. Ananya Sen", qualification: "M.Tech CSE", experience: "8 Years" }
                ],
                documents: ["Land_Certificate.pdf", "Building_Plan.pdf", "Fire_Safety.pdf"],
                ocrStatus: "Verified",
                confidence: "98.9%",
                remarks: "Infrastructure and faculty numbers meet all compliance metrics.",
                updatedAt: "2026-06-18"
            },
            {
                id: "#1022",
                college: "XYZ Polytechnic",
                submittedBy: "principal@xyz.edu",
                submittedDate: "2026-07-01",
                status: "pending",
                type: "Polytechnic",
                region: "North",
                landArea: "6 Acres",
                builtUpArea: "18,000 sq m",
                faculty: [
                    { name: "Dr. K. Srinivasan", qualification: "Ph.D. ME", experience: "12 Years" }
                ],
                documents: ["Land_Certificate.pdf", "Safety_Certificate.pdf"],
                ocrStatus: "Scanning...",
                confidence: "87.5%",
                remarks: "",
                updatedAt: "2026-07-01"
            },
            {
                id: "#1023",
                college: "National Institute of Pharmacy",
                submittedBy: "admin@nip.edu",
                submittedDate: "2026-06-28",
                status: "review",
                type: "Pharmacy",
                region: "Central",
                landArea: "8 Acres",
                builtUpArea: "22,000 sq m",
                faculty: [
                    { name: "Dr. Meera Nair", qualification: "Ph.D. Pharmacy", experience: "10 Years" },
                    { name: "Dr. Dev Anand", qualification: "Ph.D. Chemistry", experience: "14 Years" }
                ],
                documents: ["Land_Certificate.pdf", "PCI_Approval.pdf"],
                ocrStatus: "Verified",
                confidence: "91.2%",
                remarks: "Evaluator requested verification on Pharm.D equipment specifications.",
                updatedAt: "2026-07-03"
            },
            {
                id: "#1024",
                college: "AI Tech College",
                submittedBy: "admin@aitech.edu",
                submittedDate: "2026-06-10",
                status: "approved",
                type: "Engineering",
                region: "West",
                landArea: "10 Acres",
                builtUpArea: "38,000 sq m",
                faculty: [
                    { name: "Dr. Alan Turing", qualification: "Ph.D. AI", experience: "20 Years" }
                ],
                documents: ["Land_Doc.pdf", "AI_Curriculum.pdf", "Fire_Safety.pdf"],
                ocrStatus: "Verified",
                confidence: "99.2%",
                remarks: "Excellent setup for AI/ML specialized laboratory equipment.",
                updatedAt: "2026-06-12"
            }
        ]
    };
};

const readDb = () => {
    try {
        if (!fs.existsSync(DB_FILE)) {
            const initial = getInitialDb();
            fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
            return initial;
        }
        const data = fs.readFileSync(DB_FILE, 'utf8');
        const db = JSON.parse(data);
        
        // Robust check: if any required section is missing or empty, seed it from initial DB
        const initial = getInitialDb();
        let modified = false;
        for (const key in initial) {
            if (!db[key] || !Array.isArray(db[key]) || db[key].length === 0) {
                db[key] = initial[key];
                modified = true;
            }
        }
        if (modified) {
            fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
        }
        return db;
    } catch (err) {
        console.error("Error reading db file:", err);
        return getInitialDb();
    }
};

const writeDb = (dbData) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf8');
    } catch (err) {
        console.error("Error writing db file:", err);
    }
};

// --------------------------------------------------------------------------
// AUTHENTICATION APIs
// --------------------------------------------------------------------------
app.post('/api/auth/register', (req, res) => {
    const { email, password, org, role } = req.body;
    if (!email || !password || !org || !role) {
        return res.status(400).json({ error: "Missing required registration parameters." });
    }

    const db = readDb();
    const existing = db.users.find(u => u.email === email);
    if (existing) {
        return res.status(409).json({ error: "User already exists with this email address." });
    }

    const newUser = { email, password, org, role };
    db.users.push(newUser);
    writeDb(db);

    res.status(201).json({ message: "Registration successful", user: { email, org, role } });
});

// In-memory active OTP database mapping: email -> { otp, expiresAt, user }
const activeOtps = new Map();

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Missing authentication parameters." });
    }

    const db = readDb();
    const matched = db.users.find(u => u.email === email && u.password === password);
    if (!matched) {
        return res.status(401).json({ error: "Invalid email or password credentials." });
    }

    // Generate numeric 6-digit verification OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5-minute expiry limit

    // Register active 2FA credentials
    activeOtps.set(email, {
        otp,
        expiresAt,
        user: {
            email: matched.email,
            org: matched.org,
            role: matched.role
        }
    });

    console.log(`\n===================================`);
    console.log(`[2FA OTP CODE GENERATED]`);
    console.log(`User  : ${email}`);
    console.log(`Code  : ${otp}`);
    console.log(`Expiry: 5 Minutes`);
    console.log(`===================================\n`);

    res.status(200).json({
        status: "otp_required",
        email: matched.email,
        demoOtp: otp // Returned for sandbox mockup UI alerts
    });
});

app.post('/api/auth/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ error: "Missing email or OTP verification parameters." });
    }

    const sessionRecord = activeOtps.get(email);
    if (!sessionRecord) {
        return res.status(401).json({ error: "No active 2FA verification session found." });
    }

    // Check expiry
    if (Date.now() > sessionRecord.expiresAt) {
        activeOtps.delete(email);
        return res.status(401).json({ error: "Verification code has expired. Please log in again." });
    }

    // Verify match
    if (sessionRecord.otp !== otp) {
        return res.status(401).json({ error: "Incorrect verification code. Please check and try again." });
    }

    // Correct OTP code - Complete login session allocation
    activeOtps.delete(email);
    res.status(200).json(sessionRecord.user);
});

// --------------------------------------------------------------------------
// APPLICATION SUBMISSIONS & LISTINGS APIs
// --------------------------------------------------------------------------
app.get('/api/applications', (req, res) => {
    const { email, role, status } = req.query;
    const db = readDb();

    let list = [...db.applications];

    // Filter by ownership: Institutions see only their submissions, Evaluators see all
    if (role === 'institution' && email) {
        list = list.filter(app => app.submittedBy === email);
    }

    // Filter by specific status pill
    if (status && status !== 'all') {
        list = list.filter(app => app.status === status);
    }

    res.status(200).json(list);
});

app.post('/api/applications', (req, res) => {
    const { college, submittedBy, type, region, landArea, builtUpArea, faculty, documents, confidence } = req.body;

    if (!college || !submittedBy || !type || !region) {
        return res.status(400).json({ error: "Missing required institutional submission fields." });
    }

    const db = readDb();
    const newId = "#" + (1000 + db.applications.length + 1);
    const currentDate = new Date().toISOString().split("T")[0];

    const newApp = {
        id: newId,
        college,
        submittedBy,
        submittedDate: currentDate,
        status: "pending",
        type,
        region,
        landArea: landArea || "10 Acres",
        builtUpArea: builtUpArea || "35,000 sq m",
        faculty: faculty && faculty.length > 0 ? faculty : [{ name: "Dr. Faculty Head", qualification: "Ph.D.", experience: "10 Years" }],
        documents: documents && documents.length > 0 ? documents : ["Land_Certificate.pdf"],
        ocrStatus: "Verified",
        confidence: confidence || "98.9%",
        remarks: "",
        updatedAt: currentDate
    };

    db.applications.push(newApp);
    writeDb(db);

    res.status(201).json({ message: "Application submitted successfully.", application: newApp });
});

app.put('/api/applications/:id', (req, res) => {
    const appId = req.params.id;
    const { status, remarks } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Missing status field update parameters." });
    }

    const db = readDb();
    const appIndex = db.applications.findIndex(a => a.id === appId);

    if (appIndex === -1) {
        return res.status(404).json({ error: "Application file not found." });
    }

    const currentApp = db.applications[appIndex];
    currentApp.status = status;
    currentApp.remarks = remarks || `Status updated to ${status.toUpperCase()} by evaluator.`;
    currentApp.updatedAt = new Date().toISOString().split("T")[0];

    writeDb(db);
    res.status(200).json({ message: "Application updated successfully", application: currentApp });
});

// --------------------------------------------------------------------------
// ANALYTICS & METRICS APIs
// --------------------------------------------------------------------------
app.get('/api/stats', (req, res) => {
    const db = readDb();

    let approvedCount = 0;
    let pendingCount = 0;
    let reviewCount = 0;
    let rejectedCount = 0;
    let totalConfidenceSum = 0;
    let validConfidenceCount = 0;

    const regionCounts = { "East": 0, "West": 0, "North": 0, "South": 0, "South-West": 0, "Central": 0 };
    const typeCounts = { "Engineering": 0, "Pharmacy": 0, "Polytechnic": 0, "Management": 0, "Architecture": 0 };

    db.applications.forEach(a => {
        if (a.status === 'approved') approvedCount++;
        else if (a.status === 'pending') pendingCount++;
        else if (a.status === 'review') reviewCount++;
        else if (a.status === 'rejected') rejectedCount++;

        if (a.confidence) {
            const val = parseFloat(a.confidence);
            if (!isNaN(val)) {
                totalConfidenceSum += val;
                validConfidenceCount++;
            }
        }

        if (regionCounts[a.region] !== undefined) regionCounts[a.region]++;
        if (typeCounts[a.type] !== undefined) typeCounts[a.type]++;
    });

    res.status(200).json({
        total: db.applications.length,
        approved: approvedCount,
        pending: pendingCount,
        review: reviewCount,
        rejected: rejectedCount,
        avgConfidence: validConfidenceCount > 0 
            ? (totalConfidenceSum / validConfidenceCount).toFixed(1) + "%" 
            : "99.8%",
        regions: regionCounts,
        types: typeCounts
    });
});

// --------------------------------------------------------------------------
// SUPPORT CHATBOT API
// --------------------------------------------------------------------------
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Missing chat query message." });
    }

    const query = message.toLowerCase();
    let botReply = "Thank you for reaching out. Your request matches general inquiry logs. If you need special assistance, you can generate a support ticket or call the Central Board helpline at 1800-11-22-33.";

    if (query.includes("apply") || query.includes("how to")) {
        botReply = "To apply, please register as an Institution Admin, log into the portal, and visit the 'Approval' tab. The workflow runs through 5 steps: Info inputs, Faculty roster list, Document uploads, Processing Fee Payment, and running AI Compliance validation.";
    } else if (query.includes("document") || query.includes("upload") || query.includes("pdf")) {
        botReply = "Essential approval files required by AICTE are: Land Ownership/Lease Certificate, Certified Building Blueprint, Fire Safety Audit, and Fee Receipt. Files must be PDFs under 10MB.";
    } else if (query.includes("status") || query.includes("track")) {
        botReply = "You can view your submission's live evaluations at any time in the 'Dashboard' page. Once verified, evaluator decisions (Approved, Request Review, Rejected) will update dynamically.";
    } else if (query.includes("time") || query.includes("duration") || query.includes("days")) {
        botReply = "AI document checks run instantly inside the approval page. General evaluator review checks take 3-5 business days from board submission.";
    } else if (query.includes("fee") || query.includes("cost") || query.includes("payment")) {
        botReply = "AICTE fee depends on institution category: Engineering (₹1.5L), Pharmacy (₹1.0L), Polytechnic (₹75k). Payment links are processed securely via Bharat Bill payment integration prior to final board submission.";
    } else if (query.includes("login") || query.includes("evaluator")) {
        botReply = "To access Evaluator controls, log in using board credentials (admin@aicte.gov.in / Password123). To request changes, use Institution credentials (admin@mit.edu / Password123).";
    } else if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
        botReply = "Welcome to AICTE Approval Support Center. How can I help you today? Ask about document checklists, processing timelines, or status tracking.";
    }

    res.status(200).json({ reply: botReply });
});

// --------------------------------------------------------------------------
// INSTITUTION PROFILE APIs
// --------------------------------------------------------------------------
app.get('/api/institution/profile', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email parameter is required.' });

    const db = readDb();
    const profile = (db.institutions || []).find(i => i.email === email);

    if (!profile) {
        // Auto-create a skeleton profile from user record
        const user = db.users.find(u => u.email === email);
        if (!user) return res.status(404).json({ error: 'Institution profile not found.' });
        const skeleton = {
            email, name: user.org, shortName: '', type: 'Engineering',
            established: new Date().getFullYear(),
            affiliation: '', autonomyStatus: 'Affiliated',
            naacGrade: 'Pending', naacScore: 'N/A', nbaAccredited: false, nirfRank: 0,
            address: { street: '', city: '', state: '', pincode: '', region: '' },
            contact: { phone: '', altPhone: '', fax: '', email, website: '', principalName: '', principalPhone: '', principalEmail: '' },
            infrastructure: {},
            programs: [], faculty: [], documents: [],
            finances: { processingFees: [], totalPaid: 0, pendingFees: 0, bankName: '', bankBranch: '', accountNumber: '', ifscCode: '' },
            auditLog: []
        };
        if (!db.institutions) db.institutions = [];
        db.institutions.push(skeleton);
        writeDb(db);
        return res.status(200).json(skeleton);
    }

    res.status(200).json(profile);
});

app.put('/api/institution/profile', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email parameter is required.' });

    const db = readDb();
    if (!db.institutions) db.institutions = [];
    const idx = db.institutions.findIndex(i => i.email === email);

    if (idx === -1) {
        db.institutions.push({ email, ...req.body });
    } else {
        db.institutions[idx] = { ...db.institutions[idx], ...req.body };
    }

    writeDb(db);
    res.status(200).json({ message: 'Institution profile updated successfully.' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` AICTE Portal server successfully running on port ${PORT}`);
    console.log(` Local access URL: http://localhost:${PORT}`);
    console.log(`=======================================================`);
});
