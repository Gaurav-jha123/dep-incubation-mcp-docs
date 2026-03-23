import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, Label, Input } from "@headlessui/react";

const dateInputSchema = z.object({
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  appointmentDate: z.string().optional(),
});

type DateInputValues = z.infer<typeof dateInputSchema>;

const DateInputTemplate = ({ fieldName, label, placeholder, min, max }: {
  fieldName: keyof DateInputValues;
  label?: string;
  placeholder?: string;
  min?: string;
  max?: string;
}) => {
  const {
    register,
    formState: { errors },
  } = useForm<DateInputValues>({
    resolver: zodResolver(dateInputSchema),
  });

  return (
    <div className="w-96 p-4">
      <Field className="space-y-1">
        <Label className="block text-sm font-medium text-gray-700">
          {label || "Date"}
        </Label>
        <Input
          type="date"
          {...register(fieldName)}
          placeholder={placeholder}
          min={min}
          max={max}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors[fieldName] && (
          <p className="text-xs text-red-500">{errors[fieldName]?.message}</p>
        )}
      </Field>
    </div>
  );
};

const meta: Meta<typeof DateInputTemplate> = {
  title: "Forms/DateInput",
  component: DateInputTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    fieldName: {
      control: { type: "select" },
      options: ["dateOfBirth", "startDate", "endDate", "appointmentDate"],
    },
    label: { control: "text" },
    placeholder: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DateOfBirth: Story = {
  args: {
    fieldName: "dateOfBirth",
    label: "Date of Birth",
    placeholder: "Select date",
    max: new Date().toISOString().split('T')[0], // Prevent future dates
  },
};

export const StartDate: Story = {
  args: {
    fieldName: "startDate",
    label: "Start Date",
    placeholder: "Select start date",
    min: new Date().toISOString().split('T')[0], // Prevent past dates
  },
};

export const EndDate: Story = {
  args: {
    fieldName: "endDate",
    label: "End Date",
    placeholder: "Select end date",
    min: new Date().toISOString().split('T')[0], // Prevent past dates
  },
};

export const AppointmentDate: Story = {
  args: {
    fieldName: "appointmentDate",
    label: "Appointment Date",
    placeholder: "Select appointment date",
    min: new Date().toISOString().split('T')[0], // Prevent past dates
  },
};

export const WithDateRange: Story = {
  args: {
    fieldName: "startDate",
    label: "Event Date",
    placeholder: "Select event date",
    min: "2024-01-01",
    max: "2024-12-31",
  },
};
