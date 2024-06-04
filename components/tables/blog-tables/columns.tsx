"use client";
import {ColumnDef} from "@tanstack/react-table";
import {BlogTable, CommunityTable} from "@/types"; // Adjust the import path as needed
import {CellAction} from "./cell-action"; // Adjust the import path as needed
import {Badge} from "@/components/ui/badge";

export const columns: ColumnDef<BlogTable>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "TITLE",
  },
  {
    accessorKey: "coverImage",
    header: "IMAGE",
    cell: ({row}) => (
      <img
        className="w-32 h-16 rounded-sm object-cover"
        src={row.original.coverImage || ""}
        alt="img"
      />
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({row}) => (
      <>
        {row.original.tags
          ? row.original.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="mx-1">
                {tag}
              </Badge>
            ))
          : ""}
      </>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "CREATED AT",
    cell: ({row}) => <p className="min-w-28">{row.original.createdAt}</p>,
  },
  {
    accessorKey: "createBy",
    header: "CREATED BY",
    cell: ({row}) => <p className="min-w-28">{row.original.createBy}</p>,
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original} />,
  },
];
