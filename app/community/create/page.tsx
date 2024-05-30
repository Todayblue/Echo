import CommunityForm from "@/components/community/CommunityForm";
import {Separator} from "@/components/ui/separator";
import {getAuthSession} from "@/lib/auth";

export default async function Page({params: {slug}}: {params: {slug: string}}) {
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
