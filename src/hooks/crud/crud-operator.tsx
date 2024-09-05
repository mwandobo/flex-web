"use client"

import {useRouter} from "next/navigation"
import {useEffect, useState} from "react"
import {useCrudFormCreator} from "./form-creator"
import {setValueLocalStorage} from "@/utils/actions/local-starage"

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
}

export const useCrudOperator = (
    {
        formInputData,
        incomingUrl,
        incomingModalTitle,
        viewUrl,
        state_properties,
        callBackFunction,
        selectedViewCard,
        from,
        emailNotificationBody: incomingEmailNotificationBody,
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
    const onCloseModal = () => setIsModalOpen(false)

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
        emailNotificationBody: emailNotificationBody
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
        const newModalBodyArray = modalBodyArray.map((item: any) => {
            let objKeyValue;

            if (item.name === 'start_date') {
                objKeyValue = parseDate(payload[item.name])
            } else if (item.name === 'end_date') {
                objKeyValue = parseDate(payload[item.name])
            } else if (item.name === 'd_o_b') {
                objKeyValue = parseDate(payload[item.name])
            } else {
                objKeyValue = payload[item.name]
            }

            const newItemObj = {...item, value: objKeyValue}
            return newItemObj
        })

        setModalBodyArray(newModalBodyArray)
    }


    useEffect(() => {
        setModalBodyArray(formInputData)

    }, [...state_properties])


    const handleNotificationPayload = (type: string) => {
        if (emailNotificationBody && Object.keys(emailNotificationBody).length > 0) {
            const newEmailNotificationBody = {...emailNotificationBody, operation: type}
            setEmailNotificationBody(newEmailNotificationBody)
        }
    }

    const handleClick = (type: string, payload?: any) => {
        if (type.toLowerCase() === 'create') {
            setIsModalOpen(true)
            setModalTitle(`Create ${incomingModalTitle}`)
            setIsForm(true)
            setOnSaveButtonName('Save')
            setUrl(`${incomingUrl}/store`)
            setHttpMethod('post')
            handleNotificationPayload('create')
        }

        if (type.toLowerCase() === 'edit') {
            populateFormForEdit(payload)
            setIsModalOpen(true)
            setModalTitle(`Edit ${incomingModalTitle}`)
            setIsForm(true)
            setOnSaveButtonName('Save')
            setSelected(payload)
            setUrl(`${incomingUrl}/update/${payload?.id}`)
            setHttpMethod('put')
            handleNotificationPayload('edit')
        }

        if (type.toLowerCase() === 'delete') {
            setIsModalOpen(true)
            setUrl(`${incomingUrl}/delete/${payload?.id}`)
            setHttpMethod('delete')
            setModalTitle(`Delete ${incomingModalTitle}`)
            setIsForm(false)
            setOnSaveButtonName('Yes')
            setModalBodyString(`Are You Sure You Want to Delete this ${incomingModalTitle} ${payload.name}`)
            handleNotificationPayload('delete')
        }

        if (type.toLowerCase() === 'show') {
            handleNotificationPayload("show")

            if (callBackFunction) {

                if (selectedViewCard === 'goal/show') {
                    callBackFunction('goal/show', payload?.id)
                } else if (selectedViewCard === 'outcome/show') {
                    callBackFunction('outcome/show', payload?.id)
                } else if (selectedViewCard === 'output/show') {
                    callBackFunction('output/show', payload?.id)
                } else if (selectedViewCard === 'activity/show') {
                    callBackFunction('activity/show', payload?.id)
                } else if (selectedViewCard === 'task/show') {
                    callBackFunction('task/show', payload?.id)
                }
            } else {
                router.push(`${viewUrl}${payload?.id}`)
                if (payload.has_parent) {
                    setValueLocalStorage('parent_id', payload.parent_id)
                }
            }
        }

        if (type.toLowerCase() === 'assign') {
            router.push(`roles/assign/${payload?.id}`)
        }
    }

    return {
        handleClick,
        createdForm,
        isStateChanged
    }
}