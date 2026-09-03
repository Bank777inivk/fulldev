import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const TransactionModal = ({ isOpen, onClose, wallet, user, onSubmit }) => {
    const [operationType, setOperationType] = useState('add'); // 'add', 'subtract', 'set'
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setDescription('');
            setOperationType('add');
        }
    }, [isOpen]);

    if (!isOpen || !wallet) return null;

    const currentBalance = Number(wallet.balance) || 0;
    const inputVal = Number(amount) || 0;
    
    let newBalance = currentBalance;
    if (operationType === 'add') {
        newBalance = currentBalance + Math.abs(inputVal);
    } else if (operationType === 'subtract') {
        newBalance = currentBalance - Math.abs(inputVal);
    } else if (operationType === 'set') {
        newBalance = inputVal;
    }

    const calculatedDifference = newBalance - currentBalance;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (calculatedDifference === 0) {
            alert('Le montant de la transaction ne peut pas être zéro.');
            return;
        }
        
        setLoading(true);
        try {
            await onSubmit({
                userId: wallet.userId,
                walletId: wallet.id,
                amount: calculatedDifference,
                newBalance,
                description: description.trim() || undefined
            });
            onClose();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'opération.");
        } finally {
            setLoading(false);
        }
    };

    return ReactDOM.createPortal(
        <div style={styles.overlay}>
            <div style={styles.modal} className="animate-fade-in">
                <div style={styles.header}>
                    <h2 style={styles.title}>Mettre à jour le solde</h2>
                    <button style={styles.closeBtn} onClick={onClose}><i className="fas fa-times"></i></button>
                </div>

                <div style={styles.clientInfo}>
                    <div style={styles.avatar}>
                        {user?.photoURL ? <img src={user.photoURL} alt="" style={styles.avatarImg} /> : (user?.firstName?.[0] || 'U')}
                    </div>
                    <div>
                        <p style={styles.clientName}>{user?.firstName} {user?.lastName}</p>
                        <p style={styles.walletDetails}>
                            {wallet.type?.toUpperCase()} - {wallet.iban || 'RIB Non défini'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.typeSelector}>
                        <button 
                            type="button" 
                            style={{...styles.typeBtn, ...(operationType === 'add' ? styles.typeBtnActiveAdd : {})}}
                            onClick={() => setOperationType('add')}
                        >
                            <i className="fas fa-plus-circle"></i> Ajouter
                        </button>
                        <button 
                            type="button" 
                            style={{...styles.typeBtn, ...(operationType === 'subtract' ? styles.typeBtnActiveSub : {})}}
                            onClick={() => setOperationType('subtract')}
                        >
                            <i className="fas fa-minus-circle"></i> Retirer
                        </button>
                        <button 
                            type="button" 
                            style={{...styles.typeBtn, ...(operationType === 'set' ? styles.typeBtnActiveSet : {})}}
                            onClick={() => setOperationType('set')}
                        >
                            <i className="fas fa-equals"></i> Définir Exact
                        </button>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            {operationType === 'set' ? 'Nouveau Solde Total' : 'Montant de l\'opération'}
                        </label>
                        <div style={styles.amountInputContainer}>
                            <input 
                                type="number" 
                                step="0.01"
                                min="0"
                                required
                                style={styles.amountInput} 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                            />
                            <span style={styles.currencySymbol}>{wallet.currency === '€' ? '€' : wallet.currency}</span>
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Motif de l'opération (Optionnel)</label>
                        <input 
                            type="text" 
                            style={styles.textInput} 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={operationType === 'add' ? 'ex: Dépôt Admin, Prime bienvenue...' : 'ex: Frais de gestion...'}
                        />
                        <p style={styles.hint}>Ce libellé apparaîtra sur le relevé du client.</p>
                    </div>

                    <div style={styles.previewBox}>
                        <div style={styles.previewRow}>
                            <span style={styles.previewLabel}>Solde Actuel :</span>
                            <span style={styles.previewValue}>{currentBalance.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}</span>
                        </div>
                        <div style={styles.previewRow}>
                            <span style={styles.previewLabel}>Opération :</span>
                            <span style={{...styles.previewValue, color: calculatedDifference > 0 ? '#10b981' : (calculatedDifference < 0 ? '#ef4444' : '#64748b')}}>
                                {calculatedDifference > 0 ? '+' : ''}{calculatedDifference.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}
                            </span>
                        </div>
                        <div style={{...styles.previewRow, ...styles.previewTotalRow}}>
                            <span style={styles.previewTotalLabel}>Nouveau Solde :</span>
                            <span style={styles.previewTotalValue}>{newBalance.toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})}</span>
                        </div>
                    </div>

                    <div style={styles.footer}>
                        <button type="button" style={styles.cancelBtn} onClick={onClose} disabled={loading}>
                            Annuler
                        </button>
                        <button type="submit" style={styles.submitBtn} disabled={loading || !amount}>
                            {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Valider la transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' },
    modal: { background: 'white', borderRadius: '24px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
    header: { padding: '1.2rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 10 },
    title: { margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' },
    closeBtn: { background: 'transparent', border: 'none', fontSize: '1.2rem', color: '#94a3b8', cursor: 'pointer', padding: '5px' },
    clientInfo: { padding: '1.2rem 1.5rem', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '1rem' },
    avatar: { width: '40px', height: '40px', borderRadius: '12px', background: '#003366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' },
    clientName: { margin: 0, fontWeight: '700', color: '#1e293b' },
    walletDetails: { margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b', fontFamily: 'monospace' },
    form: { padding: '1.5rem' },
    typeSelector: { display: 'flex', gap: '0.3rem', marginBottom: '1.5rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: '12px', flexWrap: 'wrap' },
    typeBtn: { flex: 1, minWidth: '100px', padding: '0.7rem 0.2rem', border: 'none', borderRadius: '10px', background: 'transparent', color: '#64748b', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.8rem', whiteSpace: 'nowrap' },
    typeBtnActiveAdd: { background: 'white', color: '#10b981', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    typeBtnActiveSub: { background: 'white', color: '#ef4444', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    typeBtnActiveSet: { background: 'white', color: '#003366', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    inputGroup: { marginBottom: '1.5rem' },
    label: { display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem' },
    amountInputContainer: { display: 'flex', alignItems: 'stretch', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' },
    amountInput: { flex: 1, minWidth: 0, padding: '0.8rem 1rem', border: 'none', outline: 'none', fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', width: '100%' },
    currencySymbol: { padding: '0 1rem', fontSize: '1.1rem', fontWeight: '800', color: '#94a3b8', background: '#f8fafc', display: 'flex', alignItems: 'center', borderLeft: '1px solid #e2e8f0', flexShrink: 0 },
    textInput: { width: '100%', minWidth: 0, padding: '0.8rem 1rem', border: '2px solid #e2e8f0', borderRadius: '10px', outline: 'none', fontSize: '0.9rem', color: '#1e293b', boxSizing: 'border-box' },
    hint: { margin: '0.4rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8' },
    previewBox: { background: '#f8fafc', padding: '1.2rem', borderRadius: '16px', marginBottom: '1.5rem' },
    previewRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' },
    previewLabel: { fontSize: '0.85rem', color: '#64748b' },
    previewValue: { fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' },
    previewTotalRow: { borderTop: '1px dashed #cbd5e1', paddingTop: '0.8rem', marginTop: '0.5rem', marginBottom: 0 },
    previewTotalLabel: { fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' },
    previewTotalValue: { fontSize: '1.2rem', fontWeight: '800', color: '#003366' },
    footer: { display: 'flex', gap: '0.8rem', flexWrap: 'wrap' },
    cancelBtn: { flex: 1, minWidth: '120px', padding: '0.8rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white', color: '#64748b', fontWeight: '700', cursor: 'pointer' },
    submitBtn: { flex: 2, minWidth: '180px', padding: '0.8rem', border: 'none', borderRadius: '12px', background: '#003366', color: 'white', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' }
};

export default TransactionModal;
