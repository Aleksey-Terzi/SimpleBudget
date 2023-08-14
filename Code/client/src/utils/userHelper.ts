import UserModel from "../models/userModel";

const userKey = "user";
const paymentsFilterTypeKey = "payments.filterType";

const userHelper = {
    setUser: (user?: UserModel) => {
        if (user) {
            localStorage.setItem(userKey, JSON.stringify(user));
        } else {
            localStorage.removeItem(userKey);
        }
    },

    getUser: (): UserModel | undefined => {
        const user = localStorage.getItem(userKey);

        return user && JSON.parse(user);
    },

    setPaymentsFilterType: (filter: "Simple" | "Advanced") => {
        localStorage.setItem(paymentsFilterTypeKey, filter);
    },

    getPaymentsFilterType: () => {
        return localStorage.getItem(paymentsFilterTypeKey);
    }
}

export default userHelper;