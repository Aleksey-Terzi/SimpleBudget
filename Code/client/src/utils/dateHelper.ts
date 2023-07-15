const dateHelper = {
    monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],

    dateToString: (d: Date) => {
        return d.toLocaleDateString("en-CA");
    },

    dateToStringNullable: (d?: Date) => {
        return d?.toLocaleDateString("en-CA");
    },

    formatDate: (d: Date | string) => {
        let month: number;
        let day: number;
        let year: number;

        if (typeof d === "string") {
            d = new Date(d);

            month = d.getUTCMonth();
            day = d.getUTCDate();
            year = d.getUTCFullYear();
        } else {
            month = d.getMonth();
            day = d.getDate();
            year = d.getFullYear();
        }

        const monthName = monthAbbrevs[month];

        return `${monthName} ${day}, ${year}`;
    }
}

export default dateHelper;

const monthAbbrevs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];