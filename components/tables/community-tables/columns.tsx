"use client";
import {ColumnDef} from "@tanstack/react-table";
import {CommunityTable} from "@/types"; // Adjust the import path as needed
import {CellAction} from "./cell-action"; // Adjust the import path as needed

export const columns: ColumnDef<CommunityTable>[] = [
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "title",
    header: "TITLE",
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
  },
  {
    accessorKey: "profileImage",
    header: "IMAGE",
    cell: ({row}) => (
      <img
        className="w-10 h-10 rounded-full"
        src={row.original.profileImage || ""}
        alt="img"
      />
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
    accessorKey: "status",
    header: "STATUS",
  },
  {
    id: "actions",
    cell: ({row}) => <CellAction data={row.original} />,
  },
];
