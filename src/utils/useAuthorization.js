import { useSelector } from "react-redux";

export const useUserAuthorization = (userRole) => {
    const user = useSelector((state) => state.user);

    if (!user) {
        return { redirect: true, path: "/" };
    }

    if (user.role.toLowerCase() !== userRole.toLowerCase()) {
        return { redirect: true, path: `/${user.role.toLowerCase()}` };
    }

    return { redirect: false };
};

export const useAuthentication = () => {
    const user = useSelector((state) => state.user);

    if (user) {
        return { redirect: true, path: `/${user.role.toLowerCase()}` };
    }

    return { redirect: false };
};
