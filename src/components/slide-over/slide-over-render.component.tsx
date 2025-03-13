'use client'
import React, {useState} from "react";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import SlideOverV2 from "@/components/slide-over/slide-over-v2.component";

const SlideOverRender = () => {
    const {state, dispatch} = useGlobalContextHook()
    const {slideOverContent} = state

    const handleCloseSlideOver = () => {

        dispatch({
            type: 'UPDATE_SLIDE_OVER_CONTENT',
            payload: {
                isOpen: false,
                sliderOverComponent: () => ''
            }
        })
    }

    return <SlideOverV2
        isShowSlideOver={slideOverContent?.isOpen}
        title="Apply Filters"
        onClose={handleCloseSlideOver}
        width={'25rem'}
    >

        {slideOverContent?.sliderOverComponent(slideOverContent.from_id) ?? ''}
    </SlideOverV2>
};

export default SlideOverRender;
