import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";

export default async function SettingsProfilePage() {
  const session = await getSession()

  const user = await prisma.user.findFirst({
    where: {
      id: session?.user.id
    },
    select: {
      username: true,
      bio: true,
      dateOfBirth: true,
      name: true,
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  )
}
