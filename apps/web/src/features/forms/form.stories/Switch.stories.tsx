import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Switch } from "@headlessui/react";

const switchSchema = z.object({
  isActive: z.boolean(),
  notifications: z.boolean(),
  marketing: z.boolean(),
});

type SwitchValues = z.infer<typeof switchSchema>;

const SwitchTemplate = ({ fieldName, label, helperText, defaultValue = false }: {
  fieldName: keyof SwitchValues;
  label?: string;
  helperText?: string;
  defaultValue?: boolean;
}) => {
  const {
    control,
  } = useForm<SwitchValues>({
    resolver: zodResolver(switchSchema),
    defaultValues: {
      [fieldName]: defaultValue,
    },
  });

  return (
    <div className="w-96 p-4">
      <div className="space-y-1">
        <span className="block text-sm font-medium text-gray-700">
          {label || "Status"}
        </span>
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onChange={field.onChange}
              className={`${field.value ? "bg-blue-600" : "bg-gray-300"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <span
                className={`${field.value ? "translate-x-5" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform`}
              />
            </Switch>
          )}
        />
        {helperText && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    </div>
  );
};

const meta: Meta<typeof SwitchTemplate> = {
  title: "Forms/Switch",
  component: SwitchTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    fieldName: {
      control: { type: "select" },
      options: ["isActive", "notifications", "marketing"],
    },
    label: { control: "text" },
    helperText: { control: "text" },
    defaultValue: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveStatus: Story = {
  args: {
    fieldName: "isActive",
    label: "Active User",
    helperText: "Toggle to mark this user as active",
    defaultValue: false,
  },
};

export const Notifications: Story = {
  args: {
    fieldName: "notifications",
    label: "Email Notifications",
    helperText: "Receive email notifications about your account",
    defaultValue: true,
  },
};

export const Marketing: Story = {
  args: {
    fieldName: "marketing",
    label: "Marketing Emails",
    helperText: "Receive marketing and promotional emails",
    defaultValue: false,
  },
};

export const DefaultValueOn: Story = {
  args: {
    fieldName: "isActive",
    label: "Feature Enabled",
    helperText: "This feature is enabled by default",
    defaultValue: true,
  },
};
