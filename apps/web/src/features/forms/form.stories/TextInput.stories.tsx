import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, Label, Input } from "@headlessui/react";

const textInputSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Minimum 8 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  website: z.string().url().optional().or(z.literal("")),
});

type TextInputValues = z.infer<typeof textInputSchema>;

const TextInputTemplate = ({ fieldName, label, placeholder, type = "text" }: {
  fieldName: keyof TextInputValues;
  label: string;
  placeholder: string;
  type?: string;
}) => {
  const {
    register,
    formState: { errors },
  } = useForm<TextInputValues>({
    resolver: zodResolver(textInputSchema),
  });

  return (
    <div className="w-96 p-4">
      <Field className="space-y-1">
        <Label className="block text-sm font-medium text-gray-700">
          {label}
        </Label>
        <Input
          type={type}
          {...register(fieldName)}
          placeholder={placeholder}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors[fieldName] && (
          <p className="text-xs text-red-500">{errors[fieldName]?.message}</p>
        )}
      </Field>
    </div>
  );
};

const meta: Meta<typeof TextInputTemplate> = {
  title: "Forms/TextInput",
  component: TextInputTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    fieldName: {
      control: { type: "select" },
      options: ["firstName", "lastName", "email", "password", "phone", "website"],
    },
    label: { control: "text" },
    placeholder: { control: "text" },
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "tel", "url"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstName: Story = {
  args: {
    fieldName: "firstName",
    label: "First Name",
    placeholder: "John",
    type: "text",
  },
};

export const LastName: Story = {
  args: {
    fieldName: "lastName",
    label: "Last Name",
    placeholder: "Doe",
    type: "text",
  },
};

export const Email: Story = {
  args: {
    fieldName: "email",
    label: "Email Address",
    placeholder: "john.doe@example.com",
    type: "email",
  },
};

export const Password: Story = {
  args: {
    fieldName: "password",
    label: "Password",
    placeholder: "********",
    type: "password",
  },
};

export const Phone: Story = {
  args: {
    fieldName: "phone",
    label: "Phone Number",
    placeholder: "9876543210",
    type: "tel",
  },
};

export const Website: Story = {
  args: {
    fieldName: "website",
    label: "Website",
    placeholder: "https://example.com",
    type: "url",
  },
};
