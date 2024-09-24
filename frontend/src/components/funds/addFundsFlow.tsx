import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import cardIcon from "../../assets/cardIcon.svg";
import yellowCardIcon from "../../assets/yellowCardIcon.svg";
import checkBoxSuccesIcon from "../../assets/bigCheckBox.svg";

export const AddFundsFlow: React.FC = () => {
    const [step, setStep] = useState(1);
    const [fundMethod, setFundMethod] = useState<string | null>(null);
    const [fundAmount, setFundAmount] = useState<number | null>(null); // Change this to number

    const goNext = () => setStep((prev) => prev + 1);
    const goBack = () => {
        if (step === 3 && fundMethod) {
            setStep(1); // Go back to step 2 if a payment method is selected
        } else {
            setStep((prev) => Math.max(prev - 1, 1)); // Ensure we don’t go below step 1
        }
    };

    const handlePaymentSelect = (paymentType: string) => {
        setFundMethod(paymentType);
        setStep(1);
    };

    const renderSteps = () => {
        switch (step) {
            case 1:
                return (
                    <FundAmount
                        selectedPaymentMethod={fundMethod}
                        setFundAmount={(amount) => setFundAmount(amount ? Number(amount) : null)} // Ensure the amount is converted to number
                        fundAmount={fundAmount}
                        goNext={() => setStep(2)}
                    />
                );
            case 2:
                return <FundMethodType onPaymentSelect={handlePaymentSelect} />;
            case 3:
                return <FundAmountReview selectedPaymentMethod={fundMethod} fundAmount={fundAmount} />;
            case 4:
                return <FundSummary investmentAmount={fundAmount?.toString() || "0"} />; // Pass as string
            default:
                return null;
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Funds</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="hidden">Add Funds Flow</DialogTitle>
                    <DialogDescription>
                        Please follow the steps to add funds to your account.
                    </DialogDescription>
                </DialogHeader>
                {renderSteps()}
                <DialogFooter>
                    {step > 1 && step < 5 && (
                        <Button variant="outline" onClick={goBack}>
                            Back
                        </Button>
                    )}
                    {step === 1 && (
                        <Button
                            disabled={!fundMethod}
                            onClick={() => fundMethod && setStep(3)}
                        >
                            Continue
                        </Button>
                    )}
                    {step === 3 && (
                        <Button onClick={goNext}>
                            Confirm
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

interface FundAmountReviewProps {
    selectedPaymentMethod: string | null; // Allow null for the method
    fundAmount: number | null; // Allow null for the amount
}

export const FundAmountReview: React.FC<FundAmountReviewProps> = ({ fundAmount, selectedPaymentMethod }) => {
    return (
        <form className="p-5 border rounded-lg bg-white">
            <h4 className="font-bold text-xl mb-4">Order View</h4>
            <div className="flex items-center justify-center mb-4">
                <h3 className="font-bold text-3xl text-[#C8E870]">£{fundAmount ?? "0.00"}</h3>
            </div>
            <ul className="space-y-2">
                <li className="flex justify-between py-2 border-b">
                    <span className="font-bold text-sm">Fee</span>
                    <span className="text-gray-500">£ 0.00GBP</span>
                </li>
                <li className="flex justify-between py-2">
                    <span className="font-bold text-sm">Pay With</span>
                    <span className="text-gray-500">{selectedPaymentMethod}</span>
                </li>
            </ul>
        </form>
    );
}

interface FundAmountProps {
    goNext: () => void;
    selectedPaymentMethod: string | null;
    fundAmount: number | null; // Change to number or null
    setFundAmount: (amount: number | null) => void; // Change to string or null
}

export const FundAmount: React.FC<FundAmountProps> = ({
    goNext,
    selectedPaymentMethod,
    fundAmount,
    setFundAmount,
}) => {
    const [amount, setAmount] = useState<string>('0'); // Initialize amount to '0'

    // Effect to set initial amount if fundAmount changes
    useEffect(() => {
        setAmount(fundAmount !== null ? fundAmount.toString() : '0'); // Convert number to string for input
    }, [fundAmount]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Ensure that the value is a valid number or an empty string
        if (!isNaN(Number(value)) || value === '') {
            setAmount(value); // Update local state
            setFundAmount(value ? Number(value) : null); // Update parent state, convert to number or null
        }
    };

    return (
        <article className="flex flex-col items-center space-y-4 p-4 border rounded-md w-full max-w-md">
            <h4 className="text-xl font-semibold">Top-Up Amount</h4>

            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={amount}
                    onChange={handleChange}
                    className="rounded-md w-full text-5xl text-center border-0 outline-none focus:ring-0"
                    placeholder="0"
                />
            </div>

            <div
                onClick={goNext}
                className="flex p-2 rounded-lg hover:bg-[#C8E870] justify-between items-center w-[80%] mx-auto cursor-pointer"
            >
                <span className="flex items-center">
                    <img alt="token-icon" src={cardIcon} className="h-8" />
                    <span className="flex pl-2 flex-col">
                        <span className="font-bold text-medium">Pay With</span>
                        <span className="text-gray-400">{selectedPaymentMethod ? selectedPaymentMethod : "Please select a method type"}</span>
                    </span>
                </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l5 5a1 1 0 01.083 1.32l-.083.094-5 5a1 1 0 01-1.497-1.32l.083-.094L15.586 11H3a1 1 0 01-.117-1.993L3 9h12.586l-3.293-3.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        </article>
    );
}

interface FundMethodTypeProps {
    onPaymentSelect: (paymentType: string) => void;
}

export const FundMethodType: React.FC<FundMethodTypeProps> = ({ onPaymentSelect }) => {
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

    const handlePaymentSelect = (paymentType: string) => {
        setSelectedPayment(paymentType);
        onPaymentSelect(paymentType); // Call the callback with the selected payment type
    };

    return (
        <article className="space-y-5">
            <h4 className="font-bold text-xl">Select Payment Type</h4>

            <span
                className={`flex items-center hover:bg-[#C8E870] p-2 rounded-lg ${selectedPayment === 'e-wallet' ? 'bg-[#C8E870]' : ''}`}
                onClick={() => handlePaymentSelect("e-wallet")}
            >
                <img alt="E-Wallet icon" className="h-8" src={cardIcon} />
                <p className="pl-4">E-Wallet</p>
            </span>

            <span
                className={`flex items-center hover:bg-[#C8E870] p-2 rounded-lg ${selectedPayment === 'bank-card' ? 'bg-[#C8E870]' : ''}`}
                onClick={() => handlePaymentSelect("bank-card")}
            >
                <img alt="Bank Card icon" className="h-8" src={yellowCardIcon} />
                <p className="pl-4">Bank Card</p>
            </span>
        </article>
    );
}

interface FundSummaryProps {
    investmentAmount: string; // Assuming the amount is passed as a string
}

export const FundSummary: React.FC<FundSummaryProps> = ({ investmentAmount }) => {
    return (
        <article className="p-5 text-center">
            <img alt="success-check-box" src={checkBoxSuccesIcon} className="mx-auto mb-4" />
            <p className="font-bold text-3xl">£ {investmentAmount}</p>
            <p className="text-lg text-gray-600">Successfully added to your account</p>
            <ul className="space-y-2 mt-4">
                <li className="flex justify-between py-2 border-b">
                    <span className="font-bold text-sm">Updated Balance</span>
                    <span className="text-gray-500">$ 2343894</span>
                </li>
                <li className="flex justify-between py-2">
                    <span className="font-bold text-sm">Reference NO.</span>
                    <span className="text-gray-500">XCVDfkeru45</span>
                </li>
            </ul>
        </article>
    );
};
