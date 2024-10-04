import {CheckCircle2} from "lucide-react"
import {ReusableButton} from "../button/reusable-button"
import MuiDate from "../inputs/mui-date"
import MuiRadioButtonsGroup from "../inputs/mui-radio"
import MuiSelect from "../inputs/mui-select"
import TextArea from "../inputs/text-area"
import TextFieldComponent from "../inputs/text-field"
import PopupModal from "../modal/popup-modal"
import MuiMultiSelectSelect from "@/components/inputs/mui-multi-select";
import {ReactNode} from "react"
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";

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
    gridSize?: number
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
                               gridSize,
                               isDisabled,
                               modalBodyString,
                               onSaveButtonName,
                               handleSubmit,
                               itHasCustomForm,
                               customForm,
                           }: Props) => {
    const add_price = getValueFromLocalStorage('add-price')

    return <PopupModal
        isOpen={isModalOpen}
        onSaveButtonName={'Save'}
        onClose={onCloseModal}
        isDisabled={isButtonDisabled}
        title={modalTitle}
        isLarge={Boolean(gridSize)}
    >
        <>
            <>
                {
                    isForm
                        ?
                        <div className={`grid grid-cols-${Boolean(gridSize) ? 2 : 1} w-full gap-2`}
                             style={{gridTemplateColumns: `repeat(${gridSize ?? 1}, 1fr)`, gap: "10px"}}>
                            {
                                itHasCustomForm && !add_price ? (
                                    customForm
                                ) : (
                                    // If itHasCustomForm is false, map over formInputs
                                    formInputs && formInputs.length > 0 && formInputs.map((item, index) => (
                                        <div className="" key={index}>
                                            {item?.type === 'text' && !item.isRemoved && (
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
                                            )}

                                            {item?.type === 'select' && !item.isRemoved && (
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
                                            )}

                                            {item?.type === 'multi-select' && !item.isRemoved && (
                                                <MuiMultiSelectSelect
                                                    optionsUrlData={item.optionsUrlData}
                                                    optionDataKey={item.optionDataKey}
                                                    from={item.name}
                                                    handleChange={handleInputChange}
                                                    value={item.value}
                                                />
                                            )}

                                            {item?.type === 'date' && !item.isRemoved && (
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

                                            {item?.type === 'textArea' && !item.isRemoved && (
                                                <TextArea
                                                    onChange={handleInputChange}
                                                    from={item?.name}
                                                    label={item?.label}
                                                    value={item.value}
                                                />
                                            )}

                                            {item?.type === 'radio' && !item.isRemoved && (
                                                <MuiRadioButtonsGroup
                                                    onChange={handleInputChange}
                                                    from={item.name}
                                                    label={item.label}
                                                    options={item.options}
                                                />
                                            )}
                                        </div>
                                    ))
                                )
                            }

                        </div>
                        :
                        <p>{modalBodyString}</p>
                }

            </>
            < div className="flex justify-end">
                <ReusableButton
                    name={onSaveButtonName}
                    isDisabled={isDisabled}
                    onClick={handleSubmit}
                >
                    {!isDisabled && <CheckCircle2 size={13}/>}
                </ReusableButton>
            </div>
        </>

    </PopupModal>
}

export default CrudFormComponent