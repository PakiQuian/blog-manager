import { Hono } from "hono";
import { ObjectId } from "mongodb";
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

publicRoutes.get("/authors/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) {
    return c.json({ error: "Autor no encontrado" }, 404);
  }

  const author = await db.collection("user").findOne({ _id: new ObjectId(id) });
  if (!author) {
    return c.json({ error: "Autor no encontrado" }, 404);
  }

  const articles = await db
    .collection("articles")
    .find({ userId: id })
    .sort({ createdAt: -1 })
    .project({ title: 1, coverImageUrl: 1, createdAt: 1, content: 1 })
    .toArray();

  return c.json({
    userId: id,
    name: author.name,
    email: author.email,
    articleCount: articles.length,
    articles: articles.map((a) => ({
      _id: a._id,
      title: a.title,
      coverImageUrl: a.coverImageUrl,
      createdAt: a.createdAt,
      excerpt: typeof a.content === "string" ? a.content.slice(0, 180) : "",
    })),
  });
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
