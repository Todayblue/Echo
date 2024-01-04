"use client";
import React from "react";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

type AlertDialogDeleteProps = {
  session: {
    user: {
      id: string;
    };
  };
  communitySlug: string | null;
  ruleId: string;
};

export const AlertDialogDelete = ({
  session,
  communitySlug,
  ruleId,
}: AlertDialogDeleteProps) => {
  const router = useRouter();

  const editCommunityRule = async () => {
    const { data } = await axios.delete(
      `/api/community/${communitySlug}/rules/${ruleId}`
    );
    return data;
  };

  const { mutate: deleteRule, isPending } = useMutation({
    mutationFn: () => editCommunityRule(),
    onError: (err) => {
      toast({
        title: "There was an error.",
        description: "Could not Delete rules.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "The rule has been successfully deleted. 🚀",
        variant: "default",
        duration: 2000,
      });
      setTimeout(() => {
        router.push(`/community/${communitySlug}`);
        router.refresh();
      }, 1000);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to delete this rule?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => deleteRule()}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
