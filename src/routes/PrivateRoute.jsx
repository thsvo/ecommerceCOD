import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { logout, useCurrentToken } from "@/redux/services/auth/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector(useCurrentToken);

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to access this page.");
      router.push("/sign-in");
      return;
    }

    const decodedToken = jwtDecode(token);
    const tokenExpirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();

    if (tokenExpirationTime > currentTime) {
      const timeUntilExpiration = tokenExpirationTime - currentTime;

      const timer = setTimeout(() => {
        toast.error("Your session expired! Please log in again.");
        dispatch(logout());
        router.push("/sign-in");
      }, timeUntilExpiration);

      return () => clearTimeout(timer);
    } else {
      toast.error("Your session has already expired! Please log in again.");
      dispatch(logout());
      router.push("/sign-in");
    }
  }, [token, dispatch, router]);

  if (token) {
    const decodedToken = jwtDecode(token);
    const tokenExpirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();

    if (tokenExpirationTime > currentTime) {
      return children;
    }
  }

  return <Link href="/sign-in"></Link>;
};

export default PrivateRoute;
