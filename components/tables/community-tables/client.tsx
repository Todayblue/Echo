"use client";
import {Button} from "@/components/ui/button";
import {DataTable} from "@/components/ui/data-table";
import {Heading} from "@/components/ui/heading";
import {Separator} from "@/components/ui/separator";
import {Plus} from "lucide-react";
import {useRouter} from "next-nprogress-bar";
import {columns} from "./columns";
import {CommunityTable} from "@/types";

interface ProductsClientProps {
  data: CommunityTable[];
}

export const CommunityClient: React.FC<ProductsClientProps> = ({data}) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Community (${data.length})`}
          description="Manage communities"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/admin/community/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
