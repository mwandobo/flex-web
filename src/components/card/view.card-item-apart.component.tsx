

import React, { ReactNode } from 'react';
import { ReusableButton } from '../button/reusable-button';
import { Ellipsis } from 'lucide-react';

type Props = {
    data: any[];
    titleA?: string
    OptionalElement?: React.ReactNode
    titleB?: string
    onClick?: (key?: any) => void
    buttonName?: string
    buttonAction?: string
    isExtraButton?: boolean
    isExtraButtonDisabled?: boolean
    buttonKey?: string
}

const ViewCardItemApartComponent = ({
    data,
    titleA,
    titleB,
    buttonName = "progress",
    isExtraButton,
    isExtraButtonDisabled,
    buttonKey,
    OptionalElement,
    onClick
}: Props) => {
    return (
        <div className="flex flex-col ">
            <div className='flex justify-between mb-2'>
                <h3 className='p-2 text-left text-lg text-gray-600'>
                    {titleA && <span className='mr-1 text-sm'>{titleA} :</span>}
                    <span className='font-semibold text-gray-700 mr-1 text-sm'>{titleB}</span>
                </h3>
                <div className=''>
                    {isExtraButton && (
                        buttonName === 'Task Completed' ? <p className='bg-gray-200 p-1'>{buttonName}</p> :
                            <ReusableButton
                                name={buttonName}
                                onClick={() => onClick(buttonKey)}
                            >
                                <Ellipsis />
                            </ReusableButton >)

                    }
                </div>
            </div>

            <div className='flex flex-col w-full'>
                {data.map((item, index) => (
                    <div key={index} className="flex justify-between bg-gray-100 p-2 mb-1 ">
                        <h3 className="text-left border-r border-gray-700 pr-2 w-1/2 text-sm">{item.label}</h3>
                        <p className="font-semibold text-right pl-2  w-1/2 text-sm">{item.value}</p>
                    </div>
                ))}
            </div>
            <div className='flex justify-end w-full'>
                {OptionalElement && OptionalElement}
            </div>

        </div>
    );
};

export default ViewCardItemApartComponent;