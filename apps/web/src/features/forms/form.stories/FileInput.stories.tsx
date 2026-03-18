import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, Label, Input } from "@headlessui/react";

const fileInputSchema = z.object({
  profileImage: z
    .any()
    .refine((file) => file?.length === 1, "Profile image is required"),
  document: z.any().optional(),
  resume: z.any().optional(),
  avatar: z.any().optional(),
});

type FileInputValues = z.infer<typeof fileInputSchema>;

const FileInputTemplate = ({ fieldName, label, accept, multiple = false, required = false }: {
  fieldName: keyof FileInputValues;
  label?: string;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
}) => {
  const {
    register,
    formState: { errors },
  } = useForm<FileInputValues>({
    resolver: zodResolver(fileInputSchema),
  });

  return (
    <div className="w-96 p-4">
      <Field className="space-y-1">
        <Label className="block text-sm font-medium text-gray-700">
          {label || "File"}
        </Label>
        <Input
          type="file"
          {...register(fieldName)}
          accept={accept}
          multiple={multiple}
          className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
        />
        {errors[fieldName] && (
          <p className="text-xs text-red-500">
            {errors[fieldName]?.message as string}
          </p>
        )}
        {required && (
          <p className="text-xs text-gray-500">This field is required</p>
        )}
      </Field>
    </div>
  );
};

const meta: Meta<typeof FileInputTemplate> = {
  title: "Forms/FileInput",
  component: FileInputTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    fieldName: {
      control: { type: "select" },
      options: ["profileImage", "document", "resume", "avatar"],
    },
    label: { control: "text" },
    accept: { control: "text" },
    multiple: { control: "boolean" },
    required: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ProfileImage: Story = {
  args: {
    fieldName: "profileImage",
    label: "Profile Image",
    accept: "image/*",
    multiple: false,
    required: true,
  },
};

export const DocumentUpload: Story = {
  args: {
    fieldName: "document",
    label: "Document",
    accept: ".pdf,.doc,.docx",
    multiple: false,
    required: false,
  },
};

export const ResumeUpload: Story = {
  args: {
    fieldName: "resume",
    label: "Resume",
    accept: ".pdf,.doc,.docx",
    multiple: false,
    required: false,
  },
};

export const AvatarUpload: Story = {
  args: {
    fieldName: "avatar",
    label: "Avatar",
    accept: "image/png,image/jpeg,image/jpg",
    multiple: false,
    required: false,
  },
};

export const MultipleImages: Story = {
  args: {
    fieldName: "document",
    label: "Gallery Images",
    accept: "image/*",
    multiple: true,
    required: false,
  },
};
