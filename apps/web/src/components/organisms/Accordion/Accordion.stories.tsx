import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
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

const stateMatrix: Array<{ label: string; items: AccordionItem[] }> = [
  {
    label: "All collapsed",
    items: defaultItems,
  },
  {
    label: "First expanded",
    items: defaultItems.map((item, index) => ({
      ...item,
      defaultOpen: index === 0,
    })),
  },
  {
    label: "Middle expanded",
    items: defaultItems.map((item, index) => ({
      ...item,
      defaultOpen: index === 1,
    })),
  },
  {
    label: "Multiple expanded",
    items: defaultItems.map((item, index) => ({
      ...item,
      defaultOpen: index !== 1,
    })),
  },
];

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Accordion with three expandable sections."
      }
    }
  },
  args: { items: defaultItems },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    const firstTrigger = await canvas.findByRole("button", { name: /first section/i });
    await userEvent.click(firstTrigger);

    const secondTrigger = await canvas.findByRole("button", { name: /second section/i });
    await userEvent.click(secondTrigger);

    const thirdTrigger = await canvas.findByRole("button", { name: /third section/i });
    await userEvent.click(thirdTrigger);
  },
};

export const Single: Story = {
  parameters: {
    docs: {
      description: {
        story: "Accordion with a single item."
      }
    }
  },
  args: { items: [{ title: "Only one", content: "Single item content" }] },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    const trigger = await canvas.findByRole("button", { name: /only one/i });
    await userEvent.click(trigger);
  },
};

export const Many: Story = {
  parameters: {
    docs: {
      description: {
        story: "Accordion with five sections, each expandable."
      }
    }
  },
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
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

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

export const States: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div className="space-y-4">
      {stateMatrix.map((state) => (
        <div key={state.label} className="flex items-start gap-6">
          <p className="w-32 shrink-0 pt-4 text-sm font-medium text-neutral-700">
            {state.label}
          </p>
          <Accordion items={state.items} />
        </div>
      ))}
    </div>
  ),
};
