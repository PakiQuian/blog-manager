import { Hono } from "hono";
import { db } from "../db.js";
import { searchSchema } from "../schemas/article.js";

const publicRoutes = new Hono();

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

publicRoutes.get("/authors", async (c) => {
  const results = await db
    .collection("articles")
    .aggregate([
      { $group: { _id: "$userId", articleCount: { $sum: 1 } } },
      { $addFields: { authorId: { $toObjectId: "$_id" } } },
      { $lookup: { from: "user", localField: "authorId", foreignField: "_id", as: "author" } },
      { $unwind: "$author" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$author.name",
          email: "$author.email",
          articleCount: 1,
        },
      },
      { $sort: { articleCount: -1 } },
    ])
    .toArray();

  return c.json(results);
});

publicRoutes.get("/search", async (c) => {
  const parsed = searchSchema.safeParse(Object.fromEntries(new URL(c.req.url).searchParams));
  if (!parsed.success) {
    return c.json({ items: [] });
  }

  const regex = new RegExp(escapeRegex(parsed.data.q), "i");
  const matchingAuthors = await db.collection("user").find({ name: regex }).project({ _id: 1 }).toArray();
  const authorIds = matchingAuthors.map((a) => a._id.toString());

  const items = await db
    .collection("articles")
    .aggregate([
      { $match: { $or: [{ title: regex }, { content: regex }, { userId: { $in: authorIds } }] } },
      { $addFields: { authorId: { $toObjectId: "$userId" } } },
      { $lookup: { from: "user", localField: "authorId", foreignField: "_id", as: "author" } },
      { $unwind: "$author" },
      {
        $project: {
          title: 1,
          coverImageUrl: 1,
          createdAt: 1,
          authorName: "$author.name",
          excerpt: { $substrCP: ["$content", 0, 180] },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 30 },
    ])
    .toArray();

  return c.json({ items });
});

export default publicRoutes;
