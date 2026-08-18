import { Hono } from "hono";
import { ObjectId } from "mongodb";
import { auth } from "../auth.js";
import { db } from "../db.js";
import { requireAuth } from "../middleware/require-auth.js";
import { articleInputSchema, paginationSchema } from "../schemas/article.js";
import type { Variables } from "../types.js";

type UserDoc = { _id: ObjectId; name: string; email: string };

const articles = new Hono<{ Variables: Variables }>();
const collection = () => db.collection("articles");
const users = () => db.collection<UserDoc>("user");

function queryParams(url: string) {
  return Object.fromEntries(new URL(url).searchParams);
}

articles.post("/", requireAuth, async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = articleInputSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Datos inválidos", details: parsed.error.flatten() }, 400);
  }

  const user = c.get("user");
  const now = new Date();
  const doc = {
    userId: user.id,
    title: parsed.data.title,
    content: parsed.data.content,
    coverImageUrl: parsed.data.coverImageUrl || undefined,
    createdAt: now,
    updatedAt: now,
  };
  const result = await collection().insertOne(doc);
  return c.json({ _id: result.insertedId, ...doc }, 201);
});

articles.get("/", requireAuth, async (c) => {
  const parsed = paginationSchema.safeParse(queryParams(c.req.url));
  if (!parsed.success) {
    return c.json({ error: "Parámetros de paginación inválidos" }, 400);
  }
  const { page, limit } = parsed.data;
  const user = c.get("user");
  const filter = { userId: user.id };

  const [items, total] = await Promise.all([
    collection()
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    collection().countDocuments(filter),
  ]);

  return c.json({ items, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) });
});

articles.get("/:id", async (c) => {
  const id = c.req.param("id");
  if (!ObjectId.isValid(id)) {
    return c.json({ error: "Artículo no encontrado" }, 404);
  }

  const article = await collection().findOne({ _id: new ObjectId(id) });
  if (!article) {
    return c.json({ error: "Artículo no encontrado" }, 404);
  }

  const author = await users().findOne({ _id: new ObjectId(article.userId) });
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const isOwner = session?.user.id === article.userId;

  return c.json({
    _id: article._id,
    title: article.title,
    content: article.content,
    coverImageUrl: article.coverImageUrl,
    createdAt: article.createdAt,
    authorName: author?.name ?? "Autor desconocido",
    authorId: article.userId,
    isOwner,
  });
});

articles.put("/:id", requireAuth, async (c) => {
  const id = c.req.param("id");
  if (!id || !ObjectId.isValid(id)) {
    return c.json({ error: "Artículo no encontrado" }, 404);
  }

  const body = await c.req.json().catch(() => null);
  const parsed = articleInputSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Datos inválidos", details: parsed.error.flatten() }, 400);
  }

  const user = c.get("user");
  const existing = await collection().findOne({ _id: new ObjectId(id) });
  if (!existing) {
    return c.json({ error: "Artículo no encontrado" }, 404);
  }
  if (existing.userId !== user.id) {
    return c.json({ error: "No autorizado para editar este artículo" }, 403);
  }

  await collection().updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: parsed.data.title,
        content: parsed.data.content,
        coverImageUrl: parsed.data.coverImageUrl || undefined,
        updatedAt: new Date(),
      },
    },
  );

  const updated = await collection().findOne({ _id: new ObjectId(id) });
  return c.json(updated);
});

articles.delete("/:id", requireAuth, async (c) => {
  const id = c.req.param("id");
  if (!id || !ObjectId.isValid(id)) {
    return c.json({ error: "Artículo no encontrado" }, 404);
  }

  const user = c.get("user");
  const existing = await collection().findOne({ _id: new ObjectId(id) });
  if (!existing) {
    return c.json({ error: "Artículo no encontrado" }, 404);
  }
  if (existing.userId !== user.id) {
    return c.json({ error: "No autorizado para eliminar este artículo" }, 403);
  }

  await collection().deleteOne({ _id: new ObjectId(id) });
  return c.json({ ok: true });
});

export default articles;
