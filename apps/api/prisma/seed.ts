import 'dotenv/config';
import {
  PrismaClient,
  Role,
  ProjectType,
  ProjectStatus,
} from '../src/generated/prisma/client.js';
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

const subtopicsData: Record<string, { label: string }[]> = {
  'Problem solving': [
    { label: 'Recursion' },
    { label: 'Sliding window' },
    { label: 'Two pointers' },
    { label: 'Dynamic programming' },
  ],
  React: [
    { label: 'Hooks (useState, useEffect)' },
    { label: 'Components & Props' },
    { label: 'Context API' },
    { label: 'JSX & Rendering' },
  ],
  Typescript: [
    { label: 'Types & Interfaces' },
    { label: 'Generics' },
    { label: 'Advanced Types' },
  ],
  'Next.js': [
    { label: 'App Router' },
    { label: 'Server Components' },
    { label: 'API Routes' },
  ],
  'Design patterns': [
    { label: 'Singleton' },
    { label: 'Observer' },
    { label: 'Factory' },
  ],
};

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

  // Seed subtopics linked to topics
  console.log('\n  Seeding subtopics...');
  for (const topic of createdTopics) {
    const subtopics = subtopicsData[topic.label] || [];
    for (const subtopicData of subtopics) {
      try {
        // Try to find existing subtopic
        const existingSubTopic = await prisma.subTopic.findFirst({
          where: {
            label: subtopicData.label,
            topicId: topic.id,
          },
        });

        if (!existingSubTopic) {
          const subTopic = await prisma.subTopic.create({
            data: {
              label: subtopicData.label,
              topicId: topic.id,
            },
          });
          console.log(
            `    ✓ Added subtopic "${subTopic.label}" to "${topic.label}"`,
          );
        } else {
          console.log(
            `    ⚠ Subtopic "${existingSubTopic.label}" already exists for "${topic.label}"`,
          );
        }
      } catch (error) {
        console.log(
          `    ❌ Error creating subtopic "${subtopicData.label}" for "${topic.label}":`,
          error.message,
        );
      }
    }
    if (subtopics.length > 0) {
      console.log(
        `  ✓ Processed ${subtopics.length} subtopics for: ${topic.label}`,
      );
    }
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

  // Seed projects
  console.log('\n  Seeding projects...');
  await prisma.projectAssignment.deleteMany();
  await prisma.projectSkill.deleteMany();
  await prisma.project.deleteMany();

  const projectsData = [
    {
      name: 'Client Portal Alpha',
      description:
        'Customer-facing portal for Acme Corp with dashboards and reporting',
      type: ProjectType.CLIENT,
      status: ProjectStatus.ACTIVE,
      clientName: 'Acme Corp',
      startDate: new Date('2025-09-01'),
      skillTopicIndexes: [12, 14, 16, 19, 0], // React, TypeScript, State mgmt, Styling, Problem solving
      assigneeIndexes: [0, 1, 3, 4], // Alex(ADMIN), Sarah(MGR), Emily, David
    },
    {
      name: 'FinTech Analytics Suite',
      description:
        'Real-time analytics platform for a financial services client',
      type: ProjectType.CLIENT,
      status: ProjectStatus.ACTIVE,
      clientName: 'NorthStar Financial',
      startDate: new Date('2025-11-15'),
      skillTopicIndexes: [0, 2, 3, 14, 15], // Problem solving, Concurrency, Test Coverage, TypeScript, Build tools
      assigneeIndexes: [2, 5, 6, 7], // Michael(MGR), Lisa, James, Rachel
    },
    {
      name: 'Legacy Migration Project',
      description:
        'Migration of legacy CRM from AngularJS to React + TypeScript',
      type: ProjectType.CLIENT,
      status: ProjectStatus.COMPLETED,
      clientName: 'RetailMax Inc',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2025-03-31'),
      skillTopicIndexes: [11, 12, 14, 5, 1], // Git, React, TypeScript, Design patterns, Error handling
      assigneeIndexes: [0, 2, 8, 9], // Alex, Michael, Kevin, Maya
    },
    {
      name: 'Internal Dev Platform',
      description:
        'Internal tooling platform to streamline developer workflows and CI/CD visibility',
      type: ProjectType.INTERNAL,
      status: ProjectStatus.ACTIVE,
      startDate: new Date('2026-01-10'),
      skillTopicIndexes: [0, 2, 11, 15, 3], // Problem solving, Concurrency, Git, Build tools, Test Coverage
      assigneeIndexes: [1, 10, 11, 12], // Sarah, John, Sophia, Daniel
    },
    {
      name: 'Design System v2',
      description:
        'Rebuild of the internal component library with Storybook and Tailwind',
      type: ProjectType.INTERNAL,
      status: ProjectStatus.ACTIVE,
      startDate: new Date('2025-12-01'),
      skillTopicIndexes: [7, 18, 19, 12, 4], // Design System, UI toolkit, Styling, React, Programming paradigms
      assigneeIndexes: [2, 13, 14, 3], // Michael, Olivia, Ryan, Emily
    },
    {
      name: 'Bench Upskilling Initiative',
      description:
        'Structured upskilling programme for bench resources in modern frontend stack',
      type: ProjectType.BENCH,
      status: ProjectStatus.ON_HOLD,
      startDate: new Date('2026-02-01'),
      skillTopicIndexes: [12, 13, 14, 17, 19], // React, Next.js, TypeScript, Form management, Styling
      assigneeIndexes: [4, 6, 9, 14], // David, James, Maya, Ryan
    },
    {
      name: 'Accessibility Audit & Remediation',
      description: 'Full WCAG 2.1 audit and fix across three internal apps',
      type: ProjectType.INTERNAL,
      status: ProjectStatus.COMPLETED,
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-08-31'),
      skillTopicIndexes: [7, 9, 19, 12, 5], // Design System, Web browser, Styling, React, Design patterns
      assigneeIndexes: [1, 3, 7, 13], // Sarah, Emily, Rachel, Olivia
    },
  ];

  for (const p of projectsData) {
    const { skillTopicIndexes, assigneeIndexes, ...projectFields } = p;
    const project = await prisma.project.create({ data: projectFields });

    await prisma.projectSkill.createMany({
      data: skillTopicIndexes.map((idx) => ({
        projectId: project.id,
        topicId: createdTopics[idx].id,
      })),
    });

    await prisma.projectAssignment.createMany({
      data: assigneeIndexes.map((idx) => ({
        projectId: project.id,
        userId: createdUsers[idx].id,
        startDate: projectFields.startDate,
        endDate: projectFields.endDate ?? null,
      })),
    });

    console.log(
      `  ✓ Project: ${project.name} (${project.type} / ${project.status}) — ${assigneeIndexes.length} members, ${skillTopicIndexes.length} skills`,
    );
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
