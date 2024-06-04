import { ProfileForm } from '@/components/user/ProfileForm';
import prisma from '@/lib/prisma';
import React from 'react'

const page = async ({params: {username}}: {params: {username: string}}) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      username: username,
    }
  })
  return <ProfileForm user={user} />;
}

export default page