const reportFormatHelper = {
    formatValue: (value: number, text: string) => {
        const roundedValue = Math.round(value * 100) / 100;

        if (roundedValue === 0) return <>{text}</>;

        return roundedValue < 0
            ? <span className="text-danger">{text}</span>
            : <span className="text-success">{text}</span>;
    },
    formatValueMarkIncome: (value: number, text: string) => {
        const roundedValue = Math.round(value * 100) / 100;

        return roundedValue > 0
            ? <span className="text-success">{text}</span>
            : <>{text}</>
    }
}

export default reportFormatHelper;