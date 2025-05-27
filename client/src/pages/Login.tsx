import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const { setUser } = useUser();

  const valueChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        toast.success(res?.data?.message || "Login Successfully");
        setUser(res?.data?.user);
        navigate("/", {
          replace: true,
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-between">
      <div className="h-full w-1/2 bg-gradient-to-br from-red-800 to-red-950 flex flex-col px-20 items-center justify-center">
        <h2 className="font-extrabold text-3xl mb-3">Login</h2>
        <p className="text-xl mb-5 text-center leading-6 font-medium">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
          eligendi, itaque corrupti rerum inventore nam, explicabo, cum
          voluptatem accusantium amet veritatis quod perspiciatis et laudantium
          quisquam aspernatur maiores magni debitis.
        </p>
        <Button>
          <Link to={"/register"} replace>
            Don't have an account? <span className="underline">Register</span>
          </Link>
        </Button>
      </div>
      <div className="md:w-1/2 w-full h-full">
        {/* form */}
        <form
          onSubmit={submitHandler}
          className="space-y-5 flex flex-col items-center justify-center h-full px-20"
        >
          <div className="w-full">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={valueChangeHandler}
              name="email"
              placeholder="e.g. asharma.19042007@gmail.com"
            />
          </div>
          <div className="w-full">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={valueChangeHandler}
              name="password"
              placeholder="**********"
            />
          </div>
          <p className="text-end w-full -mt-5">
            Don't have an account?{" "}
            <Link
              className="underline text-blue-600 hover:text-blue-700"
              to={"/register"}
              replace
            >
              register
            </Link>
          </p>
          <div className="w-full">
            {loading ? (
              <>
                <Button className="w-full" disabled>
                  <Loader2 className="animate-spin h-4 w-4" /> Please Wait...
                </Button>
              </>
            ) : (
              <>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
