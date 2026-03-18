import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, type AccordionItem } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Organisms/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems: AccordionItem[] = [
  { title: "First section", content: "Content for the first section." },
  { title: "Second section", content: "Content for the second section." },
  { title: "Third section", content: "Content for the third section." },
];

export const Default: Story = {
  args: { items: defaultItems },
};

export const Single: Story = {
  args: { items: [{ title: "Only one", content: "Single item content" }] },
};

export const Many: Story = {
  render: () => (
    <Accordion
      items={
        Array.from({ length: 5 }).map((_, i) => ({
          title: `Section ${i + 1}`,
          content: `Content for section ${i + 1}`,
        }))
      }
    />
  ),
};
