"use client"

import {useRouter} from "next/navigation"
import React, {ReactNode, useEffect, useState} from "react"
import {useCrudFormCreator} from "./form-creator"
import {setValueLocalStorage} from "@/utils/actions/local-starage"
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";

interface Props {
    formInputData: any[],
    incomingUrl: string,
    incomingModalTitle: string,
    viewUrl: string
    state_properties: any[]
    callBackFunction?: (selectedCard: string, id?: string) => void
    selectedViewCard?: string,
    emailNotificationBody?: any
    from?: string
    isApiV2?: boolean
    sliderComponent?: any
    isMaintainViewNavigationForV1?: boolean
    itHasCustomForm?: boolean
    customForm?: ReactNode;
    isShowAddPriceButton?: boolean,
    isFormData?: boolean
}

export const useCrudOperator = (
    {
        formInputData,
        incomingUrl,
        incomingModalTitle,
        viewUrl,
        state_properties,
        callBackFunction,
        isFormData,
        selectedViewCard,
        from,
        itHasCustomForm,
        sliderComponent,
        customForm,
        isShowAddPriceButton,
        emailNotificationBody: incomingEmailNotificationBody,
        isApiV2,
        isMaintainViewNavigationForV1
    }: Props
) => {
    const router = useRouter()
    const [selected, setSelected] = useState<any>()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [httpMethod, setHttpMethod] = useState('')
    const [onSaveButtonName, setOnSaveButtonName] = useState('save')
    const [url, setUrl] = useState(incomingUrl)
    const [modalTitle, setModalTitle] = useState(incomingModalTitle)
    const [modalBodyArray, setModalBodyArray] = useState<any[]>(formInputData)
    const [modalBodyString, setModalBodyString] = useState('')
    const [emailNotificationBody, setEmailNotificationBody] = useState(incomingEmailNotificationBody)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [isForm, setIsForm] = useState(true)
    const {state, dispatch} = useGlobalContextHook()
    const onCloseModal = () => setIsModalOpen(false)
    const [isSideOverOpened, setIsSideOverOpen] = useState(false)


    const formPayload: any = {
        isModalOpen: isModalOpen,
        onCloseModal: onCloseModal,
        from,
        url,
        httpMethod,
        modalTitle,
        modalBodyArray,
        modalBodyString,
        isButtonDisabled,
        isForm,
        onSaveButtonName,
        payloadForEdit: selected,
        state_properties: state_properties,
        emailNotificationBody: emailNotificationBody,
        itHasCustomForm: itHasCustomForm,
        customForm: customForm,
        isShowAddPriceButton,
        isFormData
    }

    const {
        createdForm,
        isStateChanged,
    } = useCrudFormCreator(formPayload)

    // TO DO bypass the
    const parseDate = (value: any) => {
        const dateArray = value.split('-')
        const newDate = `${dateArray[1]}-${dateArray[0]}-${dateArray[2]}`

        return value
    }

    const populateFormForEdit = (payload: any) => {

        console.log('form for edit', payload)
        const newModalBodyArray = modalBodyArray.map((item: any) => {
            let objKeyValue;

            // Parse dates for specific fields
            if (item.name === 'start_date' || item.name === 'end_date' || item.name === 'd_o_b') {
                objKeyValue = parseDate(payload[item.name]);
            } else {
                objKeyValue = payload[item.name];
            }

            // Maintain the 'value' while updating 'isRemoved' property for 'item_id'
            if (item.name === 'item_id' && Number(payload['resource_type_id']) === 29) {
                return {...item, isRemoved: false, value: objKeyValue};
            }

            // Maintain the 'value' while updating 'isRemoved' property for 'quantity'
            if (item.name === 'quantity' && Number(payload['resource_type_id']) === 29) {
                return {...item, isRemoved: false, value: objKeyValue};
            }

            // Maintain the 'value' while updating 'isRemoved' for 'personnel_id' when resource_type_id is 23
            if (item.name === 'personnel_id' && Number(payload['resource_type_id']) === 23) {
                return {...item, isRemoved: false, value: objKeyValue};
            }

            // Maintain the 'value' while updating 'isRemoved' for 'service_id' when resource_type_id is 30
            if (item.name === 'service_id' && Number(payload['resource_type_id']) === 30) {
                return {...item, isRemoved: false, value: objKeyValue};
            }
            if (item.name === 'amount') {

                const value = objKeyValue?.props?.amount

                return {...item, value};
            }

            // Return the new item with updated value
            return {...item, value: objKeyValue};
        });

        setModalBodyArray(newModalBodyArray);
    };

    const clearFormForCreate = () => {
        const newModalBodyArray = modalBodyArray.map((item: any) => {
            return {...item, value: ''};
        });

        setModalBodyArray(newModalBodyArray);
    };


    useEffect(() => {
        setModalBodyArray(formInputData)

    }, [...state_properties])

    const handleNotificationPayload = (type: string) => {
        if (emailNotificationBody && Object.keys(emailNotificationBody).length > 0) {
            const newEmailNotificationBody = {...emailNotificationBody, operation: type}
            setEmailNotificationBody(newEmailNotificationBody)
        }
    }

    const handleCloseSlideOver = () => {
        setIsSideOverOpen(!isSideOverOpened)
    }


    const handleClick = (type: string, payload?: any) => {
        const insertIdBeforeQueryParams = (url: string, id: string | number) => {
            const [baseUrl, queryParams] = url.split('?');
            return queryParams ? `${baseUrl}/${id}?${queryParams}` : `${baseUrl}/${id}`;
        };

        if (type.toLowerCase() === 'create') {
            setIsModalOpen(true);
            setModalTitle(`Create ${incomingModalTitle}`);
            setIsForm(true);
            setOnSaveButtonName('Save');
            setUrl(!isApiV2 ? `${incomingUrl}/store` : incomingUrl);
            setHttpMethod('post');
            clearFormForCreate()
            handleNotificationPayload('create');
        }

        if (type.toLowerCase() === 'add-price') {
            setIsModalOpen(true);
            setModalTitle(`Add Price to Item ${payload?.name}`);
            const newUrl = !isApiV2
                ? insertIdBeforeQueryParams(`${incomingUrl}/update`, payload?.id)
                : insertIdBeforeQueryParams(`${incomingUrl}/add-price`, payload?.id);
            setUrl(newUrl);
            setIsForm(true);
            setValueLocalStorage('add-price', 'add-price');
            setOnSaveButtonName('Save');
            setHttpMethod('post');
            handleNotificationPayload('create');
        }

        if (type.toLowerCase() === 'edit') {
            populateFormForEdit(payload);
            setIsModalOpen(true);
            setModalTitle(`Edit ${incomingModalTitle}`);
            setIsForm(true);
            setOnSaveButtonName('Update');
            setSelected(payload);
            const newUrl = !isApiV2
                ? insertIdBeforeQueryParams(`${incomingUrl}/update`, payload?.id)
                : insertIdBeforeQueryParams(incomingUrl, payload?.id);
            setUrl(newUrl);
            setHttpMethod('put');
            handleNotificationPayload('edit');
        }

        if (type.toLowerCase() === 'delete') {
            setIsModalOpen(true);
            const newUrl = !isApiV2
                ? insertIdBeforeQueryParams(`${incomingUrl}/delete`, payload?.id)
                : insertIdBeforeQueryParams(incomingUrl, payload?.id);
            setUrl(newUrl);
            setHttpMethod('delete');
            setModalTitle(`Delete ${incomingModalTitle}`);
            setIsForm(false);
            setOnSaveButtonName('Yes');
            setModalBodyString(`Are You Sure You Want to Delete this ${incomingModalTitle} ${payload.name ?? payload.formatted_code}`);
            handleNotificationPayload('delete');
        }

        if (type.toLowerCase() === 'show') {
            handleNotificationPayload('show');


            if (sliderComponent) {
                dispatch({
                    type: 'UPDATE_SLIDE_OVER_CONTENT',
                    payload: {
                        isOpen: true,
                        from_id: payload?.id,
                        sliderOverComponent: sliderComponent,
                    }
                })

                console.log('in sliderComponent')

                return
            }


            if (isApiV2 && !isMaintainViewNavigationForV1) {
                dispatch({type: 'SET_SUB_VIEW_ITEM', payload: {id: payload?.id, from}});
                setValueLocalStorage('sub_view_item', JSON.stringify({id: payload?.id, from}));
                return;
            }

            if (callBackFunction) {
                if (selectedViewCard === 'goal/show') {
                    callBackFunction('goal/show', payload?.id);
                } else if (selectedViewCard === 'outcome/show') {
                    callBackFunction('outcome/show', payload?.id);
                } else if (selectedViewCard === 'output/show') {
                    callBackFunction('output/show', payload?.id);
                } else if (selectedViewCard === 'activity/show') {
                    callBackFunction('activity/show', payload?.id);
                } else if (selectedViewCard === 'task/show') {
                    callBackFunction('task/show', payload?.id);
                }
            } else {
                const newUrl = insertIdBeforeQueryParams(`${viewUrl}`, payload?.id);
                router.push(newUrl);
                if (payload.has_parent) {
                    setValueLocalStorage('parent_id', payload.parent_id);
                }
            }
        }

        if (type.toLowerCase() === 'assign') {
            router.push(`roles/assign/${payload?.id}`);
        }
    };

    return {
        handleClick,
        createdForm,
        isStateChanged,
    }
}