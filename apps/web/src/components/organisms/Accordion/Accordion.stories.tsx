import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent } from "storybook/test";
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
  play: async ({ canvas }) => {
    const firstTrigger = await canvas.findByRole("button", { name: /first section/i });
    await userEvent.click(firstTrigger);

    const secondTrigger = await canvas.findByRole("button", { name: /second section/i });
    await userEvent.click(secondTrigger);

    const thirdTrigger = await canvas.findByRole("button", { name: /third section/i });
    await userEvent.click(thirdTrigger);
  },
};

export const Single: Story = {
  args: { items: [{ title: "Only one", content: "Single item content" }] },
  play: async ({ canvas }) => {
    const trigger = await canvas.findByRole("button", { name: /only one/i });
    await userEvent.click(trigger);
  },
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
  play: async ({ canvas }) => {
    const sectionOne = await canvas.findByRole("button", { name: /section 1/i });
    await userEvent.click(sectionOne);

    const sectionTwo = await canvas.findByRole("button", { name: /section 2/i });
    await userEvent.click(sectionTwo);

    const sectionThree = await canvas.findByRole("button", { name: /section 3/i });
    await userEvent.click(sectionThree);

    const sectionFour = await canvas.findByRole("button", { name: /section 4/i });
    await userEvent.click(sectionFour);

    const sectionFive = await canvas.findByRole("button", { name: /section 5/i });
    await userEvent.click(sectionFive);
  },
};
