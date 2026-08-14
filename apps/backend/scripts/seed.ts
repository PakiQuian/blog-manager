import "dotenv/config";
import { auth } from "../src/auth.js";
import { client, db } from "../src/db.js";

const demoUsers = [
  { name: "Isaac Newton", email: "isaac@example.com", password: "password123" },
  { name: "Marie Curie", email: "marie@example.com", password: "password123" },
  { name: "Ada Lovelace", email: "ada@example.com", password: "password123" },
];

const articlesByEmail: Record<string, { title: string; content: string }[]> = {
  "isaac@example.com": [
    {
      title: "Las leyes del movimiento",
      content:
        "Un cuerpo en reposo permanece en reposo, y un cuerpo en movimiento permanece en movimiento, a menos que actúe sobre él una fuerza externa.",
    },
    {
      title: "La gravitación universal",
      content:
        "Dos cuerpos cualesquiera se atraen con una fuerza directamente proporcional al producto de sus masas e inversamente proporcional al cuadrado de la distancia entre ellos.",
    },
  ],
  "marie@example.com": [
    {
      title: "El descubrimiento del radio",
      content:
        "Investigar la radiactividad significó aislar elementos nunca antes observados, trabajando con cantidades ínfimas de material altamente inestable.",
    },
  ],
  "ada@example.com": [
    {
      title: "Notas sobre la máquina analítica",
      content:
        "La máquina analítica no tiene pretensiones de originar nada. Puede hacer todo lo que sepamos ordenarle que ejecute.",
    },
    {
      title: "Sobre los números de Bernoulli",
      content:
        "Un algoritmo escrito para ser ejecutado por una máquina, aunque la máquina en cuestión todavía no exista más que en el papel.",
    },
  ],
};

async function seed() {
  console.log("Seeding demo data...");

  for (const demoUser of demoUsers) {
    const existing = await db.collection("user").findOne({ email: demoUser.email });
    let userId: string;

    if (existing) {
      userId = String(existing._id);
      console.log(`  user ${demoUser.email} already exists, reusing`);
    } else {
      const result = await auth.api.signUpEmail({
        body: { email: demoUser.email, password: demoUser.password, name: demoUser.name },
      });
      userId = result.user.id;
      console.log(`  created user ${demoUser.email}`);
    }

    const articles = articlesByEmail[demoUser.email] ?? [];
    await db.collection("articles").deleteMany({ userId });

    if (articles.length > 0) {
      const now = new Date();
      await db.collection("articles").insertMany(
        articles.map((article) => ({
          userId,
          title: article.title,
          content: article.content,
          createdAt: now,
          updatedAt: now,
        })),
      );
      console.log(`  inserted ${articles.length} article(s) for ${demoUser.email}`);
    }
  }

  console.log("\nDone. Demo accounts (password for all: password123):");
  for (const demoUser of demoUsers) {
    console.log(`  ${demoUser.email}`);
  }

  await client.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
