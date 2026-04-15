'use client';

import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import type { AppState, Authorization, ActivityItem, Transaction } from './types';
import {
  MOCK_WALLET,
  MOCK_AUTHORIZATIONS,
  MOCK_SUBSCRIPTIONS,
  MOCK_API_USAGE,
  MOCK_TRANSACTIONS,
  MOCK_ACTIVITY,
  MOCK_SPENDING_DATA,
} from './mockData';

type Action =
  | { type: 'CONNECT_WALLET' }
  | { type: 'DISCONNECT_WALLET' }
  | { type: 'ADD_AUTHORIZATION'; payload: Authorization }
  | { type: 'UPDATE_AUTH_STATUS'; id: string; status: Authorization['status'] }
  | { type: 'TOGGLE_SUBSCRIPTION'; id: string }
  | { type: 'CANCEL_SUBSCRIPTION'; id: string }
  | { type: 'SIMULATE_API_CALL'; merchantId: string }
  | { type: 'ADD_ACTIVITY'; payload: ActivityItem }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'TOGGLE_DEMO_MODE' }
  | { type: 'COMPLETE_ONBOARDING' };

const initialState: AppState = {
  walletConnected: false,
  walletAddress: MOCK_WALLET,
  balance: 1842.50,
  authorizations: MOCK_AUTHORIZATIONS,
  subscriptions: MOCK_SUBSCRIPTIONS,
  apiUsage: MOCK_API_USAGE,
  transactions: MOCK_TRANSACTIONS,
  activity: MOCK_ACTIVITY,
  spendingData: MOCK_SPENDING_DATA,
  demoMode: false,
  onboardingDone: false,
  monthlySpend: 67.43,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'CONNECT_WALLET':
      return { ...state, walletConnected: true };
    case 'DISCONNECT_WALLET':
      return { ...state, walletConnected: false };

    case 'ADD_AUTHORIZATION': {
      const newAuth = action.payload;
      return {
        ...state,
        authorizations: [newAuth, ...state.authorizations],
        activity: [
          {
            id: `act_${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'authorization',
            message: `New authorization created for ${newAuth.merchant}`,
            merchant: newAuth.merchant,
            merchantIcon: newAuth.merchant[0].toUpperCase(),
          },
          ...state.activity,
        ],
      };
    }

    case 'UPDATE_AUTH_STATUS':
      return {
        ...state,
        authorizations: state.authorizations.map((a) =>
          a.id === action.id ? { ...a, status: action.status } : a
        ),
      };

    case 'TOGGLE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.map((s) =>
          s.id === action.id
            ? { ...s, status: s.status === 'active' ? 'paused' : 'active' }
            : s
        ),
      };

    case 'CANCEL_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.map((s) =>
          s.id === action.id ? { ...s, status: 'cancelled' } : s
        ),
      };

    case 'SIMULATE_API_CALL': {
      const cost = 0.00005;
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        date: new Date().toISOString(),
        merchant: 'OpenAI API',
        type: 'api',
        amount: cost,
        status: 'confirmed',
        signature: Math.random().toString(36).substring(2, 50),
      };
      const newActivity: ActivityItem = {
        id: `act_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'api_call',
        message: `Charged $${cost.toFixed(5)} for API call`,
        amount: cost,
        merchant: 'OpenAI API',
        merchantIcon: 'O',
      };
      return {
        ...state,
        balance: parseFloat((state.balance - cost).toFixed(5)),
        monthlySpend: parseFloat((state.monthlySpend + cost).toFixed(5)),
        apiUsage: state.apiUsage.map((u) =>
          u.merchantId === 'auth_1'
            ? {
                ...u,
                totalRequests: u.totalRequests + 1,
                requestsThisMonth: u.requestsThisMonth + 1,
                totalCost: parseFloat((u.totalCost + cost).toFixed(5)),
              }
            : u
        ),
        transactions: [newTx, ...state.transactions],
        activity: [newActivity, ...state.activity],
      };
    }

    case 'ADD_ACTIVITY':
      return { ...state, activity: [action.payload, ...state.activity] };

    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };

    case 'TOGGLE_DEMO_MODE':
      return { ...state, demoMode: !state.demoMode };

    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingDone: true };

    default:
      return state;
  }
}

interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const demoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.demoMode) {
      demoIntervalRef.current = setInterval(() => {
        dispatch({ type: 'SIMULATE_API_CALL', merchantId: 'auth_1' });
      }, 3000);
    } else {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
        demoIntervalRef.current = null;
      }
    }
    return () => {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    };
  }, [state.demoMode]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
