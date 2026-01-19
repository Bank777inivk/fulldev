import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { walletService } from '../../services/walletService';
import { transactionService } from '../../services/transactionService';
import { useNavigate } from 'react-router-dom';
import { beneficiaryService } from '../../services/beneficiaryService';
import KycVerificationBanner from '../../components/dashboard/KycVerificationBanner';

const Transfers = () => {
    const { currentUser } = useAuth();
    const { wallets, transactions, beneficiaries, loading } = useData();
    const { showToast } = useNotifications();

    // Filter wallets for display, consistent with Accounts.jsx
    const displayWallets = React.useMemo(() => {
        if (!wallets) return [];

        // Group by type
        const uniqueWallets = [];
        const seenTypes = new Set();

        // Prioritize: NO SORT. Sync with Dashboard and Accounts.jsx.
        // We accept the first wallet found as the 'true' one.
        const sortedWallets = wallets;

        for (const w of sortedWallets) {
            if (['main', 'savings', 'credit'].includes(w.type)) {
                if (!seenTypes.has(w.type)) {
                    uniqueWallets.push(w);
                    seenTypes.add(w.type);
                }
            } else {
                uniqueWallets.push(w);
            }
        }
        return uniqueWallets;
    }, [wallets]);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [activeTab, setActiveTab] = useState('internal');
    const [step, setStep] = useState(1);

    // Form States
    const [amount, setAmount] = useState('');
    const [fromAccount, setFromAccount] = useState('');
    const [toAccount, setToAccount] = useState('');

    // External Transfer States
    const [beneficiaryType, setBeneficiaryType] = useState('saved');
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState('');
    const [beneficiaryName, setBeneficiaryName] = useState('');
    const [beneficiaryIban, setBeneficiaryIban] = useState('');
    const [beneficiaryBic, setBeneficiaryBic] = useState('');
    const [beneficiaryEmail, setBeneficiaryEmail] = useState('');
    const [saveBeneficiary, setSaveBeneficiary] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // IBAN Validation
    const validateIban = (iban) => {
        if (!iban) return false;
        const cleanIban = iban.replace(/\s/g, '').toUpperCase();
        // Basic IBAN format: 2 letters + 2 digits + up to 30 alphanumeric
        const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
        return ibanRegex.test(cleanIban);
    };

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [historyPage, setHistoryPage] = useState(1);

    // Initialize source/destination accounts
    // Initialize source/destination accounts
    useEffect(() => {
        if (!loading && displayWallets.length > 0) {
            if (!fromAccount) setFromAccount(displayWallets[0].id);
            if (!toAccount && displayWallets.length > 1) {
                const other = displayWallets.find(w => w.id !== (fromAccount || displayWallets[0].id));
                if (other) setToAccount(other.id);
            }
        }
    }, [displayWallets, loading, fromAccount, toAccount]);

    const transferHistory = transactions.filter(tx => tx.type === 'transfer_internal' || tx.type === 'transfer_external');

    const isInvikTarget = activeTab === 'internal' || activeTab === 'instant' ||
        (activeTab === 'external' && (
            beneficiaryType === 'saved'
                ? transactionService.isInvikIban(beneficiaries.find(b => b.id === selectedBeneficiaryId)?.iban)
                : transactionService.isInvikIban(beneficiaryIban)
        ));

    const handleSubmit = async () => {
        const numAmount = parseFloat(amount);
        const fromWallet = getWallet(fromAccount);

        if (!numAmount || numAmount <= 0) {
            showToast("Veuillez saisir un montant valide", "error");
            return;
        }

        if (fromWallet && numAmount > fromWallet.balance) {
            showToast("Solde insuffisant pour cette opération", "error");
            return;
        }

        if (numAmount > 50000) {
            showToast("Le montant maximal par virement est de 50 000 €", "error");
            return;
        }

        setSubmitting(true);
        try {
            if (activeTab === 'internal') {
                await transactionService.performInternalTransfer(currentUser.uid, fromAccount, toAccount, amount);
                setSuccess("Transfert interne réussi ! Votre solde a été mis à jour instantanément.");
            } else if (activeTab === 'instant') {
                const finalName = beneficiaryType === 'saved' ? beneficiaries.find(b => b.id === selectedBeneficiaryId)?.name : beneficiaryName;
                const finalIban = beneficiaryType === 'saved' ? beneficiaries.find(b => b.id === selectedBeneficiaryId)?.iban : beneficiaryIban;

                if (!finalName || !finalIban) throw new Error("Veuillez vérifier les informations du bénéficiaire");
                if (!transactionService.isInvikIban(finalIban)) throw new Error("Cet IBAN n'appartient pas au réseau INVIK. Utilisez l'onglet 'Virement SEPA'.");

                await transactionService.performInstantTransfer(currentUser.uid, fromAccount, finalIban, finalName, amount);
                setSuccess(`Virement instantané vers ${finalName} réussi ! Les fonds ont été transférés immédiatement via le réseau INVIK.`);
            } else {
                const finalName = beneficiaryType === 'saved' ? beneficiaries.find(b => b.id === selectedBeneficiaryId)?.name : beneficiaryName;
                const finalIban = beneficiaryType === 'saved' ? beneficiaries.find(b => b.id === selectedBeneficiaryId)?.iban : beneficiaryIban;

                if (!finalName || !finalIban) throw new Error("Veuillez vérifier les informations du bénéficiaire");

                if (transactionService.isInvikIban(finalIban)) {
                    // Fail-safe: even in external tab, if it's invik, do it instant
                    await transactionService.performInstantTransfer(currentUser.uid, fromAccount, finalIban, finalName, amount);
                    setSuccess(`Virement instantané vers ${finalName} réussi ! Les fonds ont été transférés immédiatement.`);
                } else {
                    // Validate IBAN before submission
                    if (!validateIban(finalIban)) {
                        throw new Error("Format IBAN invalide. Veuillez vérifier le numéro saisi.");
                    }

                    // Standard External Transfer
                    await transactionService.requestExternalTransfer(currentUser.uid, fromAccount, finalName, finalIban, amount);
                    if (beneficiaryType === 'new' && saveBeneficiary) {
                        await beneficiaryService.addBeneficiary(currentUser.uid, {
                            name: finalName,
                            iban: finalIban,
                            bic: beneficiaryBic || '',
                            email: beneficiaryEmail || ''
                        });
                    }
                    setSuccess("Virement mis en attente pour contrôle de sécurité. Délai habituel SEPA : 24h à 48h.");
                }
            }
        } catch (err) {
            showToast(err.message, "error");
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'internal' && fromAccount && wallets.length > 0) {
            if (!toAccount || fromAccount === toAccount) {
                const other = wallets.find(w => w.id !== fromAccount);
                if (other) setToAccount(other.id);
                else setToAccount('');
            }
        }
    }, [fromAccount, wallets, activeTab, toAccount]);

    const getWallet = (id) => wallets.find(w => w.id === id);

    const AccountCard = ({ wallet, selected, onClick, type = 'source', compact = false }) => {
        if (!wallet) return null;
        const isSelected = selected === wallet.id;
        const bgColor = type === 'source' ? '#fff' : (isSelected ? '#f0f8ff' : '#fff');
        const borderColor = isSelected ? '#003366' : '#eef2f6';
        return (
            <div onClick={() => onClick(wallet.id)} style={{
                padding: compact ? '0.8rem' : '1rem',
                borderRadius: '12px',
                border: `2px solid ${borderColor}`,
                backgroundColor: bgColor,
                cursor: 'pointer',
                marginBottom: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.2s ease'
            }}>
                <div style={{
                    minWidth: compact ? '35px' : '40px', width: compact ? '35px' : '40px', height: compact ? '35px' : '40px',
                    borderRadius: '50%', backgroundColor: wallet.type === 'main' ? '#e3f2fd' : '#e8f5e9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: wallet.type === 'main' ? '#1565c0' : '#2e7d32'
                }}>
                    <i className={`fas ${wallet.type === 'main' ? 'fa-wallet' : 'fa-piggy-bank'}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#333', fontSize: compact ? '0.9rem' : '1rem' }}>{wallet.type === 'main' ? 'Compte Courant' : wallet.type === 'savings' ? 'Compte Épargne' : 'Crédit'}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{wallet.balance.toLocaleString('fr-FR', { style: 'currency', currency: wallet.currency })}</div>
                </div>
                {isSelected && <i className="fas fa-check-circle" style={{ color: '#003366', fontSize: '1.2rem' }}></i>}
            </div>
        );
    };

    if (loading && wallets.length === 0) return <div style={{ textAlign: 'center', padding: '4rem' }}>Chargement...</div>;

    // --- MOBILE LAYOUT ---
    // Pagination Logic for History
    const historyItemsPerPage = 5;
    const totalHistoryPages = Math.ceil(transferHistory.length / historyItemsPerPage);
    const paginatedHistory = transferHistory.slice((historyPage - 1) * historyItemsPerPage, historyPage * historyItemsPerPage);

    const PaginationControls = () => {
        if (totalHistoryPages <= 1) return null;
        return (
            <div style={isMobile ? styles.mobilePagination : styles.desktopPagination}>
                <button
                    disabled={historyPage === 1}
                    onClick={() => setHistoryPage(p => p - 1)}
                    style={historyPage === 1 ? styles.pageBtnDisabled : styles.pageBtn}
                >
                    <i className="fas fa-chevron-left"></i>
                </button>
                <div style={styles.pageIndicator}>Page {historyPage} sur {totalHistoryPages}</div>
                <button
                    disabled={historyPage === totalHistoryPages}
                    onClick={() => setHistoryPage(p => p + 1)}
                    style={historyPage === totalHistoryPages ? styles.pageBtnDisabled : styles.pageBtn}
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        );
    };

    if (isMobile) {
        return (
            <KycVerificationBanner>
                <div style={{ padding: '1rem', paddingBottom: '80px' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#003366', marginBottom: '1.5rem' }}>Nouveau Virement</h1>

                    {/* Mobile Tabs */}
                    <div style={styles.mobileTabs}>
                        <button
                            style={activeTab === 'internal' ? styles.mobileTabActive : styles.mobileTab}
                            onClick={() => { setActiveTab('internal'); setStep(1); }}
                        >
                            Interne
                        </button>
                        <button
                            style={activeTab === 'instant' ? { ...styles.mobileTabActive, borderBottom: '3px solid #27ae60', color: '#27ae60' } : styles.mobileTab}
                            onClick={() => { setActiveTab('instant'); setStep(1); }}
                        >
                            <i className="fas fa-bolt" style={{ marginRight: '4px' }}></i> INVIK
                        </button>
                        <button
                            style={activeTab === 'external' ? styles.mobileTabActive : styles.mobileTab}
                            onClick={() => { setActiveTab('external'); setStep(1); }}
                        >
                            SEPA
                        </button>
                        <button
                            style={activeTab === 'history' ? styles.mobileTabActive : styles.mobileTab}
                            onClick={() => { setActiveTab('history'); setStep(1); }}
                        >
                            Suivi
                        </button>
                    </div>

                    {success ? (
                        <div style={styles.successState} className="fadeIn">
                            <div style={styles.successIcon}><i className={`fas ${activeTab === 'internal' ? 'fa-check' : 'fa-circle-notch fa-spin'}`}></i></div>
                            <h2 style={{ fontSize: '1.2rem', textAlign: 'center' }}>{activeTab === 'internal' ? 'Virement effectué !' : 'INFORMATION CAPITALE DE INVIK BANK'}</h2>
                            <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem', fontSize: '0.85rem', lineHeight: '1.4' }}>
                                {activeTab === 'internal'
                                    ? 'Votre transfert interne a été finalisé.'
                                    : 'Virement mis en attente pour contrôle. Par sécurité, les virements sortants sont soumis à des contrôles rigoureux. Délai habituel SEPA : 24h à 48h.'}
                            </p>
                            <button style={styles.mobileNextBtn} onClick={() => { setSuccess(''); setStep(1); }}>Nouveau virement</button>
                        </div>
                    ) : activeTab === 'history' ? (
                        <div className="fadeIn">
                            <h3 style={styles.mobileSectionTitle}>Historique des virements</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {paginatedHistory.map(tx => (
                                    <div key={tx.id} style={{ display: 'flex', alignItems: 'center', padding: '15px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#003366' }}>{tx.amount} {tx.currency || 'EUR'}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>
                                                {new Date(tx.createdAt?.toDate() || tx.createdAt).toLocaleDateString()} - {tx.beneficiaryName || (tx.type === 'transfer_internal' ? 'Virement Interne' : 'Externe')}
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '6px 12px',
                                            borderRadius: '50px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            backgroundColor: tx.status === 'pending' ? '#fff3cd' : (tx.status === 'in_review' ? '#e8eaf6' : (tx.status === 'rejected' ? '#ffebee' : '#e8f5e9')),
                                            color: tx.status === 'pending' ? '#856404' : (tx.status === 'in_review' ? '#283593' : (tx.status === 'rejected' ? '#c62828' : '#2e7d32')),
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {tx.status === 'in_review' && <i className="fas fa-circle-notch fa-spin"></i>}
                                            {tx.status === 'pending' ? 'En attente' : (tx.status === 'in_review' ? 'Examen INVIK' : (tx.status === 'rejected' ? 'Refusé' : 'Effectué'))}
                                        </span>
                                    </div>
                                ))}
                                {transferHistory.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#888' }}>
                                        <i className="fas fa-history" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.3 }}></i>
                                        <p>Aucun virement récent.</p>
                                    </div>
                                )}
                            </div>
                            <PaginationControls />
                        </div>
                    ) : (
                        <div className="fadeIn">
                            {step === 1 && (
                                <>
                                    <h3 style={styles.mobileSectionTitle}>1. Compte de départ</h3>
                                    {displayWallets.map(w => (
                                        <AccountCard key={w.id} wallet={w} selected={fromAccount} onClick={setFromAccount} compact />
                                    ))}
                                    <div style={{ height: '20px' }}></div>

                                    {activeTab === 'internal' ? (
                                        <>
                                            <h3 style={styles.mobileSectionTitle}>2. Compte de destination</h3>
                                            {displayWallets.length < 2 ? (
                                                <div style={styles.warningBox}>
                                                    Vous n'avez qu'un seul compte. Un virement interne nécessite au moins deux comptes.
                                                </div>
                                            ) : (
                                                displayWallets.filter(w => w.id !== fromAccount).map(w => (
                                                    <AccountCard key={w.id} wallet={w} selected={toAccount} onClick={setToAccount} type="dest" compact />
                                                ))
                                            )}
                                        </>
                                    ) : activeTab === 'instant' ? (
                                        <>
                                            <div style={{ ...styles.warningBox, backgroundColor: '#e3f2fd', borderColor: '#003366', color: '#003366', marginBottom: '1.5rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <i className="fas fa-bolt" style={{ fontSize: '1.2rem' }}></i>
                                                <span><strong>Virement Instantané INVIK</strong><br />Gratuit et immédiat entre clients de la banque.</span>
                                            </div>
                                            <h3 style={styles.mobileSectionTitle}>2. Destinataire INVIK</h3>
                                            <div style={styles.toggleRow}>
                                                <button style={beneficiaryType === 'saved' ? styles.toggleBtnActive : styles.toggleBtn} onClick={() => setBeneficiaryType('saved')}>Enregistré</button>
                                                <button style={beneficiaryType === 'new' ? styles.toggleBtnActive : styles.toggleBtn} onClick={() => setBeneficiaryType('new')}>Nouveau</button>
                                            </div>

                                            {beneficiaryType === 'saved' ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                    <select
                                                        style={styles.mobileInput}
                                                        value={selectedBeneficiaryId}
                                                        onChange={e => setSelectedBeneficiaryId(e.target.value)}
                                                    >
                                                        <option value="">Sélectionnez un client INVIK</option>
                                                        {beneficiaries.filter(b => transactionService.isInvikIban(b.iban)).map(b => (
                                                            <option key={b.id} value={b.id}>{b.name} ({b.iban})</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    <input style={styles.mobileInput} placeholder="Nom du destinataire" value={beneficiaryName} onChange={e => setBeneficiaryName(e.target.value)} />
                                                    <input style={styles.mobileInput} placeholder="IBAN INVIK (FR76 12345...)" value={beneficiaryIban} onChange={e => setBeneficiaryIban(e.target.value)} />
                                                    <input style={styles.mobileInput} placeholder="BIC (optionnel)" value={beneficiaryBic} onChange={e => setBeneficiaryBic(e.target.value)} />
                                                    <input style={styles.mobileInput} type="email" placeholder="Email (optionnel)" value={beneficiaryEmail} onChange={e => setBeneficiaryEmail(e.target.value)} />
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                                                        <input type="checkbox" checked={saveBeneficiary} onChange={e => setSaveBeneficiary(e.target.checked)} /> Enregistrer ce bénéficiaire
                                                    </label>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <h3 style={styles.mobileSectionTitle}>2. Bénéficiaire</h3>
                                            <div style={styles.toggleRow}>
                                                <button style={beneficiaryType === 'saved' ? styles.toggleBtnActive : styles.toggleBtn} onClick={() => setBeneficiaryType('saved')}>Enregistré</button>
                                                <button style={beneficiaryType === 'new' ? styles.toggleBtnActive : styles.toggleBtn} onClick={() => setBeneficiaryType('new')}>Nouveau</button>
                                            </div>

                                            {beneficiaryType === 'saved' ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                    <select
                                                        style={styles.mobileInput}
                                                        value={selectedBeneficiaryId}
                                                        onChange={e => setSelectedBeneficiaryId(e.target.value)}
                                                    >
                                                        <option value="">Sélectionnez un bénéficiaire</option>
                                                        {beneficiaries.map(b => (
                                                            <option key={b.id} value={b.id}>
                                                                {b.name} ({b.iban.substring(0, 4)}...{b.iban.slice(-4)})
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {beneficiaries.length === 0 && (
                                                        <p style={{ textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>Aucun bénéficiaire enregistré.</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <input style={styles.mobileInput} placeholder="Nom complet" value={beneficiaryName} onChange={e => setBeneficiaryName(e.target.value)} />
                                                    <input style={styles.mobileInput} placeholder="IBAN" value={beneficiaryIban} onChange={e => setBeneficiaryIban(e.target.value)} />
                                                    <input style={styles.mobileInput} placeholder="BIC (optionnel)" value={beneficiaryBic} onChange={e => setBeneficiaryBic(e.target.value)} />
                                                    <input style={styles.mobileInput} type="email" placeholder="Email (optionnel)" value={beneficiaryEmail} onChange={e => setBeneficiaryEmail(e.target.value)} />
                                                    <label style={{ display: 'flex', gap: '10px', fontSize: '0.9rem' }}>
                                                        <input type="checkbox" checked={saveBeneficiary} onChange={e => setSaveBeneficiary(e.target.checked)} />
                                                        Sauvegarder
                                                    </label>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            )}

                            {step === 2 && (
                                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                    <h3 style={styles.mobileSectionTitle}>Montant à virer</h3>
                                    <input
                                        type="number"
                                        autoFocus
                                        style={{ ...styles.mobileAmountInput, color: (parseFloat(amount) > getWallet(fromAccount)?.balance || parseFloat(amount) > 50000) ? '#e74c3c' : '#003366' }}
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        placeholder="0"
                                    />
                                    <div style={{ fontSize: '1.2rem', color: '#888' }}>EUR</div>
                                    <p style={{ marginTop: '1rem', color: '#666' }}>Solde: {getWallet(fromAccount)?.balance.toFixed(2)} €</p>

                                    {parseFloat(amount) > getWallet(fromAccount)?.balance && (
                                        <div style={{ color: '#e74c3c', marginTop: '10px', fontSize: '0.85rem' }}>
                                            <i className="fas fa-exclamation-triangle"></i> Solde insuffisant
                                        </div>
                                    )}
                                    {parseFloat(amount) > 50000 && (
                                        <div style={{ color: '#e74c3c', marginTop: '10px', fontSize: '0.85rem' }}>
                                            <i className="fas fa-exclamation-circle"></i> Limite maximale de 50 000 € dépassée
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 3 && (
                                <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '12px' }}>
                                    <h3 style={styles.mobileSectionTitle}>Destination</h3>
                                    <div style={styles.summaryRow}><span>De:</span> <strong>{getWallet(fromAccount)?.type === 'main' ? 'Principal' : 'Epargne'}</strong></div>
                                    <div style={styles.summaryRow}>
                                        <span>Vers:</span>
                                        <strong>
                                            {activeTab === 'internal'
                                                ? (getWallet(toAccount)?.type === 'main' ? 'Principal' : 'Epargne')
                                                : (beneficiaryType === 'saved' ? beneficiaries.find(b => b.id === selectedBeneficiaryId)?.name : beneficiaryName)
                                            }
                                        </strong>
                                    </div>
                                    {isInvikTarget && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#27ae60', fontSize: '0.85rem', margin: '10px 0', fontWeight: 'bold' }}>
                                            <i className="fas fa-bolt"></i> Virement instantané vers compte INVIK
                                        </div>
                                    )}
                                    <div style={styles.summaryRowBig}><span>Total:</span> <span style={{ color: '#003366' }}>{amount} €</span></div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Fixed Bottom Action Bar */}
                    {!success && activeTab !== 'history' && (
                        <div style={styles.fixedBottomBar}>
                            {step > 1 && (
                                <button style={styles.mobileBackBtn} onClick={() => setStep(s => s - 1)}>Retour</button>
                            )}
                            <button
                                style={styles.mobileNextBtn}
                                onClick={step === 3 ? handleSubmit : () => setStep(s => s + 1)}
                                disabled={
                                    (step === 1 && (!fromAccount || (activeTab === 'internal' ? !toAccount : (beneficiaryType === 'saved' ? !selectedBeneficiaryId : (!beneficiaryName || !beneficiaryIban))))) ||
                                    (step === 2 && (!amount || amount <= 0 || parseFloat(amount) > getWallet(fromAccount)?.balance || parseFloat(amount) > 50000)) ||
                                    submitting
                                }
                            >
                                {step === 3 ? (submitting ? 'Envoi...' : 'Confirmer') : 'Continuer'}
                            </button>
                        </div>
                    )}
                </div>
            </KycVerificationBanner>
        );
    }

    // --- DESKTOP LAYOUT (Original) ---
    return (
        <KycVerificationBanner>
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.title}>Espace Virements</h1>
                    <p style={styles.subtitle}>Gérez vos transferts en toute simplicité.</p>
                </header>

                <div style={styles.mainLayout}>
                    <div style={styles.sidebar}>
                        <button style={{ ...styles.sidebarBtn, ...(activeTab === 'internal' ? styles.sidebarBtnActive : {}) }} onClick={() => { setActiveTab('internal'); setStep(1); }}>
                            <div style={styles.btnIcon}><i className="fas fa-exchange-alt"></i></div>
                            <div style={styles.btnText}><strong>Mes Comptes</strong><span>Transfert interne</span></div>
                        </button>
                        <button style={{ ...styles.sidebarBtn, ...(activeTab === 'instant' ? { ...styles.sidebarBtnActive, borderLeftColor: '#27ae60' } : {}) }} onClick={() => { setActiveTab('instant'); setStep(1); }}>
                            <div style={{ ...styles.btnIcon, backgroundColor: activeTab === 'instant' ? '#e8f5e9' : '#f8f9fa', color: activeTab === 'instant' ? '#27ae60' : '#666' }}><i className="fas fa-bolt"></i></div>
                            <div style={styles.btnText}><strong>Virement INVIK</strong><span>Instantané & Gratuit</span></div>
                        </button>
                        <button style={{ ...styles.sidebarBtn, ...(activeTab === 'external' ? styles.sidebarBtnActive : {}) }} onClick={() => { setActiveTab('external'); setStep(1); }}>
                            <div style={styles.btnIcon}><i className="fas fa-university"></i></div>
                            <div style={styles.btnText}><strong>Virement SEPA</strong><span>Vers une autre banque</span></div>
                        </button>
                    </div>

                    <div style={styles.contentArea}>
                        {success ? (
                            <div style={styles.successState} className="fadeIn">
                                <div style={styles.successIcon}><i className={`fas ${activeTab === 'internal' ? 'fa-check' : 'fa-circle-notch fa-spin'}`}></i></div>
                                <h2>{activeTab === 'internal' ? 'Virement effectué !' : 'INFORMATION CAPITALE DE INVIK BANK'}</h2>
                                <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 2rem' }}>
                                    {activeTab === 'internal'
                                        ? 'Votre transfert interne a été traité avec succès.'
                                        : 'Virement mis en attente pour contrôle par nos services. Pour des raisons de sécurité, tous les virements sortants de notre banque sont soumis à des contrôles rigoureux. Les fonds seront disponibles après traitement (délai habituel de 24h à 48h pour un virement SEPA).'}
                                </p>
                                <button style={styles.nextBtn} onClick={() => { setSuccess(''); setStep(1); }}>Effectuer un autre virement</button>
                            </div>
                        ) : (
                            <>
                                <div style={styles.wizardHeader}>
                                    <div style={{ ...styles.wizardStep, opacity: step >= 1 ? 1 : 0.5 }}><div style={styles.stepNum}>1</div><span>Comptes</span></div>
                                    <div style={styles.stepLine}></div>
                                    <div style={{ ...styles.wizardStep, opacity: step >= 2 ? 1 : 0.5 }}><div style={styles.stepNum}>2</div><span>Montant</span></div>
                                    <div style={styles.stepLine}></div>
                                    <div style={{ ...styles.wizardStep, opacity: step >= 3 ? 1 : 0.5 }}><div style={styles.stepNum}>3</div><span>Validation</span></div>
                                </div>

                                <div className="fadeIn">
                                    {step === 1 && (
                                        <>
                                            <div style={styles.sectionHeader}><i className="fas fa-sign-out-alt" style={{ color: '#e74c3c' }}></i> De quel compte ?</div>
                                            <div style={styles.accountsGrid}>
                                                {displayWallets.map(w => <AccountCard key={w.id} wallet={w} selected={fromAccount} onClick={setFromAccount} />)}
                                            </div>
                                            <div style={{ margin: '2rem 0', borderBottom: '1px solid #eee' }}></div>
                                            <div style={styles.sectionHeader}><i className="fas fa-sign-in-alt" style={{ color: '#27ae60' }}></i> Vers quel bénéficiaire ?</div>

                                            {activeTab === 'internal' ? (
                                                displayWallets.length < 2 ? (
                                                    <div style={styles.warningBox}>
                                                        <i className="fas fa-exclamation-circle" style={{ fontSize: '1.5rem' }}></i>
                                                        <div><strong>Virement interne impossible</strong><p style={{ margin: 0, fontSize: '0.9rem' }}>Vous ne possédez qu'un seul compte.</p></div>
                                                    </div>
                                                ) : (
                                                    <div style={styles.accountsGrid}>
                                                        {displayWallets.filter(w => w.id !== fromAccount).map(w => <AccountCard key={w.id} wallet={w} selected={toAccount} onClick={setToAccount} type="dest" />)}
                                                    </div>
                                                )
                                            ) : activeTab === 'instant' ? (
                                                <div style={styles.beneficiaryForm}>
                                                    <div style={{ ...styles.warningBox, backgroundColor: '#e8f5e9', borderColor: '#27ae60', color: '#1e5e3a', marginBottom: '1.5rem', borderLeftWidth: '5px' }}>
                                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                            <i className="fas fa-bolt" style={{ fontSize: '1.8rem' }}></i>
                                                            <div>
                                                                <strong style={{ fontSize: '1.1rem' }}>RÉSEAU INVIK INSTANTANÉ</strong>
                                                                <p style={{ margin: '5px 0 0', fontSize: '0.9rem', opacity: 0.9 }}>Transférez des fonds en millisecondes vers n'importe quel client INVIK BANK, sans frais.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={styles.radioGroup}>
                                                        <label style={styles.radioLabel}><input type="radio" checked={beneficiaryType === 'saved'} onChange={() => setBeneficiaryType('saved')} /> Client enregistré</label>
                                                        <label style={styles.radioLabel}><input type="radio" checked={beneficiaryType === 'new'} onChange={() => setBeneficiaryType('new')} /> Nouveau bénéficiaire INVIK</label>
                                                    </div>
                                                    {beneficiaryType === 'saved' ? (
                                                        <div style={styles.inputGroup}>
                                                            <label>Sélectionner un bénéficiaire INVIK</label>
                                                            <select style={{ ...styles.select, borderColor: '#27ae60' }} value={selectedBeneficiaryId} onChange={(e) => setSelectedBeneficiaryId(e.target.value)}>
                                                                <option value="">-- Choisir un client --</option>
                                                                {beneficiaries.filter(b => transactionService.isInvikIban(b.iban)).map(b => (
                                                                    <option key={b.id} value={b.id}>{b.name} ({b.iban})</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    ) : (
                                                        <div className="fadeIn">
                                                            <div style={styles.inputGroup}><label>Nom complet</label><input style={{ ...styles.input, borderColor: '#27ae60' }} value={beneficiaryName} onChange={e => setBeneficiaryName(e.target.value)} placeholder="Ex: Jean Dupont" /></div>
                                                            <div style={styles.inputGroup}><label>IBAN INVIK</label><input style={{ ...styles.input, borderColor: '#27ae60' }} value={beneficiaryIban} onChange={e => setBeneficiaryIban(e.target.value)} placeholder="FR76 12345..." /></div>
                                                            <label style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#666' }}><input type="checkbox" checked={saveBeneficiary} onChange={e => setSaveBeneficiary(e.target.checked)} /> Enregistrer pour mes prochains virements</label>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={styles.beneficiaryForm}>
                                                    <div style={styles.radioGroup}>
                                                        <label style={styles.radioLabel}><input type="radio" checked={beneficiaryType === 'saved'} onChange={() => setBeneficiaryType('saved')} /> Bénéficiaire enregistré</label>
                                                        <label style={styles.radioLabel}><input type="radio" checked={beneficiaryType === 'new'} onChange={() => setBeneficiaryType('new')} /> Nouveau bénéficiaire</label>
                                                    </div>
                                                    {beneficiaryType === 'saved' ? (
                                                        <div style={styles.inputGroup}>
                                                            <label>Sélectionner un bénéficiaire</label>
                                                            <select style={styles.select} value={selectedBeneficiaryId} onChange={(e) => setSelectedBeneficiaryId(e.target.value)}>
                                                                <option value="">-- Choisir --</option>
                                                                {beneficiaries.map(b => <option key={b.id} value={b.id}>{b.name} ({b.iban})</option>)}
                                                            </select>
                                                            {beneficiaries.length === 0 && <p style={{ fontSize: '0.85rem', color: '#e67e22', marginTop: '5px' }}>Aucun bénéficiaire enregistré.</p>}
                                                        </div>
                                                    ) : (
                                                        <div className="fadeIn">
                                                            <div style={styles.inputGroup}><label>Nom</label><input style={styles.input} value={beneficiaryName} onChange={e => setBeneficiaryName(e.target.value)} /></div>
                                                            <div style={styles.inputGroup}><label>IBAN</label><input style={styles.input} value={beneficiaryIban} onChange={e => setBeneficiaryIban(e.target.value)} /></div>
                                                            <label style={{ display: 'flex', gap: '10px', fontSize: '0.9rem' }}><input type="checkbox" checked={saveBeneficiary} onChange={e => setSaveBeneficiary(e.target.checked)} /> Enregistrer</label>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                                                <button style={styles.nextBtn} onClick={() => setStep(2)} disabled={!fromAccount || (activeTab === 'internal' ? !toAccount : (beneficiaryType === 'saved' ? !selectedBeneficiaryId : (!beneficiaryName || !beneficiaryIban)))}>Suivant <i className="fas fa-arrow-right"></i></button>
                                            </div>
                                        </>
                                    )}

                                    {step === 2 && (
                                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                            <h3 style={styles.sectionTitle}>Combien souhaitez-vous virer ?</h3>
                                            <div style={styles.amountContainer}>
                                                <input
                                                    type="number"
                                                    style={{ ...styles.amountInput, color: (parseFloat(amount) > getWallet(fromAccount)?.balance || parseFloat(amount) > 50000) ? '#e74c3c' : '#003366' }}
                                                    value={amount}
                                                    onChange={e => setAmount(e.target.value)}
                                                    autoFocus
                                                    placeholder="0.00"
                                                />
                                                <span style={styles.currencyLabel}>EUR</span>
                                            </div>
                                            <p style={styles.balanceInfo}>Solde disponible : <strong style={{ color: (parseFloat(amount) > getWallet(fromAccount)?.balance) ? '#e74c3c' : '#27ae60' }}>{getWallet(fromAccount)?.balance.toFixed(2)} EUR</strong></p>

                                            {parseFloat(amount) > getWallet(fromAccount)?.balance && (
                                                <p style={{ color: '#e74c3c', fontWeight: 'bold', marginTop: '10px' }}>
                                                    <i className="fas fa-exclamation-triangle"></i> Attention: Ce montant dépasse votre solde disponible. Le virement pourra être rejeté.
                                                </p>
                                            )}

                                            {parseFloat(amount) > 50000 && (
                                                <p style={{ color: '#e74c3c', fontWeight: 'bold' }}><i className="fas fa-exclamation-circle"></i> Limite maximale autorisée : 50 000 € par virement</p>
                                            )}

                                            <div style={styles.btnRow}>
                                                <button style={styles.backBtn} onClick={() => setStep(1)}>Retour</button>
                                                <button
                                                    style={styles.nextBtn}
                                                    onClick={() => setStep(3)}
                                                    disabled={!amount || amount <= 0 || parseFloat(amount) > getWallet(fromAccount)?.balance || parseFloat(amount) > 50000}
                                                >
                                                    Suivant
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div>
                                            <h3 style={{ ...styles.sectionTitle, textAlign: 'center' }}>Vérifiez les détails</h3>
                                            <div style={styles.summaryCard}>
                                                <div style={styles.summaryRow}><span style={styles.summaryLabel}>De</span><span style={styles.summaryValue}>{getWallet(fromAccount)?.type === 'main' ? 'Compte Courant' : 'Epargne'}</span></div>
                                                <div style={styles.summaryRow}><span style={styles.summaryLabel}>Vers</span><span style={styles.summaryValue}>{activeTab === 'internal' ? (getWallet(toAccount)?.type === 'main' ? 'Compte Courant' : 'Epargne') : (beneficiaryType === 'saved' ? beneficiaries.find(b => b.id === selectedBeneficiaryId)?.name : beneficiaryName)}</span></div>
                                                {isInvikTarget && (
                                                    <div style={{ padding: '12px 16px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #c8e6c9' }}>
                                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#2e7d32', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <i className="fas fa-bolt" style={{ fontSize: '0.8rem' }}></i>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '1rem' }}>Virement Instantané Certifié</div>
                                                            <div style={{ fontWeight: 'normal', fontSize: '0.8rem', opacity: 0.8 }}>Exécution immédiate via le réseau sécurisé INVIK BANK.</div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div style={styles.summaryDivider}></div>
                                                <div style={styles.summaryTotal}><span>Montant</span><span>{parseFloat(amount).toFixed(2)} EUR</span></div>
                                            </div>
                                            <div style={styles.btnRow}>
                                                <button style={styles.backBtn} onClick={() => setStep(2)}>Modifier</button>
                                                <button style={styles.confirmBtn} onClick={handleSubmit} disabled={submitting}>{submitting ? <i className="fas fa-spinner fa-spin"></i> : 'Confirmer'}</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Desktop Recent Transfers Section */}
                        {!success && (
                            <div style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', color: '#003366', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-history"></i> Historique des virements récents
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {paginatedHistory.map(tx => (
                                        <div key={tx.id} style={{ display: 'flex', alignItems: 'center', padding: '15px', backgroundColor: '#f8fbff', borderRadius: '12px' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600', fontSize: '1rem' }}>{tx.amount} {tx.currency || 'EUR'}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                                    {new Date(tx.createdAt?.toDate() || tx.createdAt).toLocaleDateString()} — {tx.description}
                                                </div>
                                            </div>
                                            <span style={{
                                                padding: '6px 14px',
                                                borderRadius: '50px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                backgroundColor: tx.status === 'pending' ? '#fff3cd' : (tx.status === 'in_review' ? '#e8eaf6' : (tx.status === 'rejected' ? '#ffebee' : '#e8f5e9')),
                                                color: tx.status === 'pending' ? '#856404' : (tx.status === 'in_review' ? '#283593' : (tx.status === 'rejected' ? '#c62828' : '#2e7d32')),
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                {tx.status === 'in_review' && <i className="fas fa-circle-notch fa-spin"></i>}
                                                {tx.status === 'pending' ? 'En attente' : (tx.status === 'in_review' ? 'Examen INVIK' : (tx.status === 'rejected' ? 'Refusé' : 'Terminé'))}
                                            </span>
                                        </div>
                                    ))}
                                    {transferHistory.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>Vous n'avez pas encore effectué de virements.</p>}
                                </div>
                                <PaginationControls />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </KycVerificationBanner>
    );
};

const styles = {
    // DESKTOP STYLES
    container: { maxWidth: '1100px', margin: '0 auto', padding: '1rem' },
    header: { textAlign: 'center', marginBottom: '3rem' },
    title: { fontSize: '2.2rem', color: '#003366', fontWeight: '800' },
    subtitle: { color: '#666', fontSize: '1.1rem' },
    mainLayout: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' },
    sidebar: { display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' },
    sidebarBtn: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', border: '2px solid transparent', borderRadius: '12px', backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', color: '#666' },
    sidebarBtnActive: { backgroundColor: '#f0f8ff', border: '2px solid #003366', color: '#003366' },
    btnIcon: { width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#e3f2fd', color: '#1565c0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' },
    btnText: { display: 'flex', flexDirection: 'column' },
    contentArea: { backgroundColor: 'white', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', minHeight: '500px' },
    wizardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '600px', margin: '0 auto 3rem' },
    wizardStep: { display: 'flex', alignItems: 'center', gap: '8px', color: '#003366', fontWeight: '600' },
    stepNum: { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#003366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' },
    stepLine: { height: '2px', backgroundColor: '#eee', flex: 1, margin: '0 15px' },
    sectionHeader: { fontSize: '1.1rem', fontWeight: '700', color: '#333', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' },
    accountsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' },
    inputGroup: { marginBottom: '1.2rem' },
    input: { width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' },
    select: { width: '100%', padding: '1rem', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', backgroundColor: 'white' },
    nextBtn: { padding: '1rem 2rem', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },
    backBtn: { padding: '1rem 2rem', backgroundColor: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },
    confirmBtn: { padding: '1rem 2rem', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', width: '100%' },
    btnRow: { display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' },
    amountContainer: { display: 'inline-flex', alignItems: 'center', borderBottom: '3px solid #003366', margin: '1rem 0' },
    amountInput: { fontSize: '3rem', fontWeight: '800', color: '#003366', border: 'none', width: '200px', textAlign: 'right', outline: 'none' },
    currencyLabel: { fontSize: '1.5rem', fontWeight: '600', color: '#999', paddingLeft: '10px', paddingTop: '15px' },
    radioGroup: { display: 'flex', gap: '2rem', marginBottom: '1.5rem' },
    radioLabel: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' },
    summaryCard: { backgroundColor: '#f8fbff', padding: '2rem', borderRadius: '16px', maxWidth: '500px', margin: '0 auto' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#555' },
    summaryLabel: { color: '#888' },
    summaryValue: { fontWeight: '600', color: '#333' },
    summaryDivider: { height: '1px', backgroundColor: '#e0e0e0', margin: '1.5rem 0' },
    summaryTotal: { display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: '800', color: '#003366' },
    successState: { textAlign: 'center', padding: '4rem 0' },
    successIcon: { width: '80px', height: '80px', backgroundColor: '#e8f5e9', color: '#2ecc71', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem' },
    warningBox: { padding: '1.5rem', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '12px', border: '1px solid #ffeeba', display: 'flex', alignItems: 'center', gap: '1rem' },

    // MOBILE SPECIFIC STYLES
    mobileTabs: { display: 'flex', backgroundColor: '#fff', borderRadius: '10px', padding: '4px', marginBottom: '1.5rem', border: '1px solid #eee' },
    mobileTab: { flex: 1, padding: '10px', border: 'none', backgroundColor: 'transparent', borderRadius: '8px', fontWeight: '600', color: '#888', cursor: 'pointer' },
    mobileTabActive: { flex: 1, padding: '10px', border: 'none', backgroundColor: '#003366', color: '#fff', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    mobileSectionTitle: { fontSize: '1.1rem', marginBottom: '1rem', color: '#333', fontWeight: '700' },
    toggleRow: { display: 'flex', gap: '10px', marginBottom: '1rem' },
    toggleBtn: { flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', color: '#666' },
    toggleBtnActive: { flex: 1, padding: '8px', border: '1px solid #003366', borderRadius: '8px', backgroundColor: '#f0f8ff', color: '#003366', fontWeight: 'bold' },
    mobileInput: { width: '100%', padding: '12px', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#fff', marginBottom: '10px' },
    mobileAmountInput: { width: '100%', border: 'none', borderBottom: '2px solid #003366', fontSize: '3rem', textAlign: 'center', fontWeight: 'bold', color: '#003366', backgroundColor: 'transparent' },
    fixedBottomBar: { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '15px', backgroundColor: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '10px', zIndex: 100 },
    mobileNextBtn: { flex: 1, padding: '14px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' },
    mobileBackBtn: { width: '80px', padding: '14px', backgroundColor: '#f4f4f4', color: '#333', border: 'none', borderRadius: '12px', fontWeight: 'bold' },
    summaryRowBig: { display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' },

    desktopPagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '1.5rem' },
    mobilePagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', padding: '1.5rem' },
    pageBtn: { background: '#f0f4f8', border: 'none', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#003366', cursor: 'pointer', transition: 'all 0.2s' },
    pageBtnDisabled: { background: '#f5f5f5', border: 'none', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', cursor: 'not-allowed' },
    pageIndicator: { fontSize: '0.9rem', fontWeight: '600', color: '#555' }
};

export default Transfers;

