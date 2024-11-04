import CrudFormComponent from "@/components/forms/crud.form.component"
import {getValueFromLocalStorage} from "@/utils/actions/local-starage"
import {send_email} from "@/utils/actions/send-email"
import {baseURL, post, put, remove} from "@/utils/api"
import {ReactNode, useEffect, useState} from "react"
import Swal from "sweetalert2"
import {gracefulApprovalUpdater} from "@/utils/actions/update-approvals.helper";

interface Props {
    isModalOpen: boolean
    onCloseModal: () => void
    onSaveButtonName?: string
    isShowAddPriceButton?: boolean,
    modalTitle: string
    url: string
    httpMethod: string
    from: string
    modalBodyArray?: any[]
    modalBodyString?: string
    isButtonDisabled?: boolean
    itHasCustomForm?: boolean
    customForm?: ReactNode;
    isForm?: boolean
    state_properties: any[]
    isMultipart?: boolean,
    emailNotificationBody?: any,
    isFormData?: boolean
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
                                       itHasCustomForm,
                                       customForm,
                                       isButtonDisabled,
                                       isForm,
                                       state_properties = [],
                                       isShowAddPriceButton,
                                       emailNotificationBody,
                                       from,
    isFormData
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
            formData[from] = from === 'file' ? e.target.files[0] : e.target.value
            updateFormDataPayload(from,  e.target.value , '', '', control_for)
            setFormData(formData)
        } catch (error: any) {
            console.log(error)
        }
    };

    const sideUpdatePayload = (payload?: any, value?: string) => {
        return formInputs?.map((input) => {
            if (input.name === payload.name) {
                const splited = payload.optionsUrlData.split('/');
                splited[1] = value
                const joined = splited.join('/')

                return {...payload, optionsUrlData: joined}
            }
            return input
        });
    };

    const sideUpdatePayloadSponsorship = (value?: string) => {
        return formInputs?.map((input) => {
            if (Number(value) === 8) {
                if (input.name === 'amount' || input.name === 'currency_id') {
                    return {...input, isRemoved: false}
                }
                if (input.name === 'name') {
                    return {...input, isRemoved: true}
                }
                return input
            }
            if (Number(value) === 11) {
                if (input.name === 'name') {
                    return {...input, isRemoved: false}
                }
                if (input.name === 'amount' || input.name === 'currency_id') {
                    return {...input, isRemoved: true}
                }
                return input
            }
            return input
        });
    };

    const sideUpdatePayloadAssignment = (value?: string) => {
        return formInputs?.map((input) => {
            if (Number(value) === 17) {
                if (input.name === 'personnel_id') {
                    return {...input, isRemoved: false}
                }
                if (input.name === 'dept_id') {
                    return {...input, isRemoved: true}
                }

                return input
            }
            if (Number(value) === 18) {
                if (input.name === 'dept_id') {
                    return {...input, isRemoved: false}
                }
                if (input.name === 'personnel_id') {
                    return {...input, isRemoved: true}
                }
                return input
            }
            return input
        });
    };

    const sideUpdatePayloadResource = (value?: string) => {
        return formInputs?.map((input) => {
            switch (Number(value)) {
                case 23:
                    if (input.name === 'personnel_id') {
                        return { ...input, isRemoved: false };
                    }
                    if (input.name === 'quantity' || input.name === 'item_id' || input.name === 'service_id') {
                        return { ...input, isRemoved: true };
                    }
                    return input;

                case 29:
                    if (input.name === 'quantity' || input.name === 'item_id') {
                        return { ...input, isRemoved: false };
                    }
                    if (input.name === 'personnel_id' || input.name === 'service_id') {
                        return { ...input, isRemoved: true };
                    }
                    return input;
                case 30:
                    if ( input.name === 'service_id') {
                        return { ...input, isRemoved: false };
                    }
                    if (input.name === 'personnel_id' || input.name === 'item_id' || input.name === 'quantity') {
                        return { ...input, isRemoved: true };
                    }
                    return input;

                default:
                    return input;
            }
        });
    };

    const updateFormDataPayload = (from?: string, value?: string, clear?: string, error?: string, control_for?: string) => {
        let newfoundInputs = [...formInputs]; // Copy the formInputs array

        if (clear === 'clear') {
            // Clear all inputs
            newfoundInputs = newfoundInputs.map(input => ({...input, value: ''}));
        }

        if (error === 'error') {
            // Handle error logic if needed
        }

        if (control_for === 'sponsors') {
            const foundInput = formInputs.find(item => item.control === 'sponsor_type');
            newfoundInputs = sideUpdatePayload(foundInput, value); // Update inputs for sponsors
        }

        if (control_for === 'quotation-item') {
            const foundInput = newfoundInputs.find(item => item.control === 'quotation-item'); // Update formInputs copy
            const selectUrl = foundInput.optionsUrlData;
            const split = selectUrl.split('/');
            split[1] = value;
            foundInput.optionsUrlData = split.join('/');
        }

        if (control_for === 'invoice') {
            const foundInput = newfoundInputs.find(item => item.control === 'invoice'); // Get input from copy

            // Check if optionsUrlData is a valid URL
            let selectUrl;
            try {
                // Try to construct a URL object, assuming it's a valid URL
                selectUrl = new URL(foundInput.optionsUrlData);
            } catch (error) {
                // If it's not a valid URL, prepend a base URL to make it valid
                selectUrl = new URL(`api${foundInput.optionsUrlData}`, baseURL);
            }

            // Set the query parameter
            selectUrl.searchParams.set('type', value);

            // Update optionsUrlData with the new URL
            foundInput.optionsUrlData = selectUrl.toString();
        }


        if (control_for === 'sponsorship') {
            newfoundInputs = sideUpdatePayloadSponsorship(value); // Update inputs for sponsors
        }

        if (control_for === 'assignment') {
            newfoundInputs = sideUpdatePayloadAssignment(value); // Update inputs for sponsors
        }

        if (control_for === 'resource') {
            newfoundInputs = sideUpdatePayloadResource(value); // Update inputs for sponsors
        }

        if (from) {
            newfoundInputs = newfoundInputs.map(input => {
                if (input.name === from) {
                    return {...input, value: value};
                }
                return input;
            });
        }

        setFormInputs(newfoundInputs); // Update the form inputs state
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
            const add_price  = getValueFromLocalStorage('add-price')
            setIsDisabled(true)
            let response;
            const token = getValueFromLocalStorage('token')
            if (httpMethod === 'delete') {
                response = await remove<any>(url, token)
            } else {
                if (validator()) {
                    let _formData = itHasCustomForm && !add_price ?  getValueFromLocalStorage('customFormData') : formData
                    if (httpMethod === 'post') {
                        response = await post<any>(url, _formData, token, isFormData)
                    }
                    if (httpMethod === 'put') {
                        response = await put<any>(url, _formData, token)
                    }
                }
            }
            if ([200, 201].includes(response?.status)) {
                await gracefulApprovalUpdater(from)

                if (emailNotificationBody &&
                    Object.keys(emailNotificationBody).length > 0 &&
                    emailNotificationBody['code'] === 'create-employee' &&
                    emailNotificationBody['operation'] === 'create'
                ) {
                    const emailBody = {...emailNotificationBody, id: response?.data?.data?.id}
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
        return < CrudFormComponent
            isModalOpen={isModalOpen}
            onCloseModal={onCloseModal}
            handleSubmit={handleSubmit}
            isButtonDisabled={isButtonDisabled}
            modalTitle={modalTitle}
            isForm={isForm}
            formInputs={formInputs}
            handleInputChange={handleInputChange}
            gridSize={gridSize}
            isDisabled={isDisabled}
            modalBodyString={modalBodyString}
            onSaveButtonName={onSaveButtonName}
            itHasCustomForm={itHasCustomForm}
            customForm={customForm}
            isShowAddPriceButton={isShowAddPriceButton}
        />
    }
    return {
        createdForm,
        isStateChanged
    }
}