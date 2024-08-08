import { ReusableButton } from "@/components/button/reusable-button"
import MuiDate from "@/components/inputs/mui-date"
import MuiRadioButtonsGroup from "@/components/inputs/mui-radio"
import MuiSelect from "@/components/inputs/mui-select"
import TextArea from "@/components/inputs/text-area"
import TextFieldComponent from "@/components/inputs/text-field"
import PopupModal from "@/components/modal/popup-modal"
import { getValueFromLocalStorage } from "@/utils/actions/local-starage"
import { send_email } from "@/utils/actions/send-email"
import { post, put, remove } from "@/utils/api"
import { CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
interface Props {
    isModalOpen: boolean
    onCloseModal: () => void
    onSaveButtonName?: string
    modalTitle: string
    url: string
    httpMethod: string
    from: string
    modalBodyArray?: any[]
    modalBodyString?: string
    isButtonDisabled?: boolean
    isForm?: boolean
    state_properties: any[]
    isMultipart?: boolean,
    emailNotificationBody?: any
}

export const useCrudFormCreator = ({
    isModalOpen,
    onCloseModal,
    onSaveButtonName = 'save',
    modalTitle,
    url,
    httpMethod,
    modalBodyArray,
    modalBodyString,
    isButtonDisabled,
    isForm,
    state_properties = [],
    emailNotificationBody
}: Props) => {
    const createPayload = (body: any[]) => {
        const payload: any = {};
        body?.forEach((input) => {
            if (!input.isRemoved) {
                payload[input?.name] = input?.value;
            }
        });

        return payload
    };

    const createFormInputs = (clear?: string) => {
        let payload: any[] = [];
        modalBodyArray?.forEach((input) => {
            // if (!input.isRemoved) {
            payload = [...payload, input];
            // }
        });

        return payload
    };

    const [isDisabled, setIsDisabled] = useState(false)
    const [isStateChanged, setIsStateChanged] = useState(false)
    const [formData, setFormData] = useState<any>(createPayload(modalBodyArray))
    const [formInputs, setFormInputs] = useState<any[]>(createFormInputs())

    const handleInputChange = (e: any, from?: any, control_for?: string) => {
        try {
            formData[from] = e.target.value
            updateFormDataPayload(from, e.target.value, '', '', control_for)
            setFormData(formData)
        } catch (error: any) {
            console.log(error)
        }
    };

    const sideUpdatePayload = (payload?: any, value?: string) => {
        console.log(value)
        const newformInputs = formInputs?.map((input) => {
            if (input.name === payload.name) {
                const splited = payload.optionsUrlData.split('/');
                splited[1] = value
                const joined = splited.join('/')

                return { ...payload, optionsUrlData: joined }
            }
            return input
        });
        return newformInputs; // Return the modified array
    };

    const sideUpdatePayloadSponsorship = (value?: string) => {
        const newformInputs = formInputs?.map((input) => {
            if (Number(value) === 8) {
                if (input.name === 'amount' || input.name === 'currency_id') {
                    return { ...input, isRemoved: false }
                }
                if (input.name === 'name') {
                    return { ...input, isRemoved: true }
                }
                return input
            }
            if (Number(value) === 11) {
                if (input.name === 'name') {
                    return { ...input, isRemoved: false }
                }
                if (input.name === 'amount' || input.name === 'currency_id') {
                    return { ...input, isRemoved: true }
                }
                return input
            }
            return input
        });
        return newformInputs; // Return the modified array
    };

    const sideUpdatePayloadAssignment = (value?: string) => {

        const newformInputs = formInputs?.map((input) => {
            if (Number(value) === 17) {
                if (input.name === 'personnel_id') {
                    return { ...input, isRemoved: false }
                }
                if (input.name === 'dept_id') {
                    return { ...input, isRemoved: true }
                }

                return input
            }
            if (Number(value) === 18) {
                if (input.name === 'dept_id') {
                    return { ...input, isRemoved: false }
                }
                if (input.name === 'personnel_id') {
                    return { ...input, isRemoved: true }
                }
                return input
            }
            return input


        });
        return newformInputs; // Return the modified array
    };


    const sideUpdatePayloadResource = (value?: string) => {
        const newformInputs = formInputs?.map((input) => {
            if (Number(value) === 23) {
                if (input.name === 'personnel_id') {
                    return { ...input, isRemoved: false }
                }
                if (input.name === 'quantity' || input.name === 'name') {
                    return { ...input, isRemoved: true }
                }

                return input
            }
            if (Number(value) === 6) {
                if (input.name === 'quantity' || input.name === 'name') {
                    return { ...input, isRemoved: false }
                }
                if (input.name === 'personnel_id') {
                    return { ...input, isRemoved: true }
                }
                return input
            }
            return input


        });
        return newformInputs; // Return the modified array
    };

    const updateFormDataPayload = (from?: string, value?: string, clear?: string, error?: string, control_for?: string) => {
        let newformInputs = [...formInputs]; // Copy the formInputs array

        if (clear === 'clear') {
            // Clear all inputs
            newformInputs = newformInputs.map(input => ({ ...input, value: '' }));
        }

        if (error === 'error') {
            // Handle error logic if needed
        }

        if (control_for === 'sponsors') {
            const foundInput = formInputs.find(item => item.control === 'sponsor_type');
            newformInputs = sideUpdatePayload(foundInput, value); // Update inputs for sponsors
        }

        if (control_for === 'sponsorship') {
            newformInputs = sideUpdatePayloadSponsorship(value); // Update inputs for sponsors
        }

        if (control_for === 'assignment') {
            newformInputs = sideUpdatePayloadAssignment(value); // Update inputs for sponsors
        }

        if (control_for === 'resource') {
            newformInputs = sideUpdatePayloadResource(value); // Update inputs for sponsors
        }

        if (from) {
            newformInputs = newformInputs.map(input => {
                if (input.name === from) {
                    return { ...input, value: value }
                }
                return input
            });
        }


        setFormInputs(newformInputs);
    };

    const handleError = (item: any, error: any) => {
        updateFormDataPayload(item?.name, error, 'not clear', 'error')
    }

    const validator = () => {

        let validation = true
        formInputs?.forEach((item) => {
            if (item.required && !item.isRemoved
                && !formData[item.name]) {
                console.log('error happened ' + item.name)
                handleError(item, `${item.name} is Required`)
                validation = false
            }
        })

        return validation
    }

    const sendEmail = async (emailBody: any) => {
        const emailresponse = await send_email(emailBody)
        if (emailresponse.status === 200) {
            Swal.fire({
                title: "Email Sent SuccessFully",
                text: "Email was sent successfully",
                icon: "success"
            })
        }
    }

    const handleSubmit = async () => {
        try {
            setIsDisabled(true)
            let response;
            const token = getValueFromLocalStorage('token')
            if (httpMethod === 'delete') {
                response = await remove<any>(url, token)
            } else {
                if (validator()) {
                    if (httpMethod === 'post') {
                        response = await post<any>(url, formData, token)
                    }
                    if (httpMethod === 'put') {
                        response = await put<any>(url, formData, token)
                    }
                }
            }
            if (response?.status === 200) {

                if (emailNotificationBody &&
                    Object.keys(emailNotificationBody).length > 0 &&
                    emailNotificationBody['code'] === 'create-employee' &&
                    emailNotificationBody['operation'] === 'create'
                ) {
                    const emailBody = { ...emailNotificationBody, id: response?.data?.data?.id }
                    sendEmail(emailBody)
                }
                setIsStateChanged(!isStateChanged)
                closeModel()
            }
            setIsDisabled(false)

        } catch (error) {
            setIsDisabled(false)
            Swal.fire({
                title: 'Error Occured!',
                text: JSON.stringify(error?.response?.data?.error),
                icon: 'error',
            });

            console.error('CrudFormItemError:', error);
        }
    }

    const closeModel = () => {
        onCloseModal()
        updateFormDataPayload('clear', 'clear', 'clear')
    }

    useEffect(() => {
        setFormInputs(createFormInputs())
        setFormData(createPayload(modalBodyArray));

    }, [modalBodyArray, ...state_properties])

    const createdForm = (gridSize?: number) => {
        return <PopupModal
            isOpen={isModalOpen}
            onSaveButtonName={'Save'}
            onClose={closeModel}
            isDisabled={isButtonDisabled}
            title={modalTitle}
            isLarge={Boolean(gridSize)}
        >
            <>
                <>
                    {
                        isForm
                            ?
                            <div className={`grid grid-cols-${Boolean(gridSize) ? 2 : 1} w-full gap-2`} style={{ gridTemplateColumns: `repeat(${gridSize ?? 1}, 1fr)`, gap: "10px" }}>
                                {
                                    formInputs && formInputs.length > 0 && formInputs?.map((item, index) => (
                                        <div className="" key={index}>
                                            {
                                                item?.type === 'text' && !item.isRemoved &&
                                                <TextFieldComponent
                                                    placeholder={item?.placeholder}
                                                    type={item.textType}
                                                    from={item?.name}
                                                    label={item?.label}
                                                    value={item.value}
                                                    onChange={handleInputChange}
                                                    isError={item.isError}
                                                    errorMessage={item.errorMessage}
                                                />
                                            }

                                            {
                                                item?.type === 'select' && !item.isRemoved &&
                                                <MuiSelect
                                                    handleChange={handleInputChange}
                                                    from={item?.name}
                                                    label={item?.label}
                                                    optionsUrlData={item.optionsUrlData}
                                                    optionDataKey={item.optionDataKey}
                                                    control={item.control}
                                                    control_id={item.control_id}
                                                    control_for={item.control_for}
                                                    value={item.value}
                                                    error={item.errorMessage}
                                                    isDisabled={isDisabled}

                                                />
                                            }
                                            {
                                                item?.type === 'date' && !item.isRemoved &&
                                                <MuiDate
                                                    handleDateChange={handleInputChange}
                                                    from={item?.name}
                                                    label={item?.label}
                                                    value={item.value}
                                                    minDate={item.minDate}
                                                    maxDate={item.maxDate}
                                                    defaultValue={item.defaultDate}
                                                    isDisabled={isDisabled}
                                                />
                                            }
                                            {
                                                item?.type === 'textArea' && !item.isRemoved &&
                                                <TextArea
                                                    onChange={handleInputChange}
                                                    from={item?.name}
                                                    label={item?.label}
                                                    value={item.value}
                                                />
                                            }
                                            {
                                                item?.type === 'radio' && !item.isRemoved &&
                                                <MuiRadioButtonsGroup
                                                    onChange={handleInputChange}
                                                    from={item.name}
                                                    label={item.label}
                                                    options={item.options}
                                                />
                                            }

                                        </div>
                                    ))
                                }
                            </div>
                            :
                            <p>{modalBodyString}</p>
                    }

                </>






                < div className="flex justify-end" >
                    <ReusableButton
                        name={onSaveButtonName}
                        isDisabled={isDisabled}
                        onClick={handleSubmit}
                    >
                        {!isDisabled && <CheckCircle2 size={13} />}
                    </ReusableButton>
                </div>
            </>

        </PopupModal >
    }

    return {
        createdForm,
        isStateChanged
    }
}