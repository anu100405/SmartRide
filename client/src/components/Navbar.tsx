import { LocationEdit } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
  const user = true;

  return (
    <div className="w-full h-16 flex items-center justify-between px-9">
      <div className="flex items-center gap-5">
        <LocationEdit size={40} />
        <p className="text-2xl font-bold uppercase">Cab Share</p>
      </div>
      <div>
        {user ? (
          <div>
            <Avatar className="h-12 w-12">
                <AvatarImage src="" />
                <AvatarFallback>AK</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <Button>Login</Button>
            <Button variant={"outline"}>Register</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
