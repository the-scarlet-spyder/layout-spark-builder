
import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';

export interface GridElement {
  id: string;
  type: 'text' | 'button' | 'rectangle' | 'circle' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  visible: boolean;
  locked: boolean;
  parentId?: string;
  name: string;
  props: {
    // Appearance
    backgroundColor?: string;
    backgroundImage?: string;
    border?: {
      width: number;
      style: 'solid' | 'dashed' | 'dotted';
      color: string;
      radius: number;
    };
    shadow?: {
      x: number;
      y: number;
      blur: number;
      spread: number;
      color: string;
    };
    opacity: number;
    
    // Typography (for text elements)
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: number | string;
    lineHeight?: number;
    letterSpacing?: number;
    textColor?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textDecoration?: 'none' | 'underline' | 'line-through';
    
    // Layout
    padding?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    margin?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    
    // Interactive
    href?: string;
    onClick?: string;
    
    // Media
    src?: string;
    alt?: string;
  };
}

export interface CanvasFrame {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
}

export interface CanvasPage {
  id: string;
  name: string;
  frame: CanvasFrame;
  elements: GridElement[];
}

export interface CanvasProject {
  id: string;
  name: string;
  pages: CanvasPage[];
  currentPageId: string;
}

export interface CanvasState {
  project: CanvasProject;
  selectedElementIds: string[];
  clipboardElements: GridElement[];
  zoom: number;
  pan: { x: number; y: number };
  showGrid: boolean;
  gridSize: number;
  snapToGrid: boolean;
  snapToElements: boolean;
}

export interface HistoryState {
  past: CanvasState[];
  present: CanvasState;
  future: CanvasState[];
}

type CanvasAction = 
  | { type: 'ADD_ELEMENT'; payload: { element: GridElement } }
  | { type: 'UPDATE_ELEMENT'; payload: { id: string; updates: Partial<GridElement> } }
  | { type: 'DELETE_ELEMENTS'; payload: { ids: string[] } }
  | { type: 'SELECT_ELEMENTS'; payload: { ids: string[] } }
  | { type: 'MOVE_ELEMENTS'; payload: { ids: string[]; deltaX: number; deltaY: number } }
  | { type: 'RESIZE_ELEMENT'; payload: { id: string; width: number; height: number } }
  | { type: 'REORDER_ELEMENTS'; payload: { ids: string[]; newZIndex: number } }
  | { type: 'COPY_ELEMENTS'; payload: { ids: string[] } }
  | { type: 'PASTE_ELEMENTS'; payload: { x?: number; y?: number } }
  | { type: 'UPDATE_FRAME'; payload: { updates: Partial<CanvasFrame> } }
  | { type: 'SET_ZOOM'; payload: { zoom: number } }
  | { type: 'SET_PAN'; payload: { pan: { x: number; y: number } } }
  | { type: 'TOGGLE_GRID'; payload?: undefined }
  | { type: 'SET_GRID_SIZE'; payload: { size: number } }
  | { type: 'TOGGLE_SNAP_TO_GRID'; payload?: undefined }
  | { type: 'TOGGLE_SNAP_TO_ELEMENTS'; payload?: undefined }
  | { type: 'UNDO'; payload?: undefined }
  | { type: 'REDO'; payload?: undefined };

const MAX_HISTORY_SIZE = 100;

const createInitialState = (): CanvasState => ({
  project: {
    id: 'default',
    name: 'Untitled Project',
    currentPageId: 'page-1',
    pages: [{
      id: 'page-1',
      name: 'Page 1',
      frame: {
        id: 'frame-1',
        name: 'Desktop Frame',
        width: 1200,
        height: 800,
        backgroundColor: '#ffffff'
      },
      elements: []
    }]
  },
  selectedElementIds: [],
  clipboardElements: [],
  zoom: 100,
  pan: { x: 0, y: 0 },
  showGrid: false,
  gridSize: 20,
  snapToGrid: true,
  snapToElements: true
});

