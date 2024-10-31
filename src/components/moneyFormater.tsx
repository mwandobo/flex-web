
interface Props {
    amount: number,
    currency?: string
    isHideCurrency?: boolean
    isShowCurrency?: boolean
}

const FormattedMoney = ({ amount, currency = 'Tzs', isHideCurrency, isShowCurrency }: Props) => {

    if (amount) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            currencyDisplay: 'symbol',
        });

        const formattedAmount = formatter.format(Number(amount));

        const symbol = formattedAmount.replace(/[0-9,.]/g, '').trim();
        const amountStr = formattedAmount.replace(/[^0-9.,]/g, '').trim();

        return <p className="text-xs">{amountStr} <span className="text-xs"> {isShowCurrency && symbol}</span></p>
    } else {
        return <p className="text-xs">0.00</p>

    }



};

export default FormattedMoney;