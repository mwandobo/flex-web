"use client"

import {createContext, useReducer, ReactNode} from 'react';
import {setValueLocalStorage} from "@/utils/actions/local-starage";
import SlideOverComponent from "@/components/slide-over/slide-over.component";

interface CurrentUserProps {
    first_name: string,
    last_name: string,
    email: string,
}

interface evaluationForm {
    data: any[]
}

interface viewedItem {
    id: string,
    from: string
}

interface notificationBody {
    count: string,
    notifications: any
}

interface slideOverContent {
    isOpen: boolean,
    sliderOverTitle: string
    sliderOverComponent: any
    from_id: string
}

type State = {
    currentUser: CurrentUserProps | null;
    evaluationForm
    selectedSubSidebarItem: string
    inEvaluation: boolean
    hideSideBar: boolean
    viewItemRefreshAfterApproval: boolean
    viewedItem
    notificationBody
    slideOverContent
};

type Action = {
    type: string;
    payload?: any;
};

type Dispatch = (action: Action) => void;

const initialViewedItem: viewedItem = {
    id: '',
    from: ''
}

const initialNotificationBody: notificationBody = {
    count: '0',
    notifications: []
}

const initialSlideOverContent: slideOverContent = {
    isOpen: false,
    sliderOverTitle: '',
    from_id: '',
    sliderOverComponent: () => ''
}


const initialEvaluationForm: evaluationForm = {
    data: [],
}

const initialState: State = {
    currentUser: null,
    evaluationForm: initialEvaluationForm,
    selectedSubSidebarItem: '',
    viewItemRefreshAfterApproval: false,
    viewedItem: initialViewedItem,
    notificationBody: initialNotificationBody,
    inEvaluation: false,
    hideSideBar: true,
    slideOverContent: initialSlideOverContent
};

export const GlobalContext = createContext<{ state: State; dispatch: Dispatch }>({
    state: initialState,
    dispatch: () => {
    }
});

export const updateContextReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.payload
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
        case 'UPDATE_VIEW_ITEM_REFRESH_AFTER_APPROVAL':
            return {
                ...state,
                viewItemRefreshAfterApproval: !state.viewItemRefreshAfterApproval
            };
        case 'UPDATE_IN_EVALUATION':
            setValueLocalStorage('inEvaluation', action.payload)

            return {
                ...state,
                inEvaluation: action.payload
            };
        case 'UPDATE_HIDE_SIDEBAR':
            return {
                ...state,
                hideSideBar: action.payload
            };
        case 'UPDATE_NOTIFICATION_BODY':
            return {
                ...state,
                notificationBody: action.payload
            };
        case 'UPDATE_SLIDE_OVER_CONTENT':
            return {
                ...state,
                slideOverContent: action.payload
            };
        default:
            return state;
    }
};

type Props = {
    children: ReactNode;
};

export const GlobalContextProvider = ({children}: Props) => {
    const [state, dispatch] = useReducer(updateContextReducer, initialState);
    return (
        <GlobalContext.Provider value={{state, dispatch}}>
            {children}
        </GlobalContext.Provider>
    );
};