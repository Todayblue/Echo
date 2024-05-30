import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");

  if (!q) return new Response("Invalid query", {status: 400});

  const searchTerms = q.split(" ");

  const results = await prisma.community.findMany({
    where: {
      isActive: true,
      OR: searchTerms.map((term) => ({
        slug: {
          contains: term,
          mode: "insensitive",
        },
      })),
    },
    include: {
      _count: true,
    },
    take: 5,
  });

  return new Response(JSON.stringify(results));
}
