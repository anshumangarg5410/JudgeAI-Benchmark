import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import { modelsApi, runsApi } from '../services/api';

const AppContext = createContext(null);

// ── Action Types ──
const ACTIONS = {
  SET_MODELS: 'SET_MODELS',
  ADD_MODEL: 'ADD_MODEL',
  REMOVE_MODEL: 'REMOVE_MODEL',
  SET_RUNS: 'SET_RUNS',
  ADD_RUN: 'ADD_RUN',
  SET_LAST_RESULTS: 'SET_LAST_RESULTS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

const initialState = {
  models: [],
  runs: [],
  lastResults: null,   // { df, summary, baseModel, ftModel }
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_MODELS:
      return { ...state, models: action.payload };
    case ACTIONS.ADD_MODEL:
      return { ...state, models: [...state.models, action.payload] };
    case ACTIONS.REMOVE_MODEL:
      return { ...state, models: state.models.filter((m) => m.id !== action.payload) };
    case ACTIONS.SET_RUNS:
      return { ...state, runs: action.payload };
    case ACTIONS.ADD_RUN:
      return { ...state, runs: [...state.runs, action.payload] };
    case ACTIONS.SET_LAST_RESULTS:
      return { ...state, lastResults: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch models and runs on mount
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      try {
        const [models, runs] = await Promise.all([
          modelsApi.getAll(),
          runsApi.getAll(),
        ]);
        dispatch({ type: ACTIONS.SET_MODELS, payload: models });
        dispatch({ type: ACTIONS.SET_RUNS, payload: runs });
      } catch (err) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    };
    fetchData();
  }, []);

  const addModel = useCallback(async (model) => {
    const created = await modelsApi.create(model);
    dispatch({ type: ACTIONS.ADD_MODEL, payload: created });
    return created;
  }, []);

  const removeModel = useCallback(async (id) => {
    await modelsApi.delete(id);
    dispatch({ type: ACTIONS.REMOVE_MODEL, payload: id });
  }, []);

  const addRun = useCallback(async (run) => {
    const created = await runsApi.create(run);
    dispatch({ type: ACTIONS.ADD_RUN, payload: created });
    return created;
  }, []);

  const setLastResults = useCallback((results) => {
    dispatch({ type: ACTIONS.SET_LAST_RESULTS, payload: results });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    ...state,
    addModel,
    removeModel,
    addRun,
    setLastResults,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}

export default AppContext;
