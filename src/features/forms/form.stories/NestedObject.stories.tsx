import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, Label, Input } from "@headlessui/react";

const nestedObjectSchema = z.object({
  address: z.object({
    city: z.string().min(2, "City must be at least 2 characters"),
    zip: z.string().min(5, "Zip code must be at least 5 characters"),
  }),
  contact: z.object({
    email: z.string().email("Invalid email"),
    phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  }).optional(),
  emergency: z.object({
    name: z.string().min(2, "Emergency contact name required"),
    relationship: z.string().min(2, "Relationship required"),
    phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  }).optional(),
});

type NestedObjectValues = z.infer<typeof nestedObjectSchema>;

const NestedObjectTemplate = ({ objectName, fields }: {
  objectName: keyof NestedObjectValues;
  fields: Array<{
    name: string;
    label: string;
    placeholder?: string;
    type?: string;
  }>;
}) => {
  const {
    register,
    formState: { errors },
  } = useForm<NestedObjectValues>({
    resolver: zodResolver(nestedObjectSchema),
  });

  const getRegisterPath = (objName: string, fieldName: string) => {
    switch (objName) {
      case 'address':
        if (fieldName === 'city') return 'address.city' as const;
        if (fieldName === 'zip') return 'address.zip' as const;
        break;
      case 'contact':
        if (fieldName === 'email') return 'contact.email' as const;
        if (fieldName === 'phone') return 'contact.phone' as const;
        break;
      case 'emergency':
        if (fieldName === 'name') return 'emergency.name' as const;
        if (fieldName === 'relationship') return 'emergency.relationship' as const;
        if (fieldName === 'phone') return 'emergency.phone' as const;
        break;
    }
    return 'address.city' as const; // fallback
  };

  return (
    <div className="w-96 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 capitalize">
          {objectName} Information
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {fields.map((field) => (
            <Field key={field.name} className="space-y-1">
              <Label className="block text-sm font-medium text-gray-700">
                {field.label}
              </Label>
              <Input
                type={field.type || "text"}
                {...register(getRegisterPath(objectName, field.name))}
                placeholder={field.placeholder}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors[objectName] && (
                <p className="text-xs text-red-500">
                  {(errors[objectName] as Record<string, { message?: string }>)?.[field.name]?.message}
                </p>
              )}
            </Field>
          ))}
        </div>
      </div>
    </div>
  );
};

const meta: Meta<typeof NestedObjectTemplate> = {
  title: "Forms/NestedObject",
  component: NestedObjectTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    objectName: {
      control: { type: "select" },
      options: ["address", "contact", "emergency"],
    },
    fields: {
      control: { type: "object" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Address: Story = {
  args: {
    objectName: "address",
    fields: [
      {
        name: "city",
        label: "City",
        placeholder: "Enter city name",
      },
      {
        name: "zip",
        label: "Zip Code",
        placeholder: "Enter zip code",
      },
    ],
  },
};

export const Contact: Story = {
  args: {
    objectName: "contact",
    fields: [
      {
        name: "email",
        label: "Email Address",
        placeholder: "email@example.com",
        type: "email",
      },
      {
        name: "phone",
        label: "Phone Number",
        placeholder: "9876543210",
        type: "tel",
      },
    ],
  },
};

export const EmergencyContact: Story = {
  args: {
    objectName: "emergency",
    fields: [
      {
        name: "name",
        label: "Emergency Contact Name",
        placeholder: "Full name",
      },
      {
        name: "relationship",
        label: "Relationship",
        placeholder: "e.g., Spouse, Parent, Friend",
      },
      {
        name: "phone",
        label: "Contact Phone",
        placeholder: "9876543210",
        type: "tel",
      },
    ],
  },
};
