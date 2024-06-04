import CommunityForm from "@/components/community/CommunityForm";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import {Role} from "@prisma/client";
import {getAuthSession} from "@/lib/auth";
import NoPermissionPage from "@/components/NoPermissionPage";

export default async function Page({params: {slug}}: {params: {slug: string}}) {
  const session = await getAuthSession();

  if (session?.user.role !== Role.ADMIN || !session?.user) {
    return <NoPermissionPage />;
  }

  const community = await prisma.community.findFirstOrThrow({
    where: {
      slug: slug,
    },
  });

  return (
    <ScrollArea className="h-full flex-1 space-y-4 p-6">
      <div className="pb-2">
        <h3 className="text-lg font-medium">Update community</h3>
      </div>
      <Separator />
      {/* <AccountForm /> */}
      <div className="px-52">
        <CommunityForm defaultValues={community} />
      </div>
    </ScrollArea>
  );
}
