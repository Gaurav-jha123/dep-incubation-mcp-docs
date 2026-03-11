import type { loginFormSchema } from "@/lib/schema/login-form.zod";
import { useAuthStore, type IUserDetails } from "@/store/use-auth-store/use-auth-store";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import type z from "zod";

function useAuth() {
    const { setUserDetails, clearUserDetails } = useAuthStore();
    const navigate = useNavigate();

    const verifyUser = (token: string) => {
        if (token?.length) {
          const userDetails: IUserDetails = jwtDecode(token);
    
          setUserDetails({
            ...userDetails,
            isLoggedIn: true,
          });
    
          navigate("/dashboard");
        }
      };
      
    const login = (data: z.infer<typeof loginFormSchema>) => {
        console.info('user details:', data.email)
        // assuming sending this email id , password to backend;
        // const { emailId, password } = data;
        const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmTmFtZSI6IlN1cnlhdGVqYSIsImxOYW1lIjoiS2FuZHVrdXJ1IiwiZW1haWxJZCI6InN1cnlhdGVqYV9rYW5kdWt1cnVAZXBhbS5jb20iLCJpYXQiOjE3NzI1MzUyNDUsImV4cCI6MTgwNjY5ODc1N30.BfPhvH1lUl3tkRW5ur78hhJo2gzJ-DNJnu8h_BqnbRE`;
        localStorage.setItem('token', token)
        verifyUser(token)
    };

    const logout = () => {
        clearUserDetails();
        localStorage.clear();
        navigate('/login')
    };

    return {
        login,
        logout,
        verifyUser
    }
}

export default useAuth