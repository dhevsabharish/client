import { useAuth } from "../hooks/useAuth";
import { MemberHome } from "./Member";
import { LibrarianHome } from "./Librarian";
import { AdminHome } from "./Admin";

export const HomePage = () => {
    const { userRole } = useAuth();

    return (
        <>
            {userRole === "member" && <MemberHome />}
            {userRole === "librarian" && <LibrarianHome />}
            {userRole === "admin" && <AdminHome />}
        </>
    );
};
