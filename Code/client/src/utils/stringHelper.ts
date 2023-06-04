const stringHelper = {
    equalsIgnoringCase: (s1: string, s2: string) => {
        if (!s1 && !s2) return true;

        if (!s1 || !s2) return false;

        return s1.toLowerCase() === s2.toLowerCase();
    }
}

export default stringHelper;