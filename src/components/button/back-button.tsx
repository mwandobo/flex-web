
"use client"

import { ArrowLeftSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReusableButton } from "./reusable-button";

const BackButton = () => {
    const router = useRouter();
    const handleNavigateBack = () => {
        router.back(); // Navigate back in history
    };

    return (
        <div>
            <ReusableButton
                name="Back"
                onClick={handleNavigateBack}>
                <ArrowLeftSquare size={13} />
            </ReusableButton>
        </div>
    )
}

export default BackButton