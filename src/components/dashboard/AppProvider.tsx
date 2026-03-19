'use client';

import { useReducer, useEffect } from 'react';
import { AppContext, appReducer, initialState } from '@/lib/store';
import { DEMO_USER, DEMO_CARDS, DEMO_LINKS } from '@/lib/mock-data';

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Initialize with demo data
    dispatch({ type: 'SET_USER', payload: DEMO_USER });
    dispatch({ type: 'SET_CARDS', payload: DEMO_CARDS });
    dispatch({ type: 'SET_CURRENT_CARD', payload: DEMO_CARDS[0] });
    dispatch({ type: 'SET_LINKS', payload: DEMO_LINKS });
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
