import { LocationEdit } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  const user = true;

  return (
    <div className="w-full h-16 flex items-center justify-between px-9 fixed bg-gradient-to-b from-black to-transparent z-[999] opacity-65">
      <div className="flex items-center gap-5">
        <LocationEdit size={40} />
        <p className="text-2xl font-bold uppercase">Cab Share</p>
      </div>
      <div className="flex items-center justify-center gap-5">
        {user ? (
          <div>
            <Avatar className="h-10 w-10">
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
        <div className="z-[999]">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
