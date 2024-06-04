"use client";
import {AlertModal} from "@/components/modal/alert-modal";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useToast} from "@/hooks/use-toast";
import {BlogTable} from "@/types";
import axios from "axios";
import {Edit, MoreHorizontal, Trash} from "lucide-react";
import {useRouter} from "next-nprogress-bar";
import {useState} from "react";

interface CellActionProps {
  data: BlogTable;
}

export const CellAction: React.FC<CellActionProps> = ({data}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const {toast} = useToast();

  const onConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/blog/${data.slug}`);
      toast({
        title: "Success",
        duration: 2000,
      });
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/admin/blog/${data.slug}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
