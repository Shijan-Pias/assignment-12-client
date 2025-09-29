import { useQuery } from "@tanstack/react-query";
import UseAuth from "./UseAuth";
import UseAxiosSecure from "./UseAxiosSecure";

const UseUserRole = () => {
  const { user } = UseAuth(); // user object with email
  const axiosSecure = UseAxiosSecure();

  const email = user?.email;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userRole", email],
    queryFn: async () => {
      if (!email) return null; // skip if email not available
      const res = await axiosSecure.get(`/users/role/${email}`);
      return res.data.role; // returns 'user', 'admin', or 'seller'
    },
    enabled: !!email, // only fetch if email exists
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  return { role: data, roleLoading: isLoading, error, refetch };
};

export default UseUserRole;
