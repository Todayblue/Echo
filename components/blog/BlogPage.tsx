// "use client";
// import React, { useState } from "react";
// import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import Link from "next/link";
// import { BLOG_ITEM_PER_PAGE } from "@/lib/constants";
// import BlogList from "./BlogList";
// import axios from "axios";
// import { Blog, Tag, User } from "@prisma/client";
// import BlogPagination from "../BlogPagination";

// type ExtendedBlogProps = Blog & {
//   tags: Tag[];
//   author: User;
// };

// type BlogProps = {
//   tags: Tag[];
// };

// type BlogData = {
//   blogCount: number;
//   blogs: ExtendedBlogProps[];
// };

// // const getBlogsByTagId = async (page: number, limit: number, id: number) => {
// //   const url = `/api/blog/?tagId=${id}&page=${page}&limit=${limit}`;
// //   return await fetchBlogs(url);
// // };

// const BlogPage = () => {
//   // const {
//   //   data: blogsQueryByTag,
//   //   isPlaceholderData: isPlaceholdersData,
//   //   isFetching: isLoadingBlogsByTag,
//   //   refetch: refetchByTag,
//   // } = useQuery({
//   //   queryKey: ["blogs", page],
//   //   queryFn: () => getBlogsByTagId(page, BLOG_ITEM_PER_PAGE, tagId),
//   //   placeholderData: keepPreviousData,
//   // });

//   // const handleTagClick = (id: number) => {
//   //   setPage(1);
//   //   setTagId(id);
//   //   refetchByTag();
//   // };

//   // const currentBlogs = tagId ? blogsQueryByTag : blogsQuery;

//   // if (!currentBlogs) {
//   //   return null;
//   // }

//   return (
//     <div className="bg-white h-screen pt-2">
//       <div className="grid mx-auto w-4/5 gap-x-6 py-6">
//         <div className="flex flex-col">
//           <button className="text-2xl font-semibold text-gray-800 dark:text-gray-100 sm:text-3xl sm:leading-10 md:text-5xl md:leading-14">
//             All Posts
//           </button>
//           <div className="divider my-2"></div>
//           <ul className="flex flex-wrap">
//             <div className="flex flex-row flex-wrap">
//               <div className="mr-4 text-gray-900">Tags</div>
//               {tags.map((tag) => (
//                 <li key={tag.id}>
//                   <button className="hover:text-sky-500 capitalize text-gray-500 text-sm font-medium mr-4">
//                     {tag.name.toLowerCase()}
//                   </button>
//                 </li>
//               ))}
//             </div>
//           </ul>
//         </div>

//         <div className="pt-6 ">
//           {/* <BlogList
//             blogs={currentBlogs.blogs}
//             isLoading={tagId != 0 ? isLoadingBlogsByTag : isLoadingBlogs}
//           /> */}
//         </div>
//         <div className="flex justify-end pt-3 pb-6">
//           {/* <BlogPagination
//             isLoading={tagId != 0 ? isLoadingBlogsByTag : isLoadingBlogs}
//             currentPage={page}
//             isPreviousData={
//               tagId !== 0 ? isPlaceholdersData : isPlaceholderData
//             }
//             url={`/blog/?page=`}
//             totalItems={currentBlogs.blogCount}
//             onPageChange={(page) => setPage(page)}
//           /> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogPage;
