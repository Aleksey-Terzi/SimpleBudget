import UserModel from "../models/userModel";

const userKey = "user";

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
    }
}

export default userHelper;