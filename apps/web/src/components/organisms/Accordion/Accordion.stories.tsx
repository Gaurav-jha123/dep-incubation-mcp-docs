import type { Meta, StoryContext, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
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
  play: async (context: StoryContext<typeof Accordion>) => {
    const { canvas } = context;

    const firstPanelText = /content for the first section\./i;
    const secondPanelText = /content for the second section\./i;
    const thirdPanelText = /content for the third section\./i;

    // All panels hidden initially
    await expect(canvas.queryByText(firstPanelText)).not.toBeInTheDocument();
    await expect(canvas.queryByText(secondPanelText)).not.toBeInTheDocument();
    await expect(canvas.queryByText(thirdPanelText)).not.toBeInTheDocument();

    // Open first section
    const firstTrigger = await canvas.findByRole("button", { name: /first section/i });
    await expect(firstTrigger).toBeInTheDocument();
    await userEvent.click(firstTrigger);
    await expect(canvas.getByText(firstPanelText)).toBeVisible();
    await expect(canvas.queryByText(secondPanelText)).not.toBeInTheDocument();
    await expect(canvas.queryByText(thirdPanelText)).not.toBeInTheDocument();

    // Open second section
    const secondTrigger = await canvas.findByRole("button", { name: /second section/i });
    await userEvent.click(secondTrigger);
    await expect(canvas.getByText(secondPanelText)).toBeVisible();
    await expect(canvas.queryByText(thirdPanelText)).not.toBeInTheDocument();

    // Open third section
    const thirdTrigger = await canvas.findByRole("button", { name: /third section/i });
    await userEvent.click(thirdTrigger);
    await expect(canvas.getByText(thirdPanelText)).toBeVisible();
  },
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
  play: async (context: StoryContext<typeof Accordion>) => {
    const { canvas } = context;

    const firstPanelText = /content for section 1/i;
    const secondPanelText = /content for section 2/i;
    const thirdPanelText = /content for section 3/i;
    const fourthPanelText = /content for section 4/i;
    const fifthPanelText = /content for section 5/i;

    // All panels hidden initially
    await expect(canvas.queryByText(firstPanelText)).not.toBeInTheDocument();
    await expect(canvas.queryByText(secondPanelText)).not.toBeInTheDocument();
    await expect(canvas.queryByText(thirdPanelText)).not.toBeInTheDocument();
    await expect(canvas.queryByText(fourthPanelText)).not.toBeInTheDocument();
    await expect(canvas.queryByText(fifthPanelText)).not.toBeInTheDocument();

    // Open each section in order and verify others stay hidden until clicked
    const sectionOne = await canvas.findByRole("button", { name: /section 1/i });
    await userEvent.click(sectionOne);
    await expect(canvas.getByText(firstPanelText)).toBeVisible();
    await expect(canvas.queryByText(secondPanelText)).not.toBeInTheDocument();
    await expect(canvas.queryByText(thirdPanelText)).not.toBeInTheDocument();
    await expect(canvas.queryByText(fourthPanelText)).not.toBeInTheDocument();
    await expect(canvas.queryByText(fifthPanelText)).not.toBeInTheDocument();

    const sectionTwo = await canvas.findByRole("button", { name: /section 2/i });
    await userEvent.click(sectionTwo);
    await expect(canvas.getByText(secondPanelText)).toBeVisible();
    await expect(canvas.queryByText(thirdPanelText)).not.toBeInTheDocument();
    await expect(canvas.queryByText(fourthPanelText)).not.toBeInTheDocument();
    await expect(canvas.queryByText(fifthPanelText)).not.toBeInTheDocument();

    const sectionThree = await canvas.findByRole("button", { name: /section 3/i });
    await userEvent.click(sectionThree);
    await expect(canvas.getByText(thirdPanelText)).toBeVisible();
    await expect(canvas.queryByText(fourthPanelText)).not.toBeInTheDocument();
    await expect(canvas.queryByText(fifthPanelText)).not.toBeInTheDocument();

    const sectionFour = await canvas.findByRole("button", { name: /section 4/i });
    await userEvent.click(sectionFour);
    await expect(canvas.getByText(fourthPanelText)).toBeVisible();
    await expect(canvas.queryByText(fifthPanelText)).not.toBeInTheDocument();

    const sectionFive = await canvas.findByRole("button", { name: /section 5/i });
    await userEvent.click(sectionFive);
    await expect(canvas.getByText(fifthPanelText)).toBeVisible();
  },
};
