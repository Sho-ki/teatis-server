import {execSync} from "child_process";
import {URL} from "url";
import {join} from "path";
import {v4} from "uuid";
import {PrismaClient} from "@prisma/client";

const generateDatabaseURL = (schema: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('please provide a database url');
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.append('schema', schema);
  return url.toString();
};

const prismaBinary = join(__dirname, '..', '..', 'node_modules', '.bin', 'prisma');
const schemaId = `test-${v4()}`;

const url = generateDatabaseURL(schemaId);
process.env.DATABASE_URL = url;

export const prismaForTest = new PrismaClient({
  datasources: { db: { url } },
});

export const setUpPrismaClient = () => {
  execSync(`${prismaBinary} db push --skip-generate`, {
    env: {
      ...process.env,
      DATABASE_URL: generateDatabaseURL(schemaId),
    },
  });
}

export const cleanUpPrismaClient = async () => {
  await prismaForTest.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`);
  await prismaForTest.$disconnect();
}

