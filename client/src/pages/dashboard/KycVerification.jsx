import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { kycService } from '../../services/kycService';

// --- Sub-components extracted to prevent re-mounting on every render ---

const Section = ({ title, icon, subtitle, children, required = true }) => (
    <section style={styles.section}>
        <div style={styles.sectionHeader}>
            <div style={styles.sectionIcon}>
                <i className={icon}></i>
            </div>
            <div>
                <h2 style={styles.sectionTitle}>
                    {title} {required && <span style={styles.requiredBadge}>(OBLIGATOIRE)</span>}
                </h2>
                <p style={styles.sectionSubtitle}>{subtitle}</p>
            </div>
        </div>
        <div style={styles.sectionContent}>
            {children}
        </div>
    </section>
);

const TypeSelector = ({ id, options, label, value, onChange, disabled }) => (
    <div style={styles.selectorGroup}>
        <label style={styles.selectorLabel}>{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(id, e.target.value)}
            style={styles.select}
            disabled={disabled}
        >
            <option value="">Sélectionner le type de document</option>
            {options.map(opt => (
                <option
                    key={opt.value}
                    value={opt.value}
                    disabled={id === 'id2' && opt.value === options.find(o => o.value === value)?.value}
                >
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

const UploadBox = ({ label, id, icon, description, hint, preview, uploading, onFileChange, guideImage, onViewGuide }) => {
    const isImage = preview && preview.startsWith('data:image');

    return (
        <div style={styles.uploadCard}>
            <div style={styles.cardHeaderSmall}>
                <h3 style={styles.cardLabel}>{label}</h3>
                {hint && <span style={styles.cardHint}>{hint}</span>}
            </div>
            <div style={styles.dropZone}>
                {preview ? (
                    isImage ? (
                        <img src={preview} alt={label} style={styles.preview} />
                    ) : (
                        <div style={styles.filePreview}>
                            <i className="fas fa-file-pdf" style={{ fontSize: '2.5rem', color: '#ef4444' }}></i>
                            <span style={{ fontSize: '0.75rem', marginTop: '8px', color: '#64748b' }}>Document chargé</span>
                        </div>
                    )
                ) : (
                    <div style={styles.placeholder}>
                        <i className={icon} style={styles.icon}></i>
                        <span style={styles.placeholderText}>{description}</span>
                    </div>
                )}
                <input
                    type="file"
                    onChange={(e) => onFileChange(e, id)}
                    style={styles.fileInput}
                    disabled={uploading}
                />
            </div>
            {guideImage && (
                <button
                    type="button"
                    onClick={() => onViewGuide(guideImage)}
                    style={styles.guideBtn}
                >
                    <i className="fas fa-eye"></i> Voir un exemple
                </button>
            )}
        </div>
    );
};

const ImageModal = ({ url, onClose }) => {
    if (!url) return null;
    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button style={styles.closeBtn} onClick={onClose}>×</button>
                <img src={url} alt="Exemple KYC" style={styles.modalImage} />
                <p style={styles.modalCaption}>Référence pour un envoi conforme</p>
            </div>
        </div>
    );
};

const KycVerification = () => {
    const { currentUser } = useAuth();
    const { kycStatus } = useData();
    const { showToast } = useNotifications();
    const navigate = useNavigate();

    const [docTypes, setDocTypes] = useState({
        id1: '',
        id2: '',
        address: '',
        income: ''
    });

    const [files, setFiles] = useState({
        id1Front: null,
        id1Back: null,
        id2Front: null,
        id2Back: null,
        selfie: null,
        selfieWithId: null,
        addressProof: null,
        incomeProof: null,
        rib: null
    });

    const [previews, setPreviews] = useState({
        id1Front: null,
        id1Back: null,
        id2Front: null,
        id2Back: null,
        selfie: null,
        selfieWithId: null,
        addressProof: null,
        incomeProof: null,
        rib: null
    });

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [selectedGuide, setSelectedGuide] = useState(null);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    useEffect(() => {
        if (kycStatus?.status === 'submitted') {
            showToast("Vos documents sont déjà en cours d'examen.", "info");
            navigate('/dashboard');
        } else if (kycStatus?.status === 'verified') {
            showToast("Votre compte est déjà vérifié.", "success");
            navigate('/dashboard');
        }
    }, [kycStatus?.status, navigate, showToast]);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showToast("Le fichier est trop volumineux (max 5Mo)", "error");
                return;
            }
            setFiles(prev => ({ ...prev, [type]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTypeChange = (id, value) => {
        setDocTypes(prev => ({ ...prev, [id]: value }));
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        try {
            // Use 'auto' instead of 'image' to allow proper handling of PDF and other formats
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.secure_url) {
                return data.secure_url;
            } else {
                throw new Error(data.error?.message || "Erreur d'upload");
            }
        } catch (error) {
            console.error("Cloudinary Error:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!docTypes.id1 || !docTypes.id2 || docTypes.id1 === docTypes.id2) {
            showToast("Veuillez sélectionner deux types de documents d'identité différents.", "warning");
            return;
        }

        const requiredFiles = ['id1Front', 'id2Front', 'selfie', 'selfieWithId', 'addressProof', 'incomeProof'];
        const missingFiles = requiredFiles.filter(key => !files[key]);
        const missingTypes = ['address', 'income'].filter(key => !docTypes[key]);

        if (missingFiles.length > 0 || missingTypes.length > 0) {
            showToast("Veuillez fournir tous les justificatifs obligatoires.", "warning");
            return;
        }

        setUploading(true);
        setProgress(5);

        try {
            const urls = {};
            const keys = Object.keys(files).filter(k => files[k]);
            const step = 90 / keys.length;

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                urls[key] = await uploadToCloudinary(files[key]);
                setProgress(Math.round(5 + (i + 1) * step));
            }

            await kycService.submitKycDocuments(currentUser.uid, {
                ...urls,
                documentTypes: docTypes
            });

            setProgress(100);
            showToast("Dossier KYC complet soumis avec succès !", "success");
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            showToast("Une erreur est survenue lors de l'envoi : " + error.message, "error");
        } finally {
            setUploading(false);
        }
    };

    const idOptions = [
        { value: 'cni', label: 'Carte Nationale d\'Identité (CNI)' },
        { value: 'passport', label: 'Passeport' },
        { value: 'driver_license', label: 'Permis de conduire' },
        { value: 'residence_permit', label: 'Titre de séjour' }
    ];

    const addressOptions = [
        { value: 'utility_bill', label: 'Facture d\'électricité / Gaz / Eau' },
        { value: 'telecom_bill', label: 'Facture Internet / Téléphone fixe' },
        { value: 'tax_notice', label: 'Avis d\'imposition' },
        { value: 'insurance_home', label: 'Attestation d\'assurance habitation' },
        { value: 'rent_receipt', label: 'Quittance de loyer' },
        { value: 'hosting_cert', label: 'Attestation d\'hébergement + ID hébergeant' }
    ];

    const incomeOptions = [
        { value: 'payslip', label: '3 derniers bulletins de salaire' },
        { value: 'work_contract', label: 'Contrat de travail' },
        { value: 'tax_notice_income', label: 'Dernier avis d\'imposition' },
        { value: 'kbis', label: 'Extrait Kbis (Entrepreneur)' },
        { value: 'pension', label: 'Relevé de pension (Retraité)' },
        { value: 'pole_emploi', label: 'Attestation Pôle Emploi' },
        { value: 'bank_statement', label: 'Relevé bancaire récent' }
    ];

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Vérification d'identité (KYC)</h1>
                <p style={styles.subtitle}>
                    Pour sécuriser votre compte, veuillez nous transmettre deux justificatifs d'identité différents
                    et les documents complémentaires requis.
                </p>
                {kycStatus?.status === 'unverified' && (
                    <div style={styles.rejectionNotice}>
                        <i className="fas fa-exclamation-circle" style={{ marginRight: '10px' }}></i>
                        <div style={{ flex: 1 }}>
                            <strong>Action requise :</strong> {kycStatus.reviewNotes || "Certains documents doivent être renvoyés."}
                        </div>
                    </div>
                )}
            </header>

            <form onSubmit={handleSubmit} style={styles.form}>
                <Section
                    title="1. Premier justificatif d’identité"
                    icon="fas fa-id-card"
                    subtitle="Choisissez un premier document valide (CNI, Passeport, etc.)"
                >
                    <TypeSelector
                        id="id1"
                        label="Type du premier document"
                        options={idOptions}
                        value={docTypes.id1}
                        onChange={handleTypeChange}
                        disabled={uploading}
                    />
                    {docTypes.id1 && (
                        <div style={styles.grid}>
                            <UploadBox
                                id="id1Front"
                                label="Recto / Page principale"
                                icon="fas fa-id-card"
                                description="Charger le recto"
                                preview={previews.id1Front}
                                uploading={uploading}
                                onFileChange={handleFileChange}
                                guideImage="/kyc  (2).jpeg"
                                onViewGuide={setSelectedGuide}
                            />
                            {docTypes.id1 !== 'passport' && (
                                <UploadBox
                                    id="id1Back"
                                    label="Verso (si applicable)"
                                    icon="fas fa-id-card"
                                    description="Charger le verso"
                                    preview={previews.id1Back}
                                    uploading={uploading}
                                    onFileChange={handleFileChange}
                                />
                            )}
                        </div>
                    )}
                </Section>

                <Section
                    title="2. Second justificatif d’identité"
                    icon="fas fa-passport"
                    subtitle="Un document différent du premier est requis."
                >
                    <TypeSelector
                        id="id2"
                        label="Type du second document"
                        options={idOptions}
                        value={docTypes.id2}
                        onChange={handleTypeChange}
                        disabled={uploading}
                    />
                    {docTypes.id2 && (
                        <div style={styles.grid}>
                            <UploadBox
                                id="id2Front"
                                label="Recto / Page principale"
                                icon="fas fa-id-card"
                                description="Charger le recto"
                                preview={previews.id2Front}
                                uploading={uploading}
                                onFileChange={handleFileChange}
                                guideImage="/kyc  (2).jpeg"
                                onViewGuide={setSelectedGuide}
                            />
                            {docTypes.id2 !== 'passport' && (
                                <UploadBox
                                    id="id2Back"
                                    label="Verso (si applicable)"
                                    icon="fas fa-id-card"
                                    description="Charger le verso"
                                    preview={previews.id2Back}
                                    uploading={uploading}
                                    onFileChange={handleFileChange}
                                />
                            )}
                        </div>
                    )}
                </Section>

                <Section
                    title="3. Vérification biométrique"
                    icon="fas fa-user-shield"
                    subtitle="Photos récentes pour confirmer votre identité."
                >
                    <div style={styles.grid}>
                        <UploadBox
                            id="selfie"
                            label="Selfie Simple"
                            icon="fas fa-camera"
                            description="Visage dégagé"
                            hint="Sans filtre ni lunettes"
                            preview={previews.selfie}
                            uploading={uploading}
                            onFileChange={handleFileChange}
                        />
                        <UploadBox
                            id="selfieWithId"
                            label="Selfie avec document"
                            icon="fas fa-portrait"
                            description="Tenez votre pièce d'identité"
                            hint="Doit être lisible"
                            preview={previews.selfieWithId}
                            uploading={uploading}
                            onFileChange={handleFileChange}
                            guideImage="/kyc  (4).jpeg"
                            onViewGuide={setSelectedGuide}
                        />
                    </div>
                </Section>

                <Section
                    title="4. Justificatif de domicile"
                    icon="fas fa-home"
                    subtitle="Document officiel datant de moins de 3 mois."
                >
                    <TypeSelector
                        id="address"
                        label="Type de justificatif"
                        options={addressOptions}
                        value={docTypes.address}
                        onChange={handleTypeChange}
                        disabled={uploading}
                    />
                    {docTypes.address && (
                        <UploadBox
                            id="addressProof"
                            label="Justificatif de domicile"
                            icon="fas fa-file-invoice"
                            description="Charger le document"
                            preview={previews.addressProof}
                            uploading={uploading}
                            onFileChange={handleFileChange}
                        />
                    )}
                </Section>

                <Section
                    title="5. Justificatifs de revenus"
                    icon="fas fa-briefcase"
                    subtitle="Selon votre situation (Salarié, Retraité, etc.)."
                >
                    <TypeSelector
                        id="income"
                        label="Nature du revenu"
                        options={incomeOptions}
                        value={docTypes.income}
                        onChange={handleTypeChange}
                        disabled={uploading}
                    />
                    {docTypes.income && (
                        <UploadBox
                            id="incomeProof"
                            label="Justificatif de revenus"
                            icon="fas fa-file-signature"
                            description="Charger le document"
                            preview={previews.incomeProof}
                            uploading={uploading}
                            onFileChange={handleFileChange}
                        />
                    )}
                </Section>

                <Section
                    title="6. Justificatif bancaire"
                    icon="fas fa-university"
                    subtitle="Relevé d'Identité Bancaire (RIB / IBAN)."
                    required={false}
                >
                    <div style={styles.noticeBox}>
                        <i className="fas fa-info-circle"></i>
                        <p>Le RIB doit impérativement être au nom du demandeur (<strong>titulaire exclusif</strong>).</p>
                    </div>
                    <UploadBox
                        id="rib"
                        label="RIB / IBAN"
                        icon="fas fa-university"
                        description="Charger votre RIB"
                        preview={previews.rib}
                        uploading={uploading}
                        onFileChange={handleFileChange}
                    />
                </Section>

                {uploading && (
                    <div style={styles.progressContainer}>
                        <div style={styles.progressLabel}>Sécurisation et envoi... {progress}%</div>
                        <div style={styles.progressBar}>
                            <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}

                <div style={styles.footer}>
                    <div style={styles.legalBox}>
                        <i className="fas fa-shield-alt" style={{ color: '#0ea5e9', fontSize: '1.2rem' }}></i>
                        <p style={styles.legalText}>
                            Les documents fournis sont utilisés exclusivement à des fins de vérification d’identité (KYC), de lutte contre la fraude et de conformité réglementaire.
                            Ils sont traités de manière sécurisée et confidentielle conformément au RGPD.
                        </p>
                    </div>

                    <div style={styles.btnGroup}>
                        <button
                            type="submit"
                            style={{ ...styles.submitBtn, opacity: uploading ? 0.7 : 1 }}
                            disabled={uploading}
                        >
                            {uploading ? "Envoi sécurisé..." : "Soumettre mon dossier complet"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            style={styles.cancelBtn}
                            disabled={uploading}
                        >
                            Retour
                        </button>
                    </div>
                </div>
            </form>

            <ImageModal url={selectedGuide} onClose={() => setSelectedGuide(null)} />
        </div>
    );
};

const styles = {
    container: { maxWidth: '900px', margin: '0 auto', padding: '0.5rem 1rem' },
    header: { textAlign: 'center', marginBottom: '2rem', paddingTop: '0.5rem' },
    title: { fontSize: '1.8rem', color: '#003366', fontWeight: '900', marginBottom: '0.6rem', letterSpacing: '-0.5px' },
    subtitle: { color: '#64748b', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' },
    rejectionNotice: {
        marginTop: '1.5rem',
        padding: '1rem',
        background: '#fff3f3',
        border: '1px solid #ffcccc',
        borderRadius: '16px',
        color: '#d32f2f',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textAlign: 'left'
    },
    section: {
        background: 'white',
        borderRadius: '24px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
    },
    sectionHeader: { display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' },
    sectionIcon: { width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 51, 102, 0.05)', color: '#003366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 },
    sectionTitle: { fontSize: '1.1rem', color: '#1e293b', fontWeight: '800', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' },
    requiredBadge: { fontSize: '0.65rem', color: '#ef4444', background: '#fef2f2', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' },
    sectionSubtitle: { fontSize: '0.85rem', color: '#64748b', margin: 0 },
    selectorGroup: { marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    selectorLabel: { fontSize: '0.85rem', fontWeight: '700', color: '#334155' },
    select: { padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' },
    uploadCard: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
    cardHeaderSmall: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cardLabel: { fontSize: '0.8rem', color: '#475569', fontWeight: '700', margin: 0 },
    cardHint: { fontSize: '0.7rem', color: '#94a3b8', fontWeight: '500' },
    dropZone: { height: '160px', border: '2px dashed #e2e8f0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', background: '#fcfcfc', overflow: 'hidden' },
    fileInput: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' },
    placeholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: '#94a3b8', textAlign: 'center' },
    icon: { fontSize: '1.8rem' },
    placeholderText: { fontSize: '0.75rem', fontWeight: '500' },
    preview: { width: '100%', height: '100%', objectFit: 'cover' },
    filePreview: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#f8fafc' },
    guideBtn: {
        marginTop: '0.5rem',
        padding: '0.6rem 1rem',
        background: '#f1f5f9',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        color: '#003366',
        fontSize: '0.8rem',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s ease'
    },
    noticeBox: { display: 'flex', gap: '10px', alignItems: 'center', background: '#ecfdf5', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #d1fae5', color: '#065f46', fontSize: '0.85rem' },
    progressContainer: { marginBottom: '2rem' },
    progressLabel: { fontSize: '0.85rem', color: '#003366', marginBottom: '0.5rem', textAlign: 'center', fontWeight: '800' },
    progressBar: { height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' },
    progressFill: { height: '100%', background: 'linear-gradient(90deg, #003366, #3b82f6)' },
    footer: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9' },
    legalBox: { display: 'flex', gap: '1rem', alignItems: 'flex-start', background: '#f8fafc', padding: '1.25rem', borderRadius: '18px', maxWidth: '650px', textAlign: 'left', border: '1px solid #e2e8f0' },
    legalText: { fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: '1.6' },
    btnGroup: { width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' },
    submitBtn: { padding: '1.2rem', background: '#003366', color: 'white', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: '900', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0, 51, 102, 0.2)' },
    cancelBtn: { background: 'none', border: 'none', color: '#94a3b8', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' },

    // Modal Styles
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
    },
    modalContent: {
        position: 'relative',
        background: 'white',
        padding: '1rem',
        borderRadius: '24px',
        maxWidth: '95%',
        maxHeight: '90vh',
        width: 'auto',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
    },
    closeBtn: {
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'white',
        border: 'none',
        fontSize: '24px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1001
    },
    modalImage: {
        maxWidth: '100%',
        maxHeight: '75vh',
        borderRadius: '12px',
        objectFit: 'contain'
    },
    modalCaption: {
        marginTop: '1rem',
        color: '#64748b',
        fontSize: '0.9rem',
        fontWeight: '600'
    }
};

export default KycVerification;
