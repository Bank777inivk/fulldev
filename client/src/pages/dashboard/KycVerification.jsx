import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { kycService } from '../../services/kycService';

const KycVerification = () => {
    const { currentUser } = useAuth();
    const { kycStatus } = useData();
    const { showToast } = useNotifications();
    const navigate = useNavigate();

    const [files, setFiles] = useState({
        idCardFront: null,
        idCardBack: null,
        selfie: null
    });

    const [previews, setPreviews] = useState({
        idCardFront: null,
        idCardBack: null,
        selfie: null
    });

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

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

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
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
        if (!files.idCardFront || !files.idCardBack || !files.selfie) {
            showToast("Veuillez fournir tous les documents requis.", "warning");
            return;
        }

        setUploading(true);
        setProgress(10);

        try {
            // Upload images to Cloudinary
            setProgress(30);
            const idCardFrontUrl = await uploadToCloudinary(files.idCardFront);
            setProgress(50);
            const idCardBackUrl = await uploadToCloudinary(files.idCardBack);
            setProgress(70);
            const selfieUrl = await uploadToCloudinary(files.selfie);
            setProgress(90);

            // Save to Firestore
            await kycService.submitKycDocuments(currentUser.uid, {
                idCardFront: idCardFrontUrl,
                idCardBack: idCardBackUrl,
                selfie: selfieUrl
            });

            setProgress(100);
            showToast("Documents soumis avec succès !", "success");
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            showToast("Une erreur est survenue lors de l'envoi : " + error.message, "error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Vérification d'identité (KYC)</h1>
                <p style={styles.subtitle}>
                    Pour sécuriser votre compte et débloquer toutes les fonctionnalités,
                    veuillez nous transmettre vos pièces justificatives.
                </p>
                {kycStatus?.status === 'unverified' && (
                    <div style={styles.rejectionNotice}>
                        <i className="fas fa-exclamation-triangle" style={{ marginRight: '10px' }}></i>
                        <strong>Demande précédente rejetée :</strong> {kycStatus.reviewNotes || "Certains documents n'ont pas été validés."}
                    </div>
                )}
            </header>

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.grid}>
                    {/* ID Front */}
                    <div style={styles.uploadCard}>
                        <h3 style={styles.cardTitle}>Recto de la pièce d'identité</h3>
                        <div style={styles.dropZone}>
                            {previews.idCardFront ? (
                                <img src={previews.idCardFront} alt="Recto" style={styles.preview} />
                            ) : (
                                <div style={styles.placeholder}>
                                    <i className="fas fa-id-card" style={styles.icon}></i>
                                    <span>Cliquez pour choisir le recto</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'idCardFront')}
                                style={styles.fileInput}
                                disabled={uploading}
                            />
                        </div>
                    </div>

                    {/* ID Back */}
                    <div style={styles.uploadCard}>
                        <h3 style={styles.cardTitle}>Verso de la pièce d'identité</h3>
                        <div style={styles.dropZone}>
                            {previews.idCardBack ? (
                                <img src={previews.idCardBack} alt="Verso" style={styles.preview} />
                            ) : (
                                <div style={styles.placeholder}>
                                    <i className="fas fa-id-card" style={styles.icon}></i>
                                    <span>Cliquez pour choisir le verso</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'idCardBack')}
                                style={styles.fileInput}
                                disabled={uploading}
                            />
                        </div>
                    </div>

                    {/* Selfie */}
                    <div style={styles.uploadCard}>
                        <h3 style={styles.cardTitle}>Selfie avec la pièce d'identité</h3>
                        <div style={styles.dropZone}>
                            {previews.selfie ? (
                                <img src={previews.selfie} alt="Selfie" style={styles.preview} />
                            ) : (
                                <div style={styles.placeholder}>
                                    <i className="fas fa-camera-retro" style={styles.icon}></i>
                                    <span>Cliquez pour choisir un selfie</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'selfie')}
                                style={styles.fileInput}
                                disabled={uploading}
                            />
                        </div>
                    </div>
                </div>

                {uploading && (
                    <div style={styles.progressContainer}>
                        <div style={styles.progressLabel}>Envoi en cours... {progress}%</div>
                        <div style={styles.progressBar}>
                            <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}

                <div style={styles.footer}>
                    <p style={styles.disclaimer}>
                        <i className="fas fa-lock"></i> Vos données sont chiffrées et traitées uniquement à des fins de vérification.
                    </p>
                    <button
                        type="submit"
                        style={{ ...styles.submitBtn, opacity: uploading ? 0.7 : 1 }}
                        disabled={uploading}
                    >
                        {uploading ? "Envoi en cours..." : "Soumettre mon dossier"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        style={styles.cancelBtn}
                        disabled={uploading}
                    >
                        Plus tard
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' },
    header: { textAlign: 'center', marginBottom: '3rem' },
    title: { fontSize: '2.2rem', color: '#003366', fontWeight: '800', marginBottom: '0.8rem' },
    subtitle: { color: '#64748b', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' },
    uploadCard: { background: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eef2f6' },
    cardTitle: { fontSize: '1rem', color: '#334155', fontWeight: '700', marginBottom: '1rem', textAlign: 'center' },
    dropZone: {
        height: '220px',
        border: '2px dashed #cbd5e1',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
        ':hover': { borderColor: '#003366', background: '#f8fbff' }
    },
    fileInput: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' },
    placeholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#94a3b8' },
    icon: { fontSize: '2.5rem' },
    preview: { width: '100%', height: '100%', objectFit: 'cover' },
    progressContainer: { marginBottom: '2rem', padding: '0 1rem' },
    progressLabel: { fontSize: '0.9rem', color: '#64748b', marginBottom: '0.8rem', textAlign: 'center', fontWeight: '600' },
    progressBar: { height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' },
    progressFill: { height: '100%', background: '#003366', transition: 'width 0.3s ease-out' },
    footer: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' },
    disclaimer: { fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' },
    submitBtn: { padding: '1.2rem 3rem', background: '#003366', color: 'white', border: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 15px 30px rgba(0, 51, 102, 0.3)', transition: 'transform 0.2s', width: '100%', maxWidth: '400px' },
    cancelBtn: { background: 'none', border: 'none', color: '#64748b', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' },
    rejectionNotice: {
        marginTop: '2rem',
        padding: '1rem 1.5rem',
        background: '#fff5f5',
        border: '1px solid #feb2b2',
        borderRadius: '12px',
        color: '#c53030',
        fontSize: '0.95rem',
        display: 'inline-block',
        maxWidth: '100%',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    }
};

export default KycVerification;
