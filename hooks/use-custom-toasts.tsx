import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";

export const useCustomToasts = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login required.",
      description: "You need to be logged in to do that.",
      variant: "destructive",
      action: (
        <Button
          className={`text-gray-700 ${buttonVariants({ variant: "ghost" })}`}
          variant="outline"
          onClick={() => signIn("google")}
        >
          Sign in
        </Button>
      ),
    });
  };

  return { loginToast };
};
