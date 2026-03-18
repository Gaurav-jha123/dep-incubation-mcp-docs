import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, Label, Textarea } from "@headlessui/react";

const textareaSchema = z.object({
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

type TextareaValues = z.infer<typeof textareaSchema>;

const TextareaTemplate = ({ label, placeholder, rows = 4 }: {
  label?: string;
  placeholder?: string;
  rows?: number;
}) => {
  const {
    register,
    formState: { errors },
  } = useForm<TextareaValues>({
    resolver: zodResolver(textareaSchema),
  });

  return (
    <div className="w-96 p-4">
      <Field className="space-y-1">
        <Label className="block text-sm font-medium text-gray-700">
          {label || "Bio"}
        </Label>
        <Textarea
          {...register("bio")}
          placeholder={placeholder || "Short description about the user"}
          rows={rows}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.bio && (
          <p className="text-xs text-red-500">{errors.bio.message}</p>
        )}
      </Field>
    </div>
  );
};

const meta: Meta<typeof TextareaTemplate> = {
  title: "Forms/Textarea",
  component: TextareaTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    rows: { control: { type: "number", min: 1, max: 10 } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Bio",
    placeholder: "Short description about the user",
    rows: 4,
  },
};

export const WithValidation: Story = {
  args: {
    label: "Bio",
    placeholder: "Tell us about yourself (max 500 characters)",
    rows: 6,
  },
};

export const Small: Story = {
  args: {
    label: "Short Note",
    placeholder: "Enter a brief note...",
    rows: 2,
  },
};

export const Large: Story = {
  args: {
    label: "Description",
    placeholder: "Enter a detailed description...",
    rows: 8,
  },
};
