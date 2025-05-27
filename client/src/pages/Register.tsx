import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const valueChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(

        `${import.meta.env.VITE_BACKEND_URL}/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        toast.success(res?.data?.message || "Register Successfuly");
        navigate("/login", {
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
      <div className="md:w-1/2 w-full h-full">
        {/* form */}
        <form
          onSubmit={submitHandler}
          className="space-y-5 flex flex-col items-center justify-center h-full px-20"
        >
          <div className="w-full">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              value={formData.username}
              onChange={valueChangeHandler}
              name="username"
              placeholder="e.g. aks__y19"
            />
          </div>
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
          <div className="w-full">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={valueChangeHandler}
              name="confirmPassword"
              placeholder="**********"
            />
          </div>
          <p className="text-end w-full -mt-5">
            Already have an account?{" "}
            <Link
              replace
              className="underline text-blue-600 hover:text-blue-700"
              to={"/login"}
            >
              Login
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
                  Register
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
      <div className="h-full w-1/2 bg-gradient-to-br from-red-800 to-red-950 flex flex-col px-20 items-center justify-center">
        <h2 className="font-extrabold text-3xl mb-3">Register</h2>
        <p className="text-xl mb-5 text-center leading-6 font-medium">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
          eligendi, itaque corrupti rerum inventore nam, explicabo, cum
          voluptatem accusantium amet veritatis quod perspiciatis et laudantium
          quisquam aspernatur maiores magni debitis.
        </p>
        <Button>
          <Link to={"/login"} replace>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Register;