const canvasReducer = (state: CanvasState, action: CanvasAction): CanvasState => {
  const currentPage = state.project.pages.find(p => p.id === state.project.currentPageId)!;
  
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const newElement = action.payload.element;
      const updatedElements = [...currentPage.elements, newElement];
      
      return {
        ...state,
        project: {
          ...state.project,
          pages: state.project.pages.map(page => 
            page.id === state.project.currentPageId
              ? { ...page, elements: updatedElements }
              : page
          )
        },
        selectedElementIds: [newElement.id]
      };
    }
    
    case 'UPDATE_ELEMENT': {
      const { id, updates } = action.payload;
      const updatedElements = currentPage.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      );
      
      return {
        ...state,
        project: {
          ...state.project,
          pages: state.project.pages.map(page => 
            page.id === state.project.currentPageId
              ? { ...page, elements: updatedElements }
              : page
          )
        }
      };
    }
    
    case 'DELETE_ELEMENTS': {
      const { ids } = action.payload;
      const updatedElements = currentPage.elements.filter(el => !ids.includes(el.id));
      
      return {
        ...state,
        project: {
          ...state.project,
          pages: state.project.pages.map(page => 
            page.id === state.project.currentPageId
              ? { ...page, elements: updatedElements }
              : page
          )
        },
        selectedElementIds: state.selectedElementIds.filter(id => !ids.includes(id))
      };
    }
    
    case 'SELECT_ELEMENTS': {
      return {
        ...state,
        selectedElementIds: action.payload.ids
      };
    }
    
    case 'MOVE_ELEMENTS': {
      const { ids, deltaX, deltaY } = action.payload;
      const updatedElements = currentPage.elements.map(el => 
        ids.includes(el.id) 
          ? { ...el, x: Math.max(0, el.x + deltaX), y: Math.max(0, el.y + deltaY) }
          : el
      );
      
      return {
        ...state,
        project: {
          ...state.project,
          pages: state.project.pages.map(page => 
            page.id === state.project.currentPageId
              ? { ...page, elements: updatedElements }
              : page
          )
        }
      };
    }
    
    case 'COPY_ELEMENTS': {
      const { ids } = action.payload;
      const elementsToCopy = currentPage.elements.filter(el => ids.includes(el.id));
      
      return {
        ...state,
        clipboardElements: elementsToCopy
      };
    }
    
    case 'PASTE_ELEMENTS': {
      const { x = 50, y = 50 } = action.payload;
      const newElements = state.clipboardElements.map((el, index) => ({
        ...el,
        id: `${el.id}-copy-${Date.now()}-${index}`,
        x: x + (index * 20),
        y: y + (index * 20),
        zIndex: Math.max(...currentPage.elements.map(e => e.zIndex), 0) + index + 1
      }));
      
      const updatedElements = [...currentPage.elements, ...newElements];
      
      return {
        ...state,
        project: {
          ...state.project,
          pages: state.project.pages.map(page => 
            page.id === state.project.currentPageId
              ? { ...page, elements: updatedElements }
              : page
          )
        },
        selectedElementIds: newElements.map(el => el.id)
      };
    }
    
    case 'UPDATE_FRAME': {
      return {
        ...state,
        project: {
          ...state.project,
          pages: state.project.pages.map(page => 
            page.id === state.project.currentPageId
              ? { ...page, frame: { ...page.frame, ...action.payload.updates } }
              : page
          )
        }
      };
    }
    
    case 'SET_ZOOM': {
      return { ...state, zoom: Math.max(25, Math.min(400, action.payload.zoom)) };
    }
    
    case 'SET_PAN': {
      return { ...state, pan: action.payload.pan };
    }
    
    case 'TOGGLE_GRID': {
      return { ...state, showGrid: !state.showGrid };
    }
    
    case 'SET_GRID_SIZE': {
      return { ...state, gridSize: action.payload.size };
    }
    
    case 'TOGGLE_SNAP_TO_GRID': {
      return { ...state, snapToGrid: !state.snapToGrid };
    }
    
    case 'TOGGLE_SNAP_TO_ELEMENTS': {
      return { ...state, snapToElements: !state.snapToElements };
    }
    
    default:
      return state;
  }
};

