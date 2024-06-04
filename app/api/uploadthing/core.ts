// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {getAuthSession} from "@/lib/auth";
import {createUploadthing, type FileRouter} from "uploadthing/next";
import {UploadThingError} from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  // Example "profile picture upload" route - these can be named whatever you want!
  profilePicture: f(["image"])
    .middleware(async ({req}) => {
      const session = await getAuthSession();

      // If you throw, the user will not be able to upload
      if (!session?.user) throw new UploadThingError("please log in");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {userId: session.user.id};
    })
    .onUploadComplete((data) => console.log("file", data)),

  // This route takes an attached image OR video
  messageAttachment: f(["image", "video"])
    .middleware(async ({req}) => {
      const session = await getAuthSession();

      // If you throw, the user will not be able to upload
      if (!session?.user) throw new UploadThingError("please log in");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {userId: session.user.id};
    })
    .onUploadComplete((data) => console.log("file", data)),

  // Takes exactly ONE image up to 2MB
  strictImageAttachment: f({
    image: {maxFileSize: "2MB", maxFileCount: 1, minFileCount: 1},
  })
    .middleware(async ({req}) => {
      const session = await getAuthSession();

      // If you throw, the user will not be able to upload
      if (!session?.user) throw new UploadThingError("please log in");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {userId: session.user.id};
    })
    .onUploadComplete((data) => console.log("file", data)),

  // Takes up to 4 2mb images and/or 1 256mb video
  mediaPost: f({
    image: {maxFileSize: "2MB", maxFileCount: 4},
    video: {maxFileSize: "256MB", maxFileCount: 1},
  })
    .middleware(async ({req}) => {
      const session = await getAuthSession();

      // If you throw, the user will not be able to upload
      if (!session?.user) throw new UploadThingError("please log in");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {userId: session.user.id};
    })
    .onUploadComplete((data) => console.log("file", data)),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
