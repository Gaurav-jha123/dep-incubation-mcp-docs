import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, Label, Input, Button } from "@headlessui/react";

const fieldArraySchema = z.object({
  skills: z.array(
    z.object({
      name: z.string().min(2, "Skill name must be at least 2 characters"),
      experience: z.number().min(1, "Experience must be at least 1 year"),
    })
  ).min(1, "Add at least one skill"),
});

type FieldArrayValues = z.infer<typeof fieldArraySchema>;

const FieldArrayTemplate = ({ title, addButtonLabel, namePlaceholder, experiencePlaceholder }: {
  title?: string;
  addButtonLabel?: string;
  namePlaceholder?: string;
  experiencePlaceholder?: string;
}) => {
  const {
    control,
    register,
    formState: { errors },
  } = useForm<FieldArrayValues>({
    resolver: zodResolver(fieldArraySchema),
    defaultValues: {
      skills: [{ name: "", experience: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  return (
    <div className="w-full max-w-2xl p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-800">{title || "Skills"}</h3>
          <Button
            type="button"
            onClick={() => append({ name: "", experience: 1 })}
            className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
          >
            {addButtonLabel || "Add skill"}
          </Button>
        </div>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-2 items-center"
            >
              <Field className="col-span-6 space-y-1">
                <Label className="block text-xs font-medium text-gray-600">
                  Skill name
                </Label>
                <Input
                  placeholder={namePlaceholder || "React, Node, Design..."}
                  {...register(`skills.${index}.name`)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.skills?.[index]?.name && (
                  <p className="text-xs text-red-500">
                    {errors.skills[index]?.name?.message}
                  </p>
                )}
              </Field>
              <Field className="col-span-4 space-y-1">
                <Label className="block text-xs font-medium text-gray-600">
                  Experience (years)
                </Label>
                <Input
                  type="number"
                  {...register(`skills.${index}.experience`, {
                    valueAsNumber: true,
                  })}
                  placeholder={experiencePlaceholder || "1"}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.skills?.[index]?.experience && (
                  <p className="text-xs text-red-500">
                    {errors.skills[index]?.experience?.message}
                  </p>
                )}
              </Field>
              <div className="col-span-2 flex items-end">
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  className="w-full rounded-md border border-red-200 px-2 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        {errors.skills && typeof errors.skills.message === 'string' && (
          <p className="text-xs text-red-500">{errors.skills.message}</p>
        )}
      </div>
    </div>
  );
};

const meta: Meta<typeof FieldArrayTemplate> = {
  title: "Forms/FieldArray",
  component: FieldArrayTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    addButtonLabel: { control: "text" },
    namePlaceholder: { control: "text" },
    experiencePlaceholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Skills: Story = {
  args: {
    title: "Skills",
    addButtonLabel: "Add skill",
    namePlaceholder: "React, Node, Design...",
    experiencePlaceholder: "1",
  },
};

export const Education: Story = {
  args: {
    title: "Education",
    addButtonLabel: "Add education",
    namePlaceholder: "School name",
    experiencePlaceholder: "Graduation year",
  },
};

export const WorkExperience: Story = {
  args: {
    title: "Work Experience",
    addButtonLabel: "Add experience",
    namePlaceholder: "Company name",
    experiencePlaceholder: "Years worked",
  },
};

export const Certifications: Story = {
  args: {
    title: "Certifications",
    addButtonLabel: "Add certification",
    namePlaceholder: "Certification name",
    experiencePlaceholder: "Year obtained",
  },
};