const historyReducer = (state: HistoryState, action: CanvasAction): HistoryState => {
  switch (action.type) {
    case 'UNDO': {
      if (state.past.length === 0) return state;
      
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future].slice(0, MAX_HISTORY_SIZE)
      };
    }
    
    case 'REDO': {
      if (state.future.length === 0) return state;
      
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      
      return {
        past: [...state.past, state.present].slice(-MAX_HISTORY_SIZE),
        present: next,
        future: newFuture
      };
    }
    
    default: {
      // For actions that should be tracked in history
      if (['ADD_ELEMENT', 'UPDATE_ELEMENT', 'DELETE_ELEMENTS', 'MOVE_ELEMENTS', 'PASTE_ELEMENTS'].includes(action.type)) {
        const newPresent = canvasReducer(state.present, action);
        
        return {
          past: [...state.past, state.present].slice(-MAX_HISTORY_SIZE),
          present: newPresent,
          future: []
        };
      }
      
      // For actions that shouldn't be tracked in history (like selection, zoom, pan)
      return {
        ...state,
        present: canvasReducer(state.present, action)
      };
    }
  }
};

interface CanvasContextType {
  state: CanvasState;
  dispatch: React.Dispatch<CanvasAction>;
  canUndo: boolean;
  canRedo: boolean;
  
  // Helper functions
  addElement: (element: Omit<GridElement, 'id' | 'zIndex'>) => void;
  updateElement: (id: string, updates: Partial<GridElement>) => void;
  deleteSelectedElements: () => void;
  selectElements: (ids: string[]) => void;
  moveSelectedElements: (deltaX: number, deltaY: number) => void;
  copySelectedElements: () => void;
  pasteElements: (x?: number, y?: number) => void;
  undo: () => void;
  redo: () => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [historyState, dispatch] = useReducer(historyReducer, {
    past: [],
    present: createInitialState(),
    future: []
  });
  
  const state = historyState.present;
  const canUndo = historyState.past.length > 0;
  const canRedo = historyState.future.length > 0;
  
  // Helper functions
  const addElement = useCallback((element: Omit<GridElement, 'id' | 'zIndex'>) => {
    const currentPage = state.project.pages.find(p => p.id === state.project.currentPageId)!;
    const maxZIndex = Math.max(...currentPage.elements.map(el => el.zIndex), 0);
    
    const newElement: GridElement = {
      ...element,
      id: `element-${Date.now()}`,
      zIndex: maxZIndex + 1
    };
    
    dispatch({ type: 'ADD_ELEMENT', payload: { element: newElement } });
  }, [state.project]);
  
  const updateElement = useCallback((id: string, updates: Partial<GridElement>) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } });
  }, []);
  
  const deleteSelectedElements = useCallback(() => {
    if (state.selectedElementIds.length > 0) {
      dispatch({ type: 'DELETE_ELEMENTS', payload: { ids: state.selectedElementIds } });
    }
  }, [state.selectedElementIds]);
  
  const selectElements = useCallback((ids: string[]) => {
    dispatch({ type: 'SELECT_ELEMENTS', payload: { ids } });
  }, []);
  
  const moveSelectedElements = useCallback((deltaX: number, deltaY: number) => {
    if (state.selectedElementIds.length > 0) {
      dispatch({ type: 'MOVE_ELEMENTS', payload: { ids: state.selectedElementIds, deltaX, deltaY } });
    }
  }, [state.selectedElementIds]);
  
  const copySelectedElements = useCallback(() => {
    if (state.selectedElementIds.length > 0) {
      dispatch({ type: 'COPY_ELEMENTS', payload: { ids: state.selectedElementIds } });
    }
  }, [state.selectedElementIds]);
  
  const pasteElements = useCallback((x?: number, y?: number) => {
    if (state.clipboardElements.length > 0) {
      dispatch({ type: 'PASTE_ELEMENTS', payload: { x, y } });
    }
  }, [state.clipboardElements]);
  
  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);
  
  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);
  
  const value: CanvasContextType = {
    state,
    dispatch,
    canUndo,
    canRedo,
    addElement,
    updateElement,
    deleteSelectedElements,
    selectElements,
    moveSelectedElements,
    copySelectedElements,
    pasteElements,
    undo,
    redo
  };
  
  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};
