import json
import codecs
import collections

def update_json_utf8(path, updates):
    try:
        with codecs.open(path, 'r', encoding='utf-8') as f:
            data = json.load(f, object_pairs_hook=collections.OrderedDict)
        
        def deep_update(d, u):
            for k, v in u.items():
                if isinstance(v, collections.abc.Mapping):
                    d[k] = deep_update(d.get(k, collections.OrderedDict()), v)
                else:
                    d[k] = v
            return d

        data = deep_update(data, updates)

        with codecs.open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Updated {path}")
    except Exception as e:
        print(f"Error updating {path}: {e}")

en_updates = {
    "settings": {
        "title": "Account Settings",
        "subtitle": "View and modify your banking profile information.",
        "tabs": {
            "profile": "Profile",
            "security": "Security",
            "prefs": "Settings",
            "my_info": "My Information",
            "security_access": "Security & Access",
            "preferences": "Preferences"
        },
        "profile": {
            "title": "Personal Information",
            "client_folder": "Client Folder",
            "login_id": "LOGIN ID",
            "email_contact": "CONTACT EMAIL",
            "email_verified": "Email Verified",
            "first_name": "First Name",
            "last_name": "Last Name",
            "dob": "Date of Birth",
            "pob": "Place of Birth",
            "phone": "Phone",
            "nationality": "Nationality",
            "address": "Residential Address",
            "city": "City",
            "zip": "Zip Code",
            "location": "Location",
            "save_btn": "Save settings",
            "update_btn": "Update parameters"
        },
        "security": {
            "title": "Authentication Security",
            "password_title": "Password Security",
            "password_desc": "A strong password protects your bank account from unauthorized access.",
            "new_password": "New Password",
            "confirm_password": "Confirm Password",
            "update_pwd_btn": "Update password",
            "update_access_btn": "Update my access",
            "strength": {
                "label": "Strength:",
                "weak": "Weak",
                "medium": "Medium",
                "excellent": "Excellent"
            },
            "protection_level": "PROTECTION LEVEL",
            "optimal_verified": "Optimal and Verified",
            "security_tips": "SECURITY TIPS",
            "security_reqs": "Security requirements",
            "tip_8_chars": "At least 8 characters",
            "tip_caps": "One uppercase and one number",
            "tip_special": "One special character (!@#$)",
            "tip_avoid_personal": "Avoid personal information",
            "last_mod": "Last modified",
            "days_ago": "{{count}} days ago",
            "encrypted_storage": "Encrypted Storage",
            "protected_aes": "Protected by AES-256"
        },
        "advisor": {
            "title": "MY FINANCIAL ADVISOR",
            "role": "Senior Wealth Management Advisor",
            "available": "Currently available",
            "email_label": "PROFESSIONAL EMAIL",
            "phone_label": "DIRECT LINE"
        },
        "preferences": {
            "title": "Account Preferences",
            "personalization": "Personalization",
            "lang_label": "Interface Language",
            "lang_desc": "Language used for menus and statements."
        },
        "messages": {
            "success": "Settings updated successfully.",
            "error": "An error occurred.",
            "pwd_mismatch": "Passwords do not match.",
            "pwd_short": "Password must contain at least 8 characters.",
            "pwd_success": "Password updated successfully.",
            "pwd_error": "Error during change. Please log in again."
        }
    },
    "support": {
        "title": "Assistance & Support",
        "subtitle": "Consult online help or chat with an advisor.",
        "faq": {
            "title": "FAQ & Quick Help",
            "q1": {
                "q": "Transfers not received",
                "a": "A classic SEPA transfer generally takes 1 to 2 business days. If you are waiting for an international transfer, it can take up to 5 days. Check that the provided IBAN is correct."
            },
            "q2": {
                "q": "Card limits",
                "a": "You can view your current limits in the 'Cards' section. For a temporary or permanent increase, please contact your advisor via a support ticket."
            },
            "q3": {
                "q": "Secure my account",
                "a": "Always activate two-factor authentication (2FA). Never share your codes received by SMS. In case of doubt on a transaction, immediately block your card from the app."
            },
            "q4": {
                "q": "Banking fees",
                "a": "Our rates are transparent. The standard account is free. Maintenance fees for premium accounts are debited monthly. Consult our fee schedule in 'Documents'."
            },
            "q5": {
                "q": "Forgotten password",
                "a": "Click on 'Forgotten password' on the login page. A reset link will be sent to you by email instantly."
            }
        },
        "tickets": {
            "title": "My requests",
            "new_btn": "New ticket",
            "subject_placeholder": "Subject",
            "message_placeholder": "Detail your request for faster processing...",
            "create_btn": "Create ticket",
            "send_btn": "Send ticket",
            "cancel_btn": "Cancel",
            "empty": "You have no active support ticket.",
            "opened_on": "Opened on {{date}}",
            "status": {
                "open": "IN PROGRESS",
                "resolved": "RESOLVED",
                "online": "Online Support",
                "resolved_msg": "Ticket resolved",
                "closed": "Closed"
            },
            "categories": {
                "technical": "Technical problem",
                "billing": "Question about fees",
                "cards": "Card management",
                "other": "Other"
            }
        },
        "chat": {
            "reply_placeholder": "Reply...",
            "input_placeholder": "Describe your problem or ask a question...",
            "send": "Send",
            "resolved_notice": "This ticket has been marked as resolved. If you have another question, please open a new ticket.",
            "starting": "Starting discussion...",
            "support_name": "INVIK Support"
        },
        "messages": {
            "success": "Ticket created successfully",
            "error": "Error during sending",
            "msg_error": "Error during message sending"
        }
    },
    "documents": {
        "title": "My Documents",
        "subtitle": "Download your bank identity statements and official certificates.",
        "sections": {
            "rib": "Bank Identity Statements (RIB)",
            "contracts": "Certificates & Contracts"
        },
        "rib": {
            "title": "RIB - {{name}}",
            "holder": "Account holder",
            "bank": "BANKING ESTABLISHMENT",
            "bank_code": "Bank Code",
            "branch_code": "Branch Code",
            "account_number": "Account number",
            "key": "RIB Key",
            "iban": "IBAN",
            "bic": "BIC (SWIFT)",
            "download_pdf": "Download PDF",
            "print": "Print",
            "share_msg": "Here is my RIB for account {{name}} (IBAN: {{iban}})",
            "not_defined": "Not defined"
        },
        "contract": {
            "title": "Opening Contract",
            "client_contract": "Client Contract",
            "signed_on": "Signed on {{date}}",
            "download": "DOWNLOAD PDF",
            "pdf_title": "PERSONAL ACCOUNT OPENING CONTRACT",
            "parties": "BETWEEN THE UNDERSIGNED:",
            "bank_party": "1. The banking establishment INVIK S.A., hereinafter referred to as 'The Bank'.",
            "client_party": "2. Mr./Ms. {{name}}, hereinafter referred to as 'The Client'.",
            "residing_at": "Residing at: {{address}}, {{zip}} {{city}}",
            "object_title": "OBJECT OF THE CONTRACT",
            "object_text": "The purpose of this contract is to define the general and special conditions for opening and operating accounts opened in the name of the Client in the books of INVIK S.A.",
            "terms_title": "TERMS OF USE",
            "terms_1": "- The Client has permanent access to their accounts via the secure digital interface.",
            "terms_2": "- The Bank undertakes to ensure the security of funds and the confidentiality of data in accordance with the GDPR.",
            "terms_3": "- The Client is responsible for maintaining the confidentiality of their banking access.",
            "terms_4": "- Transfer and payment operations are subject to limits defined in the fee conditions.",
            "duration_title": "DURATION AND TERMINATION",
            "duration_text": "This contract is concluded for an indefinite period. Each party can terminate it at any time subject to 30 days' notice, in accordance with applicable regulations.",
            "signatures_title": "SIGNATURES",
            "made_at": "Done in Luxembourg, on {{date}}",
            "client_sig": "Client Signature",
            "certified_sig": "(Certified digital signature)",
            "bank_sig": "For INVIK S.A."
        },
        "branding": {
            "tagline": "Premium Digital Bank",
            "legal_1": "This document is an official act generated by the digital services of INVIK S.A.",
            "legal_2": "INVIK S.A. - Luxembourg law S.A. - RCS Luxembourg B 138.554 - Capital 31,000,000 EUR",
            "legal_3": "Registered office: 51, Boulevard Grande-Duchesse Charlotte, L-1331 Luxembourg"
        },
        "messages": {
            "rib_success": "RIB successfully generated!",
            "rib_error": "Error during RIB generation",
            "contract_success": "Contract successfully generated!",
            "contract_error": "Error during contract generation",
            "iban_copied": "IBAN copied to clipboard!",
            "empty": "No document available.",
            "available": "Avail."
        }
    },
    "kyc": {
        "title": "Identity Verification (KYC)",
        "subtitle": "To secure your account, please send us a proof of identity and the required additional documents.",
        "status": {
            "submitted": "Your documents are already being reviewed.",
            "verified": "Your account is already verified.",
            "action_required": "Action required:",
            "rejection_msg": "Some documents must be resent."
        },
        "sections": {
            "required": "(MANDATORY)",
            "identity": "1. Proof of identity",
            "identity_sub": "Choose a first valid document (ID card, Passport, etc.)",
            "biometric": "2. Biometric verification",
            "biometric_sub": "Recent photos to confirm your identity.",
            "address": "3. Proof of address",
            "address_sub": "Official document dating from less than 3 months.",
            "income": "4. Proof of income",
            "income_sub": "According to your situation (Employee, Retired, etc.).",
            "bank": "5. Bank proof",
            "bank_sub": "Bank Identity Statement (RIB / IBAN).",
            "bank_notice": "The RIB must imperatively be in the name of the applicant (exclusive holder)."
        },
        "labels": {
            "type_doc": "Document type",
            "select_type": "Select document type",
            "front": "Front / Main page",
            "back": "Back (if applicable)",
            "load_front": "Load front",
            "load_back": "Load back",
            "load_doc": "Load document",
            "selfie": "Simple Selfie",
            "selfie_hint": "Without filter or glasses",
            "face_clear": "Clear face",
            "selfie_id": "Selfie with document",
            "selfie_id_hint": "Must be legible",
            "hold_id": "Hold your ID",
            "example": "See an example",
            "loaded": "Document loaded",
            "example_ref": "Reference for compliant sending",
            "back_btn": "Back",
            "submit_btn": "Submit my complete file",
            "sending": "Secure sending..."
        },
        "types": {
            "id": {
                "cni": "National Identity Card (CNI)",
                "passport": "Passport",
                "driver": "Driver's license",
                "residence": "Residence permit"
            },
            "address": {
                "utility": "Electricity / Gas / Water bill",
                "telecom": "Internet / Landline phone bill",
                "tax": "Tax notice",
                "insurance": "Home insurance certificate",
                "rent": "Rent receipt",
                "hosting": "Certificate of hosting + Host ID"
            },
            "income": {
                "payslip": "Last 3 pay slips",
                "contract": "Work contract",
                "tax": "Last tax notice",
                "kbis": "Kbis extract (Entrepreneur)",
                "pension": "Pension statement (Retired)",
                "unemployment": "Unemployment certificate",
                "statement": "Recent bank statement"
            }
        },
        "messages": {
            "file_too_large": "The file is too large (max 5MB)",
            "upload_error": "Upload error",
            "select_id_type": "Please select an identity document type.",
            "missing_files": "Please provide all mandatory proof.",
            "success": "Complete KYC file successfully submitted!",
            "error": "An error occurred during sending: "
        },
        "legal": "The documents provided are used exclusively for identity verification (KYC), fraud prevention and regulatory compliance purposes. They are processed securely and confidentially in accordance with the GDPR."
    },
    "header": {
        "search_placeholder": "Search a transaction...",
        "profile_title": "Account settings"
    },
    "banner": {
        "loading": "Loading verification...",
        "toasts": {
            "verified": "Your identity is verified. You have access to all features.",
            "submitted": "Your documents are being analyzed. You will be notified as soon as verification is complete."
        },
        "status": {
            "verified": "Verified Account",
            "submitted": "In progress...",
            "rejected": "Rejected (Details)",
            "verify_now": "Verify Identity",
            "click_to_verify": "Click to verify"
        },
        "blocking": {
            "refused": "Validation Refused",
            "in_progress": "Verification in progress",
            "required": "Verification Required",
            "motif": "Reason:",
            "not_compliant": "Some documents are not compliant. Please resubmit them.",
            "analyzing": "We are analyzing your documents. This procedure generally takes less than 24 hours.",
            "restricted": "For security and compliance reasons, access to this feature is restricted. Please complete your identity verification to unlock your account.",
            "waiting": "Waiting for validation",
            "start": "Start verification",
            "secure": "Encrypted & Secure Data"
        },
        "legacy": {
            "action_required": "Action required on your KYC",
            "identity_required": "Identity verification required",
            "not_validated": "Your file could not be validated as is.",
            "complete_kyc": "To access all your account features, please complete your KYC verification.",
            "fix_file": "Correct my file",
            "verify_identity": "Verify my identity"
        }
    }
}

update_json_utf8('C:/Users/tesla/Videos/Nouvelle aventure/BanK/client/public/locales/en/translation.json', en_updates)
