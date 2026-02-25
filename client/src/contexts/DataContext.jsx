import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import {
    collection,
    query,
    where,
    onSnapshot,
    doc
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const initialState = {
    wallets: [],
    transactions: [],
    kycStatus: null,
    beneficiaries: [],
    cards: [],
    cardRequests: [],
    loans: [],
    ribs: [],
    accountRequests: [],
    loading: true
};

function dataReducer(state, action) {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, [action.field]: action.value, loading: action.field === 'wallets' ? false : state.loading };
        case 'SET_MULTIPLE':
            return { ...state, ...action.payload };
        case 'RESET':
            return { ...initialState, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: action.value };
        default:
            return state;
    }
}

export const DataProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [state, dispatch] = React.useReducer(dataReducer, initialState);

    useEffect(() => {
        if (!currentUser) {
            dispatch({ type: 'RESET' });
            return;
        }

        dispatch({ type: 'SET_LOADING', value: true });

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
            dispatch({ type: 'SET_DATA', field: 'wallets', value: walletData });
        }, (error) => {
            console.error("Error listening to wallets:", error);
            dispatch({ type: 'SET_LOADING', value: false });
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
            const sortedTx = txData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            dispatch({ type: 'SET_DATA', field: 'transactions', value: sortedTx });
        });

        // Listen for KYC Status
        const unsubscribeKyc = onSnapshot(doc(db, 'kyc', currentUser.uid), (snapshot) => {
            if (snapshot.exists()) {
                dispatch({ type: 'SET_DATA', field: 'kycStatus', value: { id: snapshot.id, ...snapshot.data() } });
            } else {
                dispatch({ type: 'SET_DATA', field: 'kycStatus', value: { status: 'not_started' } });
            }
        }, (err) => {
            console.error("Error listening to KYC:", err);
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
            const sortedBen = benData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            dispatch({ type: 'SET_DATA', field: 'beneficiaries', value: sortedBen });
        }, (err) => {
            console.error("Error listening to beneficiaries:", err);
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
            dispatch({ type: 'SET_DATA', field: 'cards', value: cardData });
        }, (err) => {
            console.error("Error listening to cards:", err);
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
            dispatch({ type: 'SET_DATA', field: 'cardRequests', value: reqData });
        }, (err) => {
            console.error("Error listening to card requests:", err);
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
            const sortedLoans = loanData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            dispatch({ type: 'SET_DATA', field: 'loans', value: sortedLoans });
        }, (err) => {
            console.error("Error listening to loans:", err);
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
            dispatch({ type: 'SET_DATA', field: 'ribs', value: ribData });
        }, (err) => {
            console.error("Error listening to RIBs:", err);
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
            dispatch({ type: 'SET_DATA', field: 'accountRequests', value: reqData });
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
        ...state,
        // Helper getters
        getMainWallet: () => state.wallets.find(w => w.type === 'main'),
        getSavingsWallet: () => state.wallets.find(w => w.type === 'savings'),
        getTransactionsByType: (types) => state.transactions.filter(t =>
            Array.isArray(types) ? types.includes(t.type) : t.type === types
        )
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
