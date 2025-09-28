export interface TestPaymentFilter {
    keyword: string | null | undefined;
    amountStart: number | null;
    amountEnd: number | null;
}

export interface TestPayment {
    id: number;
    date: string;
    wallet: string;
    amount: number;
}

const _data: TestPayment[] = [];

for (let i = 0; i < 1199; i++) {
    const walletIndex = Math.floor(Math.random() * 2);
    const wallet = walletIndex === 0 ? "Credit Card (Aleks)" : "Access Card (Joint)";
    const amount = Math.floor(Math.random() * 10000) * 100;
    const date = new Date();

    date.setDate(date.getDate() - i);

    _data.push({
        id: i,
        date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
        wallet,
        amount
    })
}

export const testApiHelper = {
    countPayments,
    searchPayments
};

async function countPayments(filter: TestPaymentFilter) {
    return await new Promise<number>(resolve => setTimeout(() => resolve(filterPayments(filter).length), 500));
}

async function searchPayments(filter: TestPaymentFilter, startIndex: number, count: number) {
    return await new Promise<TestPayment[]>((resolve, reject) => setTimeout(() => {
        if (startIndex === count) {
            reject(new Error("Test error"));
        }
        const filteredData = filterPayments(filter);
        const result: TestPayment[] = [];
        if (startIndex < 0 || startIndex >= filteredData.length) {
            return resolve(result);
        }
        for (let i = startIndex; i < startIndex + count && i < filteredData.length; i++) {
            result.push(filteredData[i]);
        }
        resolve(result);
    }, 1000));
}

function filterPayments(filter: TestPaymentFilter) {
    return _data.filter(x =>
        (!filter.keyword || x.wallet.toLowerCase().includes(filter.keyword.toLowerCase()))
        && (filter.amountStart === null || x.amount >= filter.amountStart)
        && (filter.amountEnd === null || x.amount <= filter.amountEnd)
    );
}