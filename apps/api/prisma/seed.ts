import 'dotenv/config';
import { PrismaClient, Role } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

const users = [
  {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    password: 'password123',
    role: Role.ADMIN,
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    password: 'password123',
    role: Role.MANAGER,
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    password: 'password123',
    role: Role.MANAGER,
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    password: 'password123',
    role: Role.EMPLOYEE,
  },
  {
    name: 'David Thompson',
    email: 'david.thompson@example.com',
    password: 'password123',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    password: 'password123',
    role: Role.EMPLOYEE,
  },
  {
    name: 'James Martinez',
    email: 'james.martinez@example.com',
    password: 'password123',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Rachel Kim',
    email: 'rachel.kim@example.com',
    password: 'password123',
    role: Role.EMPLOYEE,
  },
  {
    name: "Kevin O'Connor",
    email: 'kevin.oconnor@example.com',
    password: 'password123',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Maya Patel',
    email: 'maya.patel@example.com',
    password: 'password123',
    role: Role.EMPLOYEE,
  },
  {
    name: 'John Davis',
    email: 'john.davis@example.com',
    password: 'password123',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Sophia Williams',
    email: 'sophia.williams@example.com',
    password: 'password123',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Daniel Brown',
    email: 'daniel.brown@example.com',
    password: 'password123',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Olivia Miller',
    email: 'olivia.miller@example.com',
    password: 'password123',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Ryan Taylor',
    email: 'ryan.taylor@example.com',
    password: 'password123',
    role: Role.EMPLOYEE,
  },
];

const topics = [
  { label: 'Problem solving' },
  { label: 'Error handling' },
  { label: 'Concurrency' },
  { label: 'Test Coverage' },
  { label: 'Programming paradigms' },
  { label: 'Design patterns' },
  { label: 'SWD Principles' },
  { label: 'Design System' },
  { label: 'Programming styles' },
  { label: 'Web browser' },
  { label: 'IDE' },
  { label: 'VCS-Git' },
  { label: 'React' },
  { label: 'Next.js' },
  { label: 'Typescript' },
  { label: 'Build tools-webpack, vite' },
  {
    label:
      'State management-Zustand, Redux, RTK, RTK query/React query/SWR, NgRx',
  },
  { label: 'Form management-React hook form/Formik, ZOD' },
  { label: 'UI toolkit-Headless UI toolkit, storybook' },
  { label: 'Styling-CSS, SCSS, Style components, Tailwind' },
];

async function main() {
  console.log('🌱 Seeding database...\n');

  // Upsert users
  const createdUsers = [];
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: { name: userData.name, role: userData.role },
      create: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      },
    });
    createdUsers.push(user);
    console.log(`  ✓ User: ${user.name} (${user.email})`);
  }

  // Upsert topics
  const createdTopics = [];
  for (const topicData of topics) {
    let topic = await prisma.topic.findFirst({
      where: { label: topicData.label },
    });
    if (!topic) {
      topic = await prisma.topic.create({ data: { label: topicData.label } });
    }
    createdTopics.push(topic);
    console.log(`  ✓ Topic: ${topic.label}`);
  }

  // Seed skill matrix with realistic skillLevel (0-100) for every user × topic
  console.log('\n  Seeding skill matrix...');
  for (const user of createdUsers) {
    for (const topic of createdTopics) {
      // Generate realistic skill distribution:
      // - 30% chance of high skill (70-100)
      // - 40% chance of medium skill (40-69)
      // - 30% chance of low skill (0-39)
      const rand = Math.random();
      let value: number;
      if (rand < 0.3) {
        value = Math.floor(Math.random() * 31) + 70; // 70-100
      } else if (rand < 0.7) {
        value = Math.floor(Math.random() * 30) + 40; // 40-69
      } else {
        value = Math.floor(Math.random() * 40); // 0-39
      }

      await prisma.skillMatrix.upsert({
        where: {
          userId_topicId: { userId: user.id, topicId: topic.id },
        },
        update: { value },
        create: {
          userId: user.id,
          topicId: topic.id,
          value,
        },
      });
    }
    console.log(`  ✓ Skills for ${user.name}: ${createdTopics.length} topics`);
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
