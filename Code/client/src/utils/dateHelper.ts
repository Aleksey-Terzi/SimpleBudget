const dateHelper = {
    dateToString: (d: Date) => {
        return d.toLocaleDateString("en-CA");
    },

    dateToStringNullable: (d?: Date) => {
        return d?.toLocaleDateString("en-CA");
    }
}

export default dateHelper;