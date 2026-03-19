'use client';

import { createContext, useContext } from 'react';
import type { Card, CardLink, User } from '@/types';

export interface AppState {
  user: User | null;
  cards: Card[];
  currentCard: Card | null;
  links: CardLink[];
  loading: boolean;
}

export const initialState: AppState = {
  user: null,
  cards: [],
  currentCard: null,
  links: [],
  loading: true,
};

export type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CARDS'; payload: Card[] }
  | { type: 'SET_CURRENT_CARD'; payload: Card | null }
  | { type: 'SET_LINKS'; payload: CardLink[] }
  | { type: 'ADD_CARD'; payload: Card }
  | { type: 'UPDATE_CARD'; payload: Card }
  | { type: 'DELETE_CARD'; payload: string }
  | { type: 'ADD_LINK'; payload: CardLink }
  | { type: 'UPDATE_LINK'; payload: CardLink }
  | { type: 'DELETE_LINK'; payload: string }
  | { type: 'REORDER_LINKS'; payload: CardLink[] }
  | { type: 'SET_LOADING'; payload: boolean };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CARDS':
      return { ...state, cards: action.payload };
    case 'SET_CURRENT_CARD':
      return { ...state, currentCard: action.payload };
    case 'SET_LINKS':
      return { ...state, links: action.payload };
    case 'ADD_CARD':
      return { ...state, cards: [...state.cards, action.payload] };
    case 'UPDATE_CARD':
      return {
        ...state,
        cards: state.cards.map(c => c.id === action.payload.id ? action.payload : c),
        currentCard: state.currentCard?.id === action.payload.id ? action.payload : state.currentCard,
      };
    case 'DELETE_CARD':
      return {
        ...state,
        cards: state.cards.filter(c => c.id !== action.payload),
        currentCard: state.currentCard?.id === action.payload ? null : state.currentCard,
      };
    case 'ADD_LINK':
      return { ...state, links: [...state.links, action.payload] };
    case 'UPDATE_LINK':
      return { ...state, links: state.links.map(l => l.id === action.payload.id ? action.payload : l) };
    case 'DELETE_LINK':
      return { ...state, links: state.links.filter(l => l.id !== action.payload) };
    case 'REORDER_LINKS':
      return { ...state, links: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => null,
});

export const useApp = () => useContext(AppContext);
