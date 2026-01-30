import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { walletService } from '../../services/walletService';
import { transactionService } from '../../services/transactionService';
import { useNavigate } from 'react-router-dom';
import { beneficiaryService } from '../../services/beneficiaryService';
import KycVerificationBanner from '../../components/dashboard/KycVerificationBanner';
import { useTranslation } from 'react-i18next'; // Import i18n

const Transfers = () => {
    const { currentUser } = useAuth();
    const { wallets, transactions, beneficiaries, loading } = useData();
    const { showToast } = useNotifications();
    const { t, i18n } = useTranslation(); // Hook initialization

    // Helper to translate legacy/hardcoded transaction descriptions
    const formatDescription = (description) => {
        if (!description) return "";
        const match = description.match(/^Virement pour (.+) \(Contrôle INVIK\)$/);
        if (match) {
            return t('transfers.history.transfer_for_check', { name: match[1] });
        }
        return description;
    };

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
            showToast(t('transfers.errors.invalid_amount'), "error");
            return;
        }

        if (fromWallet && numAmount > fromWallet.balance) {
            showToast(t('transfers.errors.insufficient_balance'), "error");
            return;
        }

        if (numAmount > 50000) {
            showToast(t('transfers.errors.limit_exceeded'), "error");
            return;
        }

        setSubmitting(true);
        try {
            if (activeTab === 'internal') {
                await transactionService.performInternalTransfer(currentUser.uid, fromAccount, toAccount, amount);
                setSuccess(t('transfers.success_messages.internal'));
            } else {
                // For both INVIK and SEPA, we resolve the beneficiary info first
                const beneficiary = beneficiaryType === 'saved' ? beneficiaries.find(b => b.id === selectedBeneficiaryId) : null;
                const finalName = beneficiary ? beneficiary.name : beneficiaryName;
                const finalIban = beneficiary ? beneficiary.iban : beneficiaryIban;
                const finalEmail = beneficiary ? beneficiary.email : beneficiaryEmail;

                if (!finalName || !finalIban) throw new Error(t('transfers.errors.check_beneficiary'));

                if (activeTab === 'instant') {
                    if (!transactionService.isInvikIban(finalIban)) throw new Error(t('transfers.errors.not_invik_iban'));

                    const result = await transactionService.performInstantTransfer(currentUser.uid, fromAccount, finalIban, finalName, amount, finalEmail);

                    if (beneficiaryType === 'new' && saveBeneficiary) {
                        await beneficiaryService.addBeneficiary(currentUser.uid, {
                            name: finalName,
                            iban: finalIban,
                            bic: beneficiaryBic || '',
                            email: beneficiaryEmail || ''
                        });
                    }

                    setSuccess(t('transfers.success_messages.instant', { name: finalName }));
                } else {
                    // SEPA Tab logic
                    if (transactionService.isInvikIban(finalIban)) {
                        // Fail-safe: even in external tab, if it's invik, do it instant
                        const result = await transactionService.performInstantTransfer(currentUser.uid, fromAccount, finalIban, finalName, amount, finalEmail);
                        if (result.instant) {
                            setSuccess(t('transfers.success_messages.instant', { name: finalName }));
                        } else {
                            setSuccess(t('transfers.success_messages.pending'));
                        }
                    } else {
                        // Validate IBAN before submission
                        if (!validateIban(finalIban)) {
                            throw new Error(t('transfers.errors.invalid_iban'));
                        }

                        // Standard External Transfer (Attempt)
                        const result = await transactionService.requestExternalTransfer(
                            currentUser.uid,
                            fromAccount,
                            finalName,
                            finalIban,
                            amount,
                            finalEmail || ''
                        );

                        if (beneficiaryType === 'new' && saveBeneficiary) {
                            await beneficiaryService.addBeneficiary(currentUser.uid, {
                                name: finalName,
                                iban: finalIban,
                                bic: beneficiaryBic || '',
                                email: beneficiaryEmail || ''
                            });
                        }

                        // Check for INVIK Bank Code (12345) or instant result
                        if (result.instant || finalIban.replace(/[^a-zA-Z0-9]/g, '').includes('12345')) {
                            setSuccess(t('transfers.success_messages.instant', { name: finalName }));
                        } else {
                            setSuccess(t('transfers.success_messages.pending'));
                        }
                    }
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
        const { t, i18n } = useTranslation();
        if (!wallet) return null;
        const isSelected = selected === wallet.id;
        const bgColor = type === 'source' ? '#fff' : (isSelected ? '#f0f8ff' : '#fff');
        const borderColor = isSelected ? '#003366' : '#eef2f6';

        const currentLocale = i18n.language === 'en' ? 'en-US' : (i18n.language === 'fr' ? 'fr-FR' : i18n.language);

        const config = {
            main: { label: t('accounts.card.main'), icon: 'fa-wallet', color: '#1565c0', bg: '#e3f2fd' },
            savings: { label: t('accounts.card.savings'), icon: 'fa-piggy-bank', color: '#2e7d32', bg: '#e8f5e9' },
            credit: { label: t('accounts.card.credit'), icon: 'fa-hand-holding-usd', color: '#c0392b', bg: '#ffebee' }
        }[wallet.type] || { label: t('accounts.card.other'), icon: 'fa-university', color: '#666', bg: '#f8f9fa' };

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
                    borderRadius: '50%', backgroundColor: config.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: config.color
                }}>
                    <i className={`fas ${config.icon}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#333', fontSize: compact ? '0.9rem' : '1rem' }}>{config.label}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{(wallet.balance || 0).toLocaleString(currentLocale, { style: 'currency', currency: (wallet.currency === '€' ? 'EUR' : (wallet.currency || 'EUR')) })}</div>
                </div>
                {isSelected && <i className="fas fa-check-circle" style={{ color: '#003366', fontSize: '1.2rem' }}></i>}
            </div>
        );
    };

    if (loading && wallets.length === 0) return <div style={{ textAlign: 'center', padding: '4rem' }}>{t('loading')}</div>;

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
                <div style={styles.pageIndicator}>{t('transfers.pagination.page', { current: historyPage, total: totalHistoryPages })}</div>
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
                <div style={{ padding: '1rem', paddingBottom: '150px' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#003366', marginBottom: '1.5rem' }}>{t('transfers.mobile_title')}</h1>

                    {/* Mobile Tabs */}
                    <div style={styles.mobileTabs}>
                        <button
                            style={activeTab === 'internal' ? styles.mobileTabActive : styles.mobileTab}
                            onClick={() => { setActiveTab('internal'); setStep(1); }}
                        >
                            {t('transfers.tabs.internal')}
                        </button>
                        <button
                            style={activeTab === 'instant' ? { ...styles.mobileTabActive, border: '1px solid transparent', borderBottom: '3px solid #27ae60', color: '#27ae60' } : styles.mobileTab}
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
                            {t('transfers.tabs.history')}
                        </button>
                    </div>

                    {success ? (
                        <div style={styles.successState} className="fadeIn">
                            <div style={styles.successIcon}><i className={`fas ${success !== t('transfers.success_messages.pending') ? 'fa-check' : 'fa-circle-notch fa-spin'}`}></i></div>
                            <h2 style={{ fontSize: '1.2rem', textAlign: 'center' }}>{success !== t('transfers.success_messages.pending') ? t('transfers.success.title') : t('transfers.success.review_title')}</h2>
                            <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem', fontSize: '0.85rem', lineHeight: '1.4' }}>
                                {success}
                            </p>
                            <button style={styles.mobileNextBtn} onClick={() => { setSuccess(''); setStep(1); }}>{t('transfers.success.new_button')}</button>
                        </div>
                    ) : activeTab === 'history' ? (
                        <div className="fadeIn">
                            <h3 style={styles.mobileSectionTitle}>{t('transfers.history.title')}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {paginatedHistory.map(tx => (
                                    <div key={tx.id} style={{ display: 'flex', alignItems: 'center', padding: '15px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#003366' }}>{tx.amount} {tx.currency || 'EUR'}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>
                                                {new Date(tx.createdAt?.toDate() || tx.createdAt).toLocaleDateString()} - {tx.beneficiaryName || (tx.type === 'transfer_internal' ? t('transfers.tabs.internal_desc') : 'Externe')}
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
                                            {tx.status === 'pending' ? t('status.pending') : (tx.status === 'in_review' ? t('transactions.review') : (tx.status === 'rejected' ? t('status.rejected') : t('status.completed')))}
                                        </span>
                                    </div>
                                ))}
                                {transferHistory.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#888' }}>
                                        <i className="fas fa-history" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.3 }}></i>
                                        <p>{t('transfers.history.empty')}</p>
                                    </div>
                                )}
                            </div>
                            <PaginationControls />
                        </div>
                    ) : (
                        <div className="fadeIn">
                            {step === 1 && (
                                <>
                                    <h3 style={styles.mobileSectionTitle}>{t('transfers.form.step_source')}</h3>
                                    {displayWallets.map(w => (
                                        <AccountCard key={w.id} wallet={w} selected={fromAccount} onClick={setFromAccount} compact />
                                    ))}
                                    <div style={{ height: '20px' }}></div>

                                    {activeTab === 'internal' ? (
                                        <>
                                            <h3 style={styles.mobileSectionTitle}>{t('transfers.form.step_dest')}</h3>
                                            {displayWallets.length < 2 ? (
                                                <div style={styles.warningBox}>
                                                    {t('transfers.warnings.single_account_desc')}
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
                                                <span><strong>{t('transfers.invik_network.title')}</strong><br />{t('transfers.invik_network.desc')}</span>
                                            </div>
                                            <h3 style={styles.mobileSectionTitle}>{t('transfers.form.step_dest_invik')}</h3>
                                            <div style={styles.toggleRow}>
                                                <button style={beneficiaryType === 'saved' ? styles.toggleBtnActive : styles.toggleBtn} onClick={() => setBeneficiaryType('saved')}>{t('transfers.beneficiary_type.saved')}</button>
                                                <button style={beneficiaryType === 'new' ? styles.toggleBtnActive : styles.toggleBtn} onClick={() => setBeneficiaryType('new')}>{t('transfers.beneficiary_type.new')}</button>
                                            </div>

                                            {beneficiaryType === 'saved' ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                    <select
                                                        style={styles.mobileInput}
                                                        value={selectedBeneficiaryId}
                                                        onChange={e => setSelectedBeneficiaryId(e.target.value)}
                                                    >
                                                        <option value="">{t('transfers.inputs.select_invik')}</option>
                                                        {beneficiaries.filter(b => transactionService.isInvikIban(b.iban)).map(b => (
                                                            <option key={b.id} value={b.id}>{b.name} ({b.iban})</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    <input style={styles.mobileInput} placeholder={t('transfers.inputs.name')} value={beneficiaryName} onChange={e => setBeneficiaryName(e.target.value)} />
                                                    <input style={styles.mobileInput} placeholder={t('transfers.inputs.iban')} value={beneficiaryIban} onChange={e => setBeneficiaryIban(e.target.value)} />
                                                    <input style={styles.mobileInput} placeholder={t('transfers.inputs.bic')} value={beneficiaryBic} onChange={e => setBeneficiaryBic(e.target.value)} />
                                                    <input style={styles.mobileInput} type="email" placeholder={t('transfers.inputs.email')} value={beneficiaryEmail} onChange={e => setBeneficiaryEmail(e.target.value)} />
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                                                        <input type="checkbox" checked={saveBeneficiary} onChange={e => setSaveBeneficiary(e.target.checked)} /> {t('transfers.inputs.save_invik')}
                                                    </label>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <h3 style={styles.mobileSectionTitle}>{t('transfers.form.step_dest_beneficiary')}</h3>
                                            <div style={styles.toggleRow}>
                                                <button style={beneficiaryType === 'saved' ? styles.toggleBtnActive : styles.toggleBtn} onClick={() => setBeneficiaryType('saved')}>{t('transfers.beneficiary_type.saved')}</button>
                                                <button style={beneficiaryType === 'new' ? styles.toggleBtnActive : styles.toggleBtn} onClick={() => setBeneficiaryType('new')}>{t('transfers.beneficiary_type.new')}</button>
                                            </div>

                                            {beneficiaryType === 'saved' ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                    <select
                                                        style={styles.mobileInput}
                                                        value={selectedBeneficiaryId}
                                                        onChange={e => setSelectedBeneficiaryId(e.target.value)}
                                                    >
                                                        <option value="">{t('transfers.inputs.select_beneficiary')}</option>
                                                        {beneficiaries.map(b => (
                                                            <option key={b.id} value={b.id}>
                                                                {b.name} ({b.iban.substring(0, 4)}...{b.iban.slice(-4)})
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {beneficiaries.length === 0 && (
                                                        <p style={{ textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>{t('common.beneficiary_empty')}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <input style={styles.mobileInput} placeholder={t('transfers.inputs.name')} value={beneficiaryName} onChange={e => setBeneficiaryName(e.target.value)} />
                                                    <input style={styles.mobileInput} placeholder={t('transfers.inputs.iban')} value={beneficiaryIban} onChange={e => setBeneficiaryIban(e.target.value)} />
                                                    <input style={styles.mobileInput} placeholder={t('transfers.inputs.bic')} value={beneficiaryBic} onChange={e => setBeneficiaryBic(e.target.value)} />
                                                    <input style={styles.mobileInput} type="email" placeholder={t('transfers.inputs.email')} value={beneficiaryEmail} onChange={e => setBeneficiaryEmail(e.target.value)} />
                                                    <label style={{ display: 'flex', gap: '10px', fontSize: '0.9rem' }}>
                                                        <input type="checkbox" checked={saveBeneficiary} onChange={e => setSaveBeneficiary(e.target.checked)} />
                                                        {t('transfers.inputs.save_beneficiary')}
                                                    </label>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            )}

                            {step === 2 && (
                                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                    <h3 style={styles.mobileSectionTitle}>{t('transfers.form.step_amount')}</h3>
                                    <input
                                        type="number"
                                        autoFocus
                                        style={{ ...styles.mobileAmountInput, color: (parseFloat(amount) > getWallet(fromAccount)?.balance || parseFloat(amount) > 50000) ? '#e74c3c' : '#003366' }}
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        placeholder="0"
                                    />
                                    <div style={{ fontSize: '1.2rem', color: '#888' }}>EUR</div>
                                    <p style={{ marginTop: '1rem', color: '#666' }}>{t('transfers.amount.available')} {getWallet(fromAccount)?.balance.toFixed(2)} €</p>

                                    {parseFloat(amount) > getWallet(fromAccount)?.balance && (
                                        <div style={{ color: '#e74c3c', marginTop: '10px', fontSize: '0.85rem' }}>
                                            <i className="fas fa-exclamation-triangle"></i> {t('transfers.amount.insufficient_funds')}
                                        </div>
                                    )}
                                    {parseFloat(amount) > 50000 && (
                                        <div style={{ color: '#e74c3c', marginTop: '10px', fontSize: '0.85rem' }}>
                                            <i className="fas fa-exclamation-circle"></i> {t('transfers.amount.limit_exceeded')}
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 3 && (
                                <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '12px' }}>
                                    <h3 style={styles.mobileSectionTitle}>{t('transfers.steps.validation')}</h3>
                                    <div style={styles.summaryRow}><span>{t('transfers.review.from')}:</span> <strong>{getWallet(fromAccount)?.type === 'main' ? t('accounts.card.main') : t('accounts.card.savings')}</strong></div>
                                    <div style={styles.summaryRow}>
                                        <span>{t('transfers.review.to')}:</span>
                                        <strong>
                                            {activeTab === 'internal'
                                                ? (getWallet(toAccount)?.type === 'main' ? t('accounts.card.main') : t('accounts.card.savings'))
                                                : (beneficiaryType === 'saved' ? beneficiaries.find(b => b.id === selectedBeneficiaryId)?.name : beneficiaryName)
                                            }
                                        </strong>
                                    </div>
                                    {isInvikTarget && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#27ae60', fontSize: '0.85rem', margin: '10px 0', fontWeight: 'bold' }}>
                                            <i className="fas fa-bolt"></i> {t('transfers.review.certified')}
                                        </div>
                                    )}
                                    <div style={styles.summaryRowBig}><span>{t('transfers.review.total')}:</span> <span style={{ color: '#003366' }}>{amount} €</span></div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Fixed Bottom Action Bar */}
                    {!success && activeTab !== 'history' && (
                        <div style={styles.fixedBottomBar}>
                            {step > 1 && (
                                <button style={styles.mobileBackBtn} onClick={() => setStep(s => s - 1)}>{t('transfers.buttons.back')}</button>
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
                                {step === 3 ? (submitting ? t('transfers.form.sending') : t('transfers.buttons.confirm')) : t('transfers.buttons.next')}
                            </button>
                        </div>
                    )}
                </div>
            </KycVerificationBanner >
        );
    }

    // --- DESKTOP LAYOUT (Original) ---
    return (
        <KycVerificationBanner>
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.title}>{t('transfers.title')}</h1>
                    <p style={styles.subtitle}>{t('transfers.subtitle')}</p>
                </header>

                <div style={styles.mainLayout}>
                    <div style={styles.sidebar}>
                        <button style={{ ...styles.sidebarBtn, ...(activeTab === 'internal' ? styles.sidebarBtnActive : {}) }} onClick={() => { setActiveTab('internal'); setStep(1); }}>
                            <div style={styles.btnIcon}><i className="fas fa-exchange-alt"></i></div>
                            <div style={styles.btnText}><strong>{t('transfers.tabs.internal')}</strong><span>{t('transfers.tabs.internal_desc')}</span></div>
                        </button>
                        <button style={{ ...styles.sidebarBtn, ...(activeTab === 'instant' ? { ...styles.sidebarBtnActive, borderLeftColor: '#27ae60' } : {}) }} onClick={() => { setActiveTab('instant'); setStep(1); }}>
                            <div style={{ ...styles.btnIcon, backgroundColor: activeTab === 'instant' ? '#e8f5e9' : '#f8f9fa', color: activeTab === 'instant' ? '#27ae60' : '#666' }}><i className="fas fa-bolt"></i></div>
                            <div style={styles.btnText}><strong>{t('transfers.tabs.invik')}</strong><span>{t('transfers.tabs.invik_desc')}</span></div>
                        </button>
                        <button style={{ ...styles.sidebarBtn, ...(activeTab === 'external' ? styles.sidebarBtnActive : {}) }} onClick={() => { setActiveTab('external'); setStep(1); }}>
                            <div style={styles.btnIcon}><i className="fas fa-university"></i></div>
                            <div style={styles.btnText}><strong>{t('transfers.tabs.sepa')}</strong><span>{t('transfers.tabs.sepa_desc')}</span></div>
                        </button>
                    </div>

                    <div style={styles.contentArea}>
                        {success ? (
                            <div style={styles.successState} className="fadeIn">
                                <div style={styles.successIcon}><i className={`fas ${success !== t('transfers.success_messages.pending') ? 'fa-check' : 'fa-circle-notch fa-spin'}`}></i></div>
                                <h2>{success !== t('transfers.success_messages.pending') ? t('transfers.success.title') : t('transfers.success.review_title')}</h2>
                                <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 2rem' }}>
                                    {success}
                                </p>
                                <button style={styles.nextBtn} onClick={() => { setSuccess(''); setStep(1); }}>{t('transfers.success.new_button')}</button>
                            </div>
                        ) : (
                            <>
                                <div style={styles.wizardHeader}>
                                    <div style={{ ...styles.wizardStep, opacity: step >= 1 ? 1 : 0.5 }}><div style={styles.stepNum}>1</div><span>{t('transfers.steps.accounts')}</span></div>
                                    <div style={styles.stepLine}></div>
                                    <div style={{ ...styles.wizardStep, opacity: step >= 2 ? 1 : 0.5 }}><div style={styles.stepNum}>2</div><span>{t('transfers.steps.amount')}</span></div>
                                    <div style={styles.stepLine}></div>
                                    <div style={{ ...styles.wizardStep, opacity: step >= 3 ? 1 : 0.5 }}><div style={styles.stepNum}>3</div><span>{t('transfers.steps.validation')}</span></div>
                                </div>

                                <div className="fadeIn">
                                    {step === 1 && (
                                        <>
                                            <div style={styles.sectionHeader}><i className="fas fa-sign-out-alt" style={{ color: '#e74c3c' }}></i> {t('transfers.account_selection.source')}</div>
                                            <div style={styles.accountsGrid}>
                                                {displayWallets.map(w => <AccountCard key={w.id} wallet={w} selected={fromAccount} onClick={setFromAccount} />)}
                                            </div>
                                            <div style={{ margin: '2rem 0', borderBottom: '1px solid #eee' }}></div>
                                            <div style={styles.sectionHeader}><i className="fas fa-sign-in-alt" style={{ color: '#27ae60' }}></i> {t('transfers.account_selection.dest')}</div>

                                            {activeTab === 'internal' ? (
                                                displayWallets.length < 2 ? (
                                                    <div style={styles.warningBox}>
                                                        <i className="fas fa-exclamation-circle" style={{ fontSize: '1.5rem' }}></i>
                                                        <div><strong>{t('transfers.warnings.single_account_title')}</strong><p style={{ margin: 0, fontSize: '0.9rem' }}>{t('transfers.warnings.single_account_desc')}</p></div>
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
                                                                <strong style={{ fontSize: '1.1rem' }}>{t('transfers.invik_network.title')}</strong>
                                                                <p style={{ margin: '5px 0 0', fontSize: '0.9rem', opacity: 0.9 }}>{t('transfers.invik_network.desc')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={styles.radioGroup}>
                                                        <label style={styles.radioLabel}><input type="radio" checked={beneficiaryType === 'saved'} onChange={() => setBeneficiaryType('saved')} /> {t('transfers.beneficiary_type.saved')}</label>
                                                        <label style={styles.radioLabel}><input type="radio" checked={beneficiaryType === 'new'} onChange={() => setBeneficiaryType('new')} /> {t('transfers.beneficiary_type.new')}</label>
                                                    </div>
                                                    {beneficiaryType === 'saved' ? (
                                                        <div style={styles.inputGroup}>
                                                            <label>{t('transfers.inputs.select_invik')}</label>
                                                            <select style={{ ...styles.select, borderColor: '#27ae60' }} value={selectedBeneficiaryId} onChange={(e) => setSelectedBeneficiaryId(e.target.value)}>
                                                                <option value="">-- {t('transfers.inputs.select_invik')} --</option>
                                                                {beneficiaries.filter(b => transactionService.isInvikIban(b.iban)).map(b => (
                                                                    <option key={b.id} value={b.id}>{b.name} ({b.iban})</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    ) : (
                                                        <div className="fadeIn">
                                                            <div style={styles.inputGroup}><label>{t('transfers.inputs.name')}</label><input style={{ ...styles.input, borderColor: '#27ae60' }} value={beneficiaryName} onChange={e => setBeneficiaryName(e.target.value)} placeholder={t('transfers.inputs.name_placeholder')} /></div>
                                                            <div style={styles.inputGroup}><label>{t('transfers.inputs.iban')}</label><input style={{ ...styles.input, borderColor: '#27ae60' }} value={beneficiaryIban} onChange={e => setBeneficiaryIban(e.target.value)} placeholder={t('transfers.inputs.iban_placeholder')} /></div>
                                                            <div style={styles.inputGroup}><label>{t('transfers.inputs.bic')}</label><input style={{ ...styles.input, borderColor: '#27ae60' }} value={beneficiaryBic} onChange={e => setBeneficiaryBic(e.target.value)} placeholder={t('transfers.inputs.bic_placeholder')} /></div>
                                                            <div style={styles.inputGroup}><label>{t('transfers.inputs.email')}</label><input style={{ ...styles.input, borderColor: '#27ae60' }} type="email" value={beneficiaryEmail} onChange={e => setBeneficiaryEmail(e.target.value)} placeholder={t('transfers.inputs.email_placeholder')} /></div>
                                                            <label style={{ display: 'flex', gap: '10px', fontSize: '1rem', color: '#1e5e3a', fontWeight: '600', cursor: 'pointer', marginTop: '1rem' }}>
                                                                <input type="checkbox" style={{ width: '20px', height: '20px' }} checked={saveBeneficiary} onChange={e => setSaveBeneficiary(e.target.checked)} /> {t('transfers.inputs.save_invik')}
                                                            </label>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={styles.beneficiaryForm}>
                                                    <div style={styles.radioGroup}>
                                                        <label style={styles.radioLabel}><input type="radio" checked={beneficiaryType === 'saved'} onChange={() => setBeneficiaryType('saved')} /> {t('transfers.beneficiary_type.saved')}</label>
                                                        <label style={styles.radioLabel}><input type="radio" checked={beneficiaryType === 'new'} onChange={() => setBeneficiaryType('new')} /> {t('transfers.beneficiary_type.new')}</label>
                                                    </div>
                                                    {beneficiaryType === 'saved' ? (
                                                        <div style={styles.inputGroup}>
                                                            <label>{t('transfers.inputs.select_beneficiary')}</label>
                                                            <select style={styles.select} value={selectedBeneficiaryId} onChange={(e) => setSelectedBeneficiaryId(e.target.value)}>
                                                                <option value="">-- {t('transfers.buttons.edit')} --</option>
                                                                {beneficiaries.map(b => <option key={b.id} value={b.id}>{b.name} ({b.iban})</option>)}
                                                            </select>
                                                            {beneficiaries.length === 0 && <p style={{ fontSize: '0.85rem', color: '#e67e22', marginTop: '5px' }}>{t('transfers.history.empty')}</p>}
                                                        </div>
                                                    ) : (
                                                        <div className="fadeIn">
                                                            <div style={styles.inputGroup}><label>{t('transfers.inputs.name')}</label><input style={styles.input} value={beneficiaryName} onChange={e => setBeneficiaryName(e.target.value)} placeholder={t('transfers.inputs.name_placeholder')} /></div>
                                                            <div style={styles.inputGroup}><label>{t('transfers.inputs.iban')}</label><input style={styles.input} value={beneficiaryIban} onChange={e => setBeneficiaryIban(e.target.value)} placeholder={t('transfers.inputs.iban_placeholder')} /></div>
                                                            <div style={styles.inputGroup}><label>{t('transfers.inputs.bic')}</label><input style={styles.input} value={beneficiaryBic} onChange={e => setBeneficiaryBic(e.target.value)} placeholder={t('transfers.inputs.bic_placeholder')} /></div>
                                                            <div style={styles.inputGroup}><label>{t('transfers.inputs.email')}</label><input style={styles.input} type="email" value={beneficiaryEmail} onChange={e => setBeneficiaryEmail(e.target.value)} placeholder={t('transfers.inputs.email_placeholder')} /></div>
                                                            <label style={{ display: 'flex', gap: '10px', fontSize: '1rem', color: '#003366', fontWeight: '600', cursor: 'pointer', marginTop: '1rem' }}>
                                                                <input type="checkbox" style={{ width: '20px', height: '20px' }} checked={saveBeneficiary} onChange={e => setSaveBeneficiary(e.target.checked)} /> {t('transfers.inputs.save_beneficiary')}
                                                            </label>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                                                <button style={styles.nextBtn} onClick={() => setStep(2)} disabled={!fromAccount || (activeTab === 'internal' ? !toAccount : (beneficiaryType === 'saved' ? !selectedBeneficiaryId : (!beneficiaryName || !beneficiaryIban)))}>{t('transfers.buttons.next')} <i className="fas fa-arrow-right"></i></button>
                                            </div>
                                        </>
                                    )}

                                    {step === 2 && (
                                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                            <h3 style={styles.sectionTitle}>{t('transfers.amount.title')}</h3>
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
                                            <p style={styles.balanceInfo}>{t('transfers.amount.available')} <strong style={{ color: (parseFloat(amount) > getWallet(fromAccount)?.balance) ? '#e74c3c' : '#27ae60' }}>{getWallet(fromAccount)?.balance.toFixed(2)} EUR</strong></p>

                                            {parseFloat(amount) > getWallet(fromAccount)?.balance && (
                                                <p style={{ color: '#e74c3c', fontWeight: 'bold', marginTop: '10px' }}>
                                                    <i className="fas fa-exclamation-triangle"></i> {t('transfers.amount.insufficient_funds')}
                                                </p>
                                            )}

                                            {parseFloat(amount) > 50000 && (
                                                <p style={{ color: '#e74c3c', fontWeight: 'bold' }}><i className="fas fa-exclamation-circle"></i> {t('transfers.amount.limit_exceeded')}</p>
                                            )}

                                            <div style={styles.btnRow}>
                                                <button style={styles.backBtn} onClick={() => setStep(1)}>{t('transfers.buttons.back')}</button>
                                                <button
                                                    style={styles.nextBtn}
                                                    onClick={() => setStep(3)}
                                                    disabled={!amount || amount <= 0 || parseFloat(amount) > getWallet(fromAccount)?.balance || parseFloat(amount) > 50000}
                                                >
                                                    {t('transfers.buttons.next')}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div>
                                            <h3 style={{ ...styles.sectionTitle, textAlign: 'center' }}>{t('transfers.review.title')}</h3>
                                            <div style={styles.summaryCard}>
                                                <div style={styles.summaryRow}><span style={styles.summaryLabel}>{t('transfers.review.from')}</span><span style={styles.summaryValue}>{getWallet(fromAccount)?.type === 'main' ? t('accounts.card.main') : t('accounts.card.savings')}</span></div>
                                                <div style={styles.summaryRow}><span style={styles.summaryLabel}>{t('transfers.review.to')}</span><span style={styles.summaryValue}>{activeTab === 'internal' ? (getWallet(toAccount)?.type === 'main' ? t('accounts.card.main') : t('accounts.card.savings')) : (beneficiaryType === 'saved' ? beneficiaries.find(b => b.id === selectedBeneficiaryId)?.name : beneficiaryName)}</span></div>
                                                {isInvikTarget && (
                                                    <div style={{ padding: '12px 16px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #c8e6c9' }}>
                                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#2e7d32', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <i className="fas fa-bolt" style={{ fontSize: '0.8rem' }}></i>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '1rem' }}>{t('transfers.review.certified')}</div>
                                                            <div style={{ fontWeight: 'normal', fontSize: '0.8rem', opacity: 0.8 }}>{t('transfers.review.certified_desc')}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div style={styles.summaryDivider}></div>
                                                <div style={styles.summaryTotal}><span>{t('transfers.review.total')}</span><span>{parseFloat(amount).toFixed(2)} EUR</span></div>
                                            </div>
                                            <div style={styles.btnRow}>
                                                <button style={styles.backBtn} onClick={() => setStep(2)}>{t('transfers.buttons.edit')}</button>
                                                <button style={styles.confirmBtn} onClick={handleSubmit} disabled={submitting}>{submitting ? <i className="fas fa-spinner fa-spin"></i> : t('transfers.buttons.confirm')}</button>
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
                                    <i className="fas fa-history"></i> {t('transfers.history.title')}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {paginatedHistory.map(tx => (
                                        <div key={tx.id} style={{ display: 'flex', alignItems: 'center', padding: '15px', backgroundColor: '#f8fbff', borderRadius: '12px' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '600', fontSize: '1rem' }}>{tx.amount} {tx.currency || 'EUR'}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                                    {new Date(tx.createdAt?.toDate() || tx.createdAt).toLocaleDateString()} — {formatDescription(tx.description)}
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
                                                {tx.status === 'pending' ? t('status.pending') : (tx.status === 'in_review' ? t('transactions.review') : (tx.status === 'rejected' ? t('status.rejected') : t('status.completed')))}
                                            </span>
                                        </div>
                                    ))}
                                    {transferHistory.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>{t('transfers.history.empty')}</p>}
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
    mobileTab: { flex: 1, padding: '10px', border: 'none', backgroundColor: 'transparent', borderRadius: '8px', fontWeight: 'bold', color: '#888', cursor: 'pointer' },
    mobileTabActive: { flex: 1, padding: '10px', border: 'none', backgroundColor: '#003366', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
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

