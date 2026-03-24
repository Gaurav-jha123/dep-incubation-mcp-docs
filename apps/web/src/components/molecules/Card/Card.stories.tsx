import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Molecules/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "centered" }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: { children: "Simple card content." }
};

export const Header: Story = {
  args: {
    variant: "header",
    title: "Profile",
    subtitle: "User Details",
    children: "Card content"
  }
};

export const Image: Story = {
  args: {
    variant: "image",
    imageSrc: "https://via.placeholder.com/300x150",
    children: "Content under image"
  }
};

export const Actions: Story = {
  args: {
    variant: "actions",
    title: "Confirm",
    children: "Are you sure?",
    actions: (
      <>
        <button className="rounded border border-neutral-200 bg-neutral-50 px-3 py-1 text-neutral-700">
          Cancel
        </button>
        <button className="rounded bg-neutral-900 px-3 py-1 text-neutral-50">
          OK
        </button>
      </>
    )
  }
};

export const Styled: Story = {
  args: {
    variant: "styled",
    styleVariant: "outline",
    children: "Styled card with outline."
  }
};