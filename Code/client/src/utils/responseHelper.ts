const responseHelper = {
    getErrorMessage: (e: any) => {
        if (!e?.status) {
            return 'Unknown error';
        }

        const details = e.data?.title ? `. ${e.data.title}` : '';

        return `HTTP status: ${e.status}${details}`;
    }
}

export default responseHelper;