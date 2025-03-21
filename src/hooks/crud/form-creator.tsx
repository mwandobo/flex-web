import CrudFormComponent from "@/components/forms/crud.form.component"
import {getValueFromLocalStorage} from "@/utils/actions/local-starage"
import {baseURL, post, put, remove} from "@/utils/api"
import {ReactNode, useEffect, useState} from "react"
import Swal from "sweetalert2"
import {gracefulApprovalUpdater} from "@/utils/actions/update-approvals.helper";
import ToastComponent from "@/components/tables/toast";

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
            const body = {
                from,
                value: e.target.value,
                control_for
            }
            updateFormDataPayload(body)
            setFormData(formData)
        } catch (error: any) {
            console.log(formData)
            console.log(error)
        }
    };

    const sideUpdatePayload = (payload?: any, value?: string) => {
        return formInputs?.map((input) => {
            if (input.name === payload.name) {
                try {
                    // Check if optionsUrlData is a full URL
                    let url;
                    if (payload.optionsUrlData.startsWith("http")) {
                        url = new URL(payload.optionsUrlData);
                    } else {
                        url = new URL(`api/${payload.optionsUrlData}`, baseURL);
                    }

                    // Add or update 'type' query parameter
                    url.searchParams.set("type", value || "");

                    console.log("Updated URL:", url.toString());

                    return { ...payload, optionsUrlData: url.toString() };
                } catch (error) {
                    console.error("Invalid URL:", payload.optionsUrlData);
                    return input;
                }
            }
            return input;
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

    const sideUpdatePayloadWorkshopServiceRequest = (value?: string) => {
        return formInputs?.map((input) => {
            if (value === 'internal') {
                if (input.name === 'from') {
                    return {...input, isRemoved: false}
                }
                if (input.name === 'from_id') {
                    return {...input, isRemoved: false}
                }
                if (input.name === 'item_id') {
                    return {...input, isRemoved: true}
                }
                return input
            }
            if (value === 'external') {
                if (input.name === 'from') {
                    return {...input, isRemoved: true}
                }
                if (input.name === 'from_id') {
                    return {...input, isRemoved: true}
                }
                if (input.name === 'item_id') {
                    return {...input, isRemoved: false}
                }
                return input
            }
            return input
        });
    };


    const sideUpdatePayloadTechnicianType = (value?: string) => {
        return formInputs?.map((input) => {
            if (value === 'internal') {
                if (input.name === 'name') {
                    return {...input, isRemoved: true}
                }
                if (input.name === 'maintained_by_id') {
                    return {...input, isRemoved: false}
                }

                return input
            }
            if (value === 'external') {
                if (input.name === 'name') {
                    return {...input, isRemoved: false}
                }
                if (input.name === 'maintained_by_id') {
                    return {...input, isRemoved: true}
                }
                return input
            }
            return input
        });
    };

    const sideUpdatePayloadMaintenanceType = (value?: string) => {
        return formInputs?.map((input) => {
            if (value === 'internal') {
                if (input.name === 'from') {
                    return {...input, isRemoved: false}
                }
                if (input.name === 'from_id') {
                    return {...input, isRemoved: false}
                }
                if (input.name === 'workshop_service_id') {
                    return {...input, isRemoved: true}
                }

                return input
            }
            if (value === 'external') {
                if (input.name === 'from') {
                    return {...input, isRemoved: true}
                }
                if (input.name === 'from_id') {
                    return {...input, isRemoved: true}
                }
                if (input.name === 'workshop_service_id') {
                    return {...input, isRemoved: false}
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
                        return {...input, isRemoved: false};
                    }
                    if (input.name === 'quantity' || input.name === 'item_id' || input.name === 'service_id') {
                        return {...input, isRemoved: true};
                    }
                    return input;

                case 29:
                    if (input.name === 'quantity' || input.name === 'item_id') {
                        return {...input, isRemoved: false};
                    }
                    if (input.name === 'personnel_id' || input.name === 'service_id') {
                        return {...input, isRemoved: true};
                    }
                    return input;
                case 30:
                    if (input.name === 'service_id') {
                        return {...input, isRemoved: false};
                    }
                    if (input.name === 'personnel_id' || input.name === 'item_id' || input.name === 'quantity') {
                        return {...input, isRemoved: true};
                    }
                    return input;

                default:
                    return input;
            }
        });
    };

    interface UpdateFormDataProps {
        from?: string
        value?: string
        clear?: string
        control_for?: string
    }



    const updateFormDataPayload = (body: UpdateFormDataProps) => {
        const {
            from,
            value,
            clear,
            control_for,
        } = body
        let newfoundInputs = [...formInputs];

        // Copy the formInputs array
        if (clear) {
            newfoundInputs = newfoundInputs.map(input => ({...input, value: '', errorMessage: ''}));
        }

        if(control_for){
            let foundInput = newfoundInputs.find(input => input.control === control_for);

            if (foundInput){
                // Check if optionsUrlData is a valid URL
                let selectUrl;
                try {
                    // Try to construct a URL object, assuming it's a valid URL
                    selectUrl = new URL(foundInput.optionsUrlData);
                } catch (error) {
                    // If it's not a valid URL, prepend a base URL to make it valid
                    selectUrl = new URL(`api/${foundInput.optionsUrlData}`, baseURL);
                }

                // Set the query parameter
                selectUrl.searchParams.set('type', value);

                foundInput.optionsUrlData = selectUrl.toString();
            }
        }

        if (control_for === 'sponsors') {
            const foundInput = formInputs.find(item => item.control === 'sponsor_type');
            newfoundInputs = sideUpdatePayload(foundInput, value); // Update inputs for sponsors
        }

        if (control_for === 'sale-quotation-item') {
            const foundInput = newfoundInputs.find(item => item.control === 'sale-quotation-item'); // Update formInputs copy
            foundInput.optionsUrlData = `sale-rfq/${value}/items-for-select`;
        }


        if (control_for === 'quotation-item') {
            const foundInput = newfoundInputs.find(item => item.control === 'quotation-item'); // Update formInputs copy
            foundInput.optionsUrlData = `purchase-rfq/${value}/items-for-select`;
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

        if (control_for === 'workshop_service') {
            newfoundInputs = sideUpdatePayloadWorkshopServiceRequest(value); // Update inputs for sponsors
        }

        if (control_for === 'technician_items') {
            newfoundInputs = sideUpdatePayloadTechnicianType(value); // Update inputs for sponsors
        }

        if (control_for === 'maintenance_items') {
            newfoundInputs = sideUpdatePayloadMaintenanceType(value); // Update inputs for sponsors
        }

        if (control_for === 'resource') {
            newfoundInputs = sideUpdatePayloadResource(value); // Update inputs for sponsors
        }

        if (from) {
            newfoundInputs = newfoundInputs.map(input => {
                if (input.name === from) {
                    return {...input, value: value, errorMessage: ""};
                }
                return input;
            });
        }

        setFormInputs(newfoundInputs); // Update the form inputs state
    };

    const validator = () => {
        let validation = true;

        // Collect errors for all inputs
        const updatedInputs = formInputs.map(item => {
            if (item.required && !item.isRemoved && !formData[item.name]) {
                validation = false;
                return {
                    ...item,
                    errorMessage: `${item.name} is Required`, // Add error message
                };
            }

            return {
                ...item,
                errorMessage: '', // Clear error if no validation issue
            };
        });

        // Update the state with the new input errors
        setFormInputs(updatedInputs);
        return validation;
    };

    const handleSubmit = async () => {
        try {
            const add_price = getValueFromLocalStorage('add-price')
            setIsDisabled(true)
            let response;
            const token = getValueFromLocalStorage('token')
            if (httpMethod === 'delete') {
                response = await remove<any>(url, token)
            } else {
                if (validator()) {
                    let _formData = itHasCustomForm && !add_price ? getValueFromLocalStorage('customFormData') : formData
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
                ToastComponent({text: response?.data?.message ?? "Operation Went Successfully", duration: 1000})
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
        updateFormDataPayload({clear: 'clear'})
    }

    useEffect(() => {
        setFormInputs(createFormInputs())
        setFormData(createPayload(modalBodyArray));

    }, [modalBodyArray, ...state_properties])

    const createdForm = (size?: string) => {

        return < CrudFormComponent
            isModalOpen={isModalOpen}
            onCloseModal={onCloseModal}
            handleSubmit={handleSubmit}
            isButtonDisabled={isButtonDisabled}
            modalTitle={modalTitle}
            isForm={isForm}
            formInputs={formInputs}
            handleInputChange={handleInputChange}
            size={size}
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