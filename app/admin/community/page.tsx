import NoPermissionPage from "@/components/NoPermissionPage";
import {CommunityClient} from "@/components/tables/community-tables/client";
import {getAuthSession} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {CommunityTable} from "@/types";
import {Role} from "@prisma/client";
import {format} from "date-fns";

export default async function page() {
  const session = await getAuthSession();

  if (session?.user.role !== Role.ADMIN || !session?.user) {
    return <NoPermissionPage />;
  }

  const communities = await prisma.community.findMany({
    include: {
      creator: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const tableData: CommunityTable[] = communities?.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    title: item.title,
    description: item.description,
    profileImage: item.profileImage,
    createdAt: format(item.createdAt?.toDateString() || "", "MMMM d, yyyy"),
    status: item.isActive ? "Active" : "Inactive",
    createBy: item.creator?.name || null,
  }));

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <CommunityClient data={tableData} />
      </div>
    </>
  );
}
