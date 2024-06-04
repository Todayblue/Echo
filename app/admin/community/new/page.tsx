import CommunityForm from "@/components/community/CommunityForm";
import {Separator} from "@/components/ui/separator";
import {Role} from "@prisma/client";
import {getAuthSession} from "@/lib/auth";
import NoPermissionPage from "@/components/NoPermissionPage";

export default async function Page({params: {slug}}: {params: {slug: string}}) {
  const session = await getAuthSession();

  if (session?.user.role !== Role.ADMIN || !session?.user) {
    return <NoPermissionPage />;
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <div>
        <h3 className="text-lg font-medium">Create community</h3>
      </div>
      <Separator />
      {/* <AccountForm /> */}
      <div className="px-40">
        <CommunityForm />
      </div>
    </div>
  );
}
