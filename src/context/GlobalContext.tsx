"use client"

import { createContext, useReducer, ReactNode } from 'react';

interface PlanningCountProps {
    goals: number,
    outcomes: number,
    outputs: number,
    activities: number
    tasks: number
}

interface PlanningSelectedCardProps {
    selected?: string,
    selectedId?: string,
}

interface CurrentUserProps {
    first_name: string,
    last_name: string,
    email: string,
}

interface SelectedMonitoringItemProps {
    selected: string,
    expandedItem: string
}

interface evaluationForm {
    data: any[]
}

interface viewedItem {
    id: string,
    from: string
}

type State = {
    currentUser: CurrentUserProps | null;
    planningCount: PlanningCountProps;
    planningSelectedCard: PlanningSelectedCardProps;
    selectedMonitoringItem: SelectedMonitoringItemProps;
    evaluationForm: evaluationForm
    selectedSubSidebarItem: string
    viewedItem: viewedItem
};

type Action = {
    type: string;
    payload: any;
};

type Dispatch = (action: Action) => void;

const initialPlanningSelectedCard: PlanningSelectedCardProps = {
    selected: '',
    selectedId: '',
}

const initialPlanning: PlanningCountProps = {
    goals: 0,
    outcomes: 0,
    outputs: 0,
    activities: 0,
    tasks: 0
}

const initialSelectedMonitoringItem: SelectedMonitoringItemProps = {
    selected: '',
    expandedItem: '',
}

const initialViewedItem: viewedItem = {
    id: '',
    from: ''
}


const initialEvaluationForm: evaluationForm = {
    data: [],
}

const initialState: State = {
    currentUser: null,
    planningCount: initialPlanning,
    planningSelectedCard: initialPlanningSelectedCard,
    selectedMonitoringItem: initialSelectedMonitoringItem,
    evaluationForm: initialEvaluationForm,
    selectedSubSidebarItem: '',
    viewedItem: initialViewedItem

};

export const GlobalContext = createContext<{ state: State; dispatch: Dispatch }>({
    state: initialState,
    dispatch: () => { }
});

export const updateContextReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.payload
            };

        case 'UPDATE_PLANNING_PAYLOAD':
            let newPlanningState: any;

            if (action.payload.for === 'goals') {
                newPlanningState = { ...state.planningCount, goals: action.payload.value }
            }

            if (action.payload.for === 'outcomes') {
                newPlanningState = { ...state.planningCount, outcomes: action.payload.value }
            }

            if (action.payload.for === 'outputs') {
                newPlanningState = { ...state.planningCount, outputs: action.payload.value }
            }

            if (action.payload.for === 'activities') {
                newPlanningState = { ...state.planningCount, activities: action.payload.value }
            }

            if (action.payload.for === 'tasks') {
                newPlanningState = { ...state.planningCount, tasks: action.payload.value }
            }
            return {
                ...state,
                planningCount: newPlanningState
            }

        case 'UPDATE_PLANNING_SELECTED_CARD':
            let newPlanningSelectedCardState: any;

            if (action.payload.for === 'selected') {
                newPlanningSelectedCardState = { ...state.planningSelectedCard, selected: action.payload.value }
            }

            if (action.payload.for === 'selectedId') {
                newPlanningSelectedCardState = { ...state.planningSelectedCard, selectedId: action.payload.value }
            }

            return {
                ...state,
                planningSelectedCard: newPlanningSelectedCardState
            };

        case 'UPDATE_SELECTED_MONITORING_ITEM':
            let newMonitoringState: any

            if (action.payload.for === 'selected') {
                newMonitoringState = { ...state.selectedMonitoringItem, selected: action.payload.value }
            }

            if (action.payload.for === 'expanded') {
                newMonitoringState = { ...state.selectedMonitoringItem, expandedItem: action.payload.value }
            }

            return {
                ...state,
                selectedMonitoringItem: newMonitoringState
            };
        case 'UPDATE_EVALUATION_FORM':
            // Assume action.payload contains the object with an 'id' to be updated and new values

            return {
                ...state,
                evaluationForm: {
                    ...state.evaluationForm,
                    data: action.payload,
                },
            };
        case 'SET_SUB_SIDEBAR_ITEM':
            return {
                ...state,
                selectedSubSidebarItem: action.payload
            };
        case 'SET_SUB_VIEW_ITEM':
            return {
                ...state,
                viewedItem: action.payload
            };
        default:
            return state;
    }
};

type Props = {
    children: ReactNode;
};

export const GlobalContextProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(updateContextReducer, initialState);
    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
};