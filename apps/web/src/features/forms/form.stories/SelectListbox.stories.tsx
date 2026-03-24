import type { Meta, StoryObj } from "@storybook/react-vite";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Listbox } from "@headlessui/react";

const selectSchema = z.object({
  role: z.enum(["admin", "user", "manager"]),
  hobbies: z.array(z.string()).min(1, "Select at least one hobby"),
});

type SelectValues = z.infer<typeof selectSchema>;

const SingleSelectTemplate = ({ options, label, placeholder }: {
  options: string[];
  label?: string;
  placeholder?: string;
}) => {
  const {
    control,
    formState: { errors },
  } = useForm<SelectValues>({
    resolver: zodResolver(selectSchema),
  });

  return (
    <div className="w-96 p-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label || "Role"}
        </label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Listbox value={field.value} onChange={field.onChange}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <span className="block truncate capitalize">
                    {field.value || placeholder || "Select role"}
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {options.map((option) => (
                    <Listbox.Option
                      key={option}
                      value={option}
                      className={({ active }) =>
                        `cursor-pointer select-none py-2 px-3 capitalize ${active ? "bg-blue-50 text-blue-700" : "text-gray-900"
                        }`
                      }
                    >
                      {option}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          )}
        />
        {errors.role && (
          <p className="text-xs text-red-500">{errors.role.message}</p>
        )}
      </div>
    </div>
  );
};

const MultiSelectTemplate = ({ options, label, placeholder }: {
  options: string[];
  label?: string;
  placeholder?: string;
}) => {
  const {
    control,
    formState: { errors },
  } = useForm<SelectValues>({
    resolver: zodResolver(selectSchema),
    defaultValues: {
      hobbies: [],
    },
  });

  return (
    <div className="w-96 p-4">
      <div className="space-y-1">
        <span className="block text-sm font-medium text-gray-700">
          {label || "Hobbies"}
        </span>
        <Controller
          name="hobbies"
          control={control}
          render={({ field }) => (
            <Listbox
              value={field.value}
              onChange={field.onChange}
              multiple
            >
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <span className="block truncate">
                    {field.value && field.value.length > 0
                      ? field.value.join(", ")
                      : placeholder || "Select hobbies"}
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {options.map((option) => (
                    <Listbox.Option
                      key={option}
                      value={option}
                      className={({ active, selected }) =>
                        `cursor-pointer select-none py-2 px-3 capitalize ${active ? "bg-blue-50 text-blue-700" : "text-gray-900"
                        } ${selected ? "font-medium" : "font-normal"}`
                      }
                    >
                      {option}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          )}
        />
        {errors.hobbies && (
          <p className="text-xs text-red-500">{errors.hobbies.message}</p>
        )}
      </div>
    </div>
  );
};

const meta: Meta<typeof SingleSelectTemplate> = {
  title: "Forms/SelectListbox",
  component: SingleSelectTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    options: {
      control: { type: "object" },
    },
    label: { control: "text" },
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RoleSelect: Story = {
  args: {
    options: ["admin", "user", "manager"],
    label: "Role",
    placeholder: "Select role",
  },
};

export const MultiSelectHobbies: Story = {
  render: (args) => <MultiSelectTemplate {...args} />,
  args: {
    options: ["reading", "sports", "music", "travel", "cooking"],
    label: "Hobbies",
    placeholder: "Select hobbies",
  },
};

export const CountrySelect: Story = {
  args: {
    options: ["usa", "canada", "uk", "australia", "germany"],
    label: "Country",
    placeholder: "Select country",
  },
};

export const MultiSelectSkills: Story = {
  render: (args) => <MultiSelectTemplate {...args} />,
  args: {
    options: ["javascript", "typescript", "react", "vue", "angular", "nodejs"],
    label: "Skills",
    placeholder: "Select skills",
  },
};
