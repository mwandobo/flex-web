
interface Props {
    amount: number,
    currency?: string
}

const FormattedMoney = ({ amount, currency = 'Tzs' }: Props) => {

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
    });

    const formattedAmount = formatter.format(amount);

    const symbol = formattedAmount.replace(/[0-9,.]/g, '').trim();
    const amountStr = formattedAmount.replace(/[^0-9.,]/g, '').trim();

    return <p>{amountStr} <span className="text-xs"> {symbol}</span></p>
};

export default FormattedMoney;