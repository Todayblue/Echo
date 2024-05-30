"use client";
import {Button} from "@/components/ui/button";
import {DataTable} from "@/components/ui/data-table";
import {Heading} from "@/components/ui/heading";
import {Separator} from "@/components/ui/separator";
import {Plus} from "lucide-react";
import {useRouter} from "next-nprogress-bar";
import {columns} from "./columns";
import {BlogTable, CommunityTable} from "@/types";

interface BlogsClientProps {
  data: BlogTable[];
}

export const BlogClient: React.FC<BlogsClientProps> = ({data}) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Blog (${data.length})`} description="Manage blogs" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/admin/blog/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="title" columns={columns} data={data} />
    </>
  );
};
