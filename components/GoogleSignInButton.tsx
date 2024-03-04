import { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

interface GoogleSignInButtonProps {
  children: ReactNode;
}
const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  return (
    <Button
      onClick={() =>
        signIn("google", {
          callbackUrl: "/",
        })
      }
      className="w-full"
    >
      {children}
    </Button>
  );
};

export default GoogleSignInButton;
