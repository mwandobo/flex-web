import {CheckCircle2} from "lucide-react"
import {ReusableButton} from "../button/reusable-button"
import MuiDate from "../inputs/mui-date"
import MuiRadioButtonsGroup from "../inputs/mui-radio"
import MuiSelect from "../inputs/mui-select"
import TextArea from "../inputs/text-area"
import TextFieldComponent from "../inputs/text-field"
import PopupModal from "../modal/popup-modal"
import MuiMultiSelectSelect from "@/components/inputs/mui-multi-select";
import {ReactNode, useState} from "react"
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import FileInputComponent from "@/components/inputs/file-input.component";
import MuiSelectLocal from "@/components/inputs/mui-select-local";

interface Props {
    isModalOpen: boolean,
    onCloseModal: () => void,
    isButtonDisabled?: boolean,
    modalTitle?: string
    isForm?: boolean
    itHasCustomForm?: boolean
    customForm?: ReactNode; // React component to be rendered
    formInputs?: any[]
    handleInputChange?: (e: any, from?: any, control_for?: string) => void
    isDisabled?: boolean
    modalBodyString?: string
    size?: string
    onSaveButtonName?: string
    handleSubmit: () => void,
    isShowAddPriceButton?: boolean,
}

const CrudFormComponent = ({
                               isModalOpen,
                               onCloseModal,
                               isButtonDisabled,
                               modalTitle,
                               isForm,
                               formInputs,
                               handleInputChange,
                               size,
                               isDisabled,
                               modalBodyString,
                               onSaveButtonName,
                               handleSubmit,
                               itHasCustomForm,
                               customForm,
                           }: Props) => {
    const add_price = getValueFromLocalStorage('add-price')

    const sizeGrid = () => {
        if(size === "md") {return 2}
        if(size === "lg") {return 3}
        if(size === "sm") {return 1}
        return 1
    }

    return <PopupModal
        isOpen={isModalOpen}
        onSaveButtonName={'Save'}
        onClose={onCloseModal}
        isDisabled={isButtonDisabled}
        title={modalTitle}
        size={size}
    >
        <>
            <>
                {
                    isForm
                        ?
                        <div className={`grid grid-cols-${Boolean(sizeGrid())} w-full gap-2`}
                             style={{gridTemplateColumns: `repeat(${sizeGrid()}, 1fr)`, gap: "10px"}}>
                            {
                                itHasCustomForm && !add_price ? (
                                    customForm
                                ) : (
                                    // If itHasCustomForm is false, map over formInputs
                                    formInputs && formInputs.length > 0 && formInputs.map((item, index) => (
                                        <>{ !item.isRemoved &&
                                            <div className="" key={index}>
                                                {item?.type === 'text' && (
                                                    <TextFieldComponent
                                                        placeholder={item?.placeholder}
                                                        type={item.textType}
                                                        from={item?.name}
                                                        label={item?.label}
                                                        value={item.value}
                                                        onChange={handleInputChange}
                                                        isError={item.isError}
                                                        errorMessage={item.errorMessage}
                                                        isRequired={item.required}
                                                        isDisabled={item.isDisabled}
                                                    />
                                                )}
                                                {item?.type === 'file' && (
                                                    <FileInputComponent
                                                        placeholder={item?.placeholder}
                                                        type={item.textType}
                                                        from={item?.name}
                                                        label={item?.label}
                                                        value={item.value}
                                                        onChange={handleInputChange}
                                                        isError={item.isError}
                                                        errorMessage={item.errorMessage}
                                                    />
                                                )}

                                                {item?.type === 'select' && (
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
                                                        isRequired={item.required}
                                                    />
                                                )}
                                                {item?.type === 'select-local' && (
                                                    <MuiSelectLocal
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
                                                        isRequired={item.required}
                                                    />
                                                )}

                                                {item?.type === 'multi-select' && (
                                                    <MuiMultiSelectSelect
                                                        optionsUrlData={item.optionsUrlData}
                                                        optionDataKey={item.optionDataKey}
                                                        from={item.name}
                                                        handleChange={handleInputChange}
                                                        value={item.value}
                                                        label={item.label}
                                                        placeholder={item.placeholder}
                                                    />
                                                )}

                                                {item?.type === 'date'  && (
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
                                                )}

                                                {item?.type === 'textArea' && (
                                                    <TextArea
                                                        onChange={handleInputChange}
                                                        from={item?.name}
                                                        label={item?.label}
                                                        value={item.value}
                                                    />
                                                )}

                                                {item?.type === 'radio' && (
                                                    <MuiRadioButtonsGroup
                                                        onChange={handleInputChange}
                                                        from={item.name}
                                                        label={item.label}
                                                        options={item.options}
                                                    />
                                                )}
                                            </div>
                                        }
                                        </>
                                    ))
                                )
                            }
                        </div>
                        :
                        <p>{modalBodyString}</p>
                }
            </>
            < div className="flex justify-end mt-4">
                <ReusableButton
                    name={onSaveButtonName}
                    isDisabled={isDisabled}
                    onClick={handleSubmit}
                    rounded={'md'}
                    padding={'p-3'}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
                >
                    {!isDisabled && <CheckCircle2 size={13}/>}
                </ReusableButton>
            </div>
        </>

    </PopupModal>
}

export default CrudFormComponent