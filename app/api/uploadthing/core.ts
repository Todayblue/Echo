// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {getAuthSession} from "@/lib/auth";
import {createUploadthing, type FileRouter} from "uploadthing/next";
import {UploadThingError} from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
// export const ourFileRouter = {
//   // Define as many FileRoutes as you like, each with a unique routeSlug
//   imageUploader: f({image: {maxFileSize: "4MB", maxFileCount: 1}})
//     // Set permissions and file types for this FileRoute
//     .middleware(async ({req}) => {
//       // const { getUser } = getKindeServerSession();
//       // const user = await getUser();
//       const session = await getAuthSession();

//       // If you throw, the user will not be able to upload
//       if (!session?.user) throw new UploadThingError("please log in");

//       // Whatever is returned here is accessible in onUploadComplete as `metadata`
//       return {userId: session.user.id};
//     })
//     .onUploadComplete(async ({metadata, file}) => {
//       // This code RUNS ON YOUR SERVER after upload
//       console.log("Upload complete for userId:", metadata.userId);

//       console.log("file url", file.url);

//       // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
//       return {uploadedBy: metadata.userId};
//     }),
// } satisfies FileRouter;

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
