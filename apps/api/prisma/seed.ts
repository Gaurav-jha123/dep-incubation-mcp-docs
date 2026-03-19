import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

const users = [
  { name: 'Admin User', email: 'admin@example.com', password: 'admin123' },
  { name: 'John Doe', email: 'john@example.com', password: 'password123' },
  { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
  },
  { name: 'Bob Williams', email: 'bob@example.com', password: 'password123' },
];

const topics = [
  {
    name: 'JavaScript',
    description: 'Core JavaScript fundamentals and ES6+ features',
  },
  {
    name: 'TypeScript',
    description: 'TypeScript type system, generics, and advanced patterns',
  },
  {
    name: 'React',
    description: 'React hooks, state management, and component patterns',
  },
  {
    name: 'Node.js',
    description: 'Server-side JavaScript with Node.js and Express/NestJS',
  },
  {
    name: 'SQL',
    description: 'Relational databases, query optimization, and schema design',
  },
  {
    name: 'Docker',
    description: 'Containerization, Docker Compose, and deployment',
  },
  {
    name: 'Git',
    description: 'Version control, branching strategies, and collaboration',
  },
  {
    name: 'Testing',
    description: 'Unit testing, integration testing, and E2E testing',
  },
  {
    name: 'CSS',
    description: 'Modern CSS, Flexbox, Grid, and responsive design',
  },
  {
    name: 'System Design',
    description: 'Architecture patterns, scalability, and distributed systems',
  },
];

async function main() {
  console.log('🌱 Seeding database...\n');

  // Upsert users
  const createdUsers = [];
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: { name: userData.name },
      create: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      },
    });
    createdUsers.push(user);
    console.log(`  ✓ User: ${user.name} (${user.email})`);
  }

  // Upsert topics
  const createdTopics = [];
  for (const topicData of topics) {
    // Find existing or create
    let topic = await prisma.topic.findFirst({
      where: { name: topicData.name },
    });
    if (!topic) {
      topic = await prisma.topic.create({ data: topicData });
    }
    createdTopics.push(topic);
    console.log(`  ✓ Topic: ${topic.name}`);
  }

  // Seed skill matrix entries
  console.log('\n  Seeding skill matrix...');
  for (const user of createdUsers) {
    // Each user gets skills for a random subset of topics
    const topicCount = Math.floor(Math.random() * 5) + 4; // 4-8 topics per user
    const shuffled = [...createdTopics].sort(() => 0.5 - Math.random());
    const selectedTopics = shuffled.slice(0, topicCount);

    for (const topic of selectedTopics) {
      const skillLevel = Math.floor(Math.random() * 5) + 1; // 1-5 skill level
      await prisma.skillMatrix.upsert({
        where: {
          userId_topicId: { userId: user.id, topicId: topic.id },
        },
        update: { skillLevel },
        create: {
          userId: user.id,
          topicId: topic.id,
          skillLevel,
        },
      });
    }
    console.log(`  ✓ Skills for ${user.name}: ${selectedTopics.length} topics`);
  }

  console.log('\n✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
