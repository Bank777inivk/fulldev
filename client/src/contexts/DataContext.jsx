import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import {
    collection,
    query,
    where,
    onSnapshot,
    orderBy,
    doc
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [wallets, setWallets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [kycStatus, setKycStatus] = useState(null);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [cards, setCards] = useState([]);
    const [cardRequests, setCardRequests] = useState([]);
    const [loans, setLoans] = useState([]);
    const [ribs, setRibs] = useState([]);
    const [accountRequests, setAccountRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setWallets([]);
            setTransactions([]);
            setKycStatus(null);
            setBeneficiaries([]);
            setCards([]);
            setCardRequests([]);
            setLoans([]);
            setRibs([]);
            setAccountRequests([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        // Listen for Wallets
        const qWallets = query(
            collection(db, 'wallets'),
            where('userId', '==', currentUser.uid)
        );

        const unsubscribeWallets = onSnapshot(qWallets, (snapshot) => {
            const walletData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setWallets(walletData);
            setLoading(false);
        }, (error) => {
            console.error("Error listening to wallets:", error);
            setLoading(false);
        });

        // Listen for Transactions
        const qTransactions = query(
            collection(db, 'transactions'),
            where('userId', '==', currentUser.uid)
        );

        const unsubscribeTransactions = onSnapshot(qTransactions, (snapshot) => {
            const txData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort client-side to avoid index requirements
            const sortedTx = txData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setTransactions(sortedTx);
        });

        // Listen for KYC Status
        const unsubscribeKyc = onSnapshot(doc(db, 'kyc', currentUser.uid), (snapshot) => {
            if (snapshot.exists()) {
                setKycStatus({ id: snapshot.id, ...snapshot.data() });
            } else {
                setKycStatus({ status: 'not_started' });
            }
        }, (error) => {
            console.error("Error listening to KYC:", error);
        });

        // Listen for Beneficiaries (Sub-collection)
        const qBeneficiaries = query(
            collection(db, 'users', currentUser.uid, 'beneficiaries')
        );

        const unsubscribeBeneficiaries = onSnapshot(qBeneficiaries, (snapshot) => {
            const benData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort client-side
            const sortedBen = benData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setBeneficiaries(sortedBen);
        }, (error) => {
            console.error("Error listening to beneficiaries:", error);
        });

        // Listen for Cards
        const qCards = query(
            collection(db, 'cards'),
            where('userId', '==', currentUser.uid)
        );

        const unsubscribeCards = onSnapshot(qCards, (snapshot) => {
            const cardData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCards(cardData);
        }, (error) => {
            console.error("Error listening to cards:", error);
        });

        // Listen for Card Requests
        const qCardRequests = query(
            collection(db, 'card_requests'),
            where('userId', '==', currentUser.uid)
        );

        const unsubscribeCardRequests = onSnapshot(qCardRequests, (snapshot) => {
            const reqData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCardRequests(reqData);
        }, (error) => {
            console.error("Error listening to card requests:", error);
        });

        // Listen for Loans
        const qLoans = query(
            collection(db, 'loans'),
            where('userId', '==', currentUser.uid)
        );

        const unsubscribeLoans = onSnapshot(qLoans, (snapshot) => {
            const loanData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort client-side to avoid index requirements
            const sortedLoans = loanData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setLoans(sortedLoans);
        }, (error) => {
            console.error("Error listening to loans:", error);
        });

        // Listen for RIBs
        const qRibs = query(
            collection(db, 'ribs'),
            where('userId', '==', currentUser.uid)
        );

        const unsubscribeRibs = onSnapshot(qRibs, (snapshot) => {
            const ribData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRibs(ribData);
        }, (error) => {
            console.error("Error listening to RIBs:", error);
        });

        // Listen for Account Requests
        const qAccountRequests = query(
            collection(db, 'account_requests'),
            where('userId', '==', currentUser.uid)
        );

        const unsubscribeAccountRequests = onSnapshot(qAccountRequests, (snapshot) => {
            const reqData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAccountRequests(reqData);
        });

        return () => {
            unsubscribeWallets();
            unsubscribeTransactions();
            unsubscribeKyc();
            unsubscribeBeneficiaries();
            unsubscribeCards();
            unsubscribeCardRequests();
            unsubscribeLoans();
            unsubscribeRibs();
            unsubscribeAccountRequests();
        };
    }, [currentUser]);

    const value = {
        wallets,
        transactions,
        kycStatus,
        beneficiaries,
        cards,
        cardRequests,
        loans,
        ribs,
        accountRequests,
        loading,
        // Helper getters
        getMainWallet: () => wallets.find(w => w.type === 'main'),
        getSavingsWallet: () => wallets.find(w => w.type === 'savings'),
        getTransactionsByType: (types) => transactions.filter(t =>
            Array.isArray(types) ? types.includes(t.type) : t.type === types
        )
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
