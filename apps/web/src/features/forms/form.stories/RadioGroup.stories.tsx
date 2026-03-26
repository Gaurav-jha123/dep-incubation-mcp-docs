import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RadioGroup } from "@headlessui/react";

const radioGroupSchema = z.object({
  gender: z.enum(["male", "female", "other"]),
});

type RadioGroupValues = z.infer<typeof radioGroupSchema>;

const RadioGroupTemplate = ({ options, label }: {
  options: string[];
  label?: string;
}) => {
  const {
    control,
    formState: { errors },
  } = useForm<RadioGroupValues>({
    resolver: zodResolver(radioGroupSchema),
  });

  return (
    <div className="w-96 p-4">
      <div className="space-y-1">
        <span className="block text-sm font-medium text-gray-700">
          {label || "Gender"}
        </span>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onChange={field.onChange}
              className="mt-1 flex gap-3"
            >
              {options.map((value) => (
                <RadioGroup.Option key={value} value={value}>
                  {({ checked }: { checked: boolean }) => (
                    <span
                      className={`cursor-pointer rounded-full border px-3 py-1 text-sm capitalize ${checked
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {value}
                    </span>
                  )}
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          )}
        />
        {errors.gender && (
          <p className="text-xs text-red-500">{errors.gender.message}</p>
        )}
      </div>
    </div>
  );
};

const meta: Meta<typeof RadioGroupTemplate> = {
  title: "Forms/RadioGroup",
  component: RadioGroupTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    options: {
      control: { type: "object" },
    },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Gender: Story = {
  args: {
    options: ["male", "female", "other"],
    label: "Gender",
  },
};

export const SizeOptions: Story = {
  args: {
    options: ["small", "medium", "large"],
    label: "Size",
  },
};

export const PriorityOptions: Story = {
  args: {
    options: ["low", "medium", "high"],
    label: "Priority",
  },
};

export const StatusOptions: Story = {
  args: {
    options: ["active", "inactive", "pending"],
    label: "Status",
  },
};
