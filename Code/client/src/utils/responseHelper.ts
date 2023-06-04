const responseHelper = {
    getErrorMessage: (e: any) => {
        return (e?.status ? `HTTP status: ${e.status}` : e?.statusText) || "Unknown error";
    }
}

export default responseHelper;