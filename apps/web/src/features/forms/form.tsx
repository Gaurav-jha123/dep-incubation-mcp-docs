import { useForm, useFieldArray, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Listbox,
  RadioGroup,
  Switch,
  Field,
  Label,
  Input,
  Textarea,
  Button,
} from "@headlessui/react";
import logger from "@/lib/logger";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Minimum 8 characters"),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  gender: z.enum(["male", "female", "other"]),
  role: z.enum(["admin", "user", "manager"]),
  hobbies: z.array(z.string()).min(1, "Select at least one hobby"),
  isActive: z.boolean(),
  dateOfBirth: z.string(),
  skills: z.array(
    z.object({
      name: z.string().min(2),
      experience: z.coerce.number().min(1),
    })
  ),
  address: z.object({
    city: z.string().min(2),
    zip: z.string().min(5),
  }),
  profileImage: z
    .any()
    .refine((file) => file?.length === 1, "Profile image is required"),
});

type FormValues = z.input<typeof formSchema>;

/* ===============================
   COMPONENT
================================ */

export default function UserForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hobbies: [],
      skills: [{ name: "", experience: 1 }],
      isActive: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    logger.info('data', data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto space-y-6 p-8 bg-card shadow-xl rounded-xl border border-border"
    >
      <div className="space-y-1 border-b border-border pb-4 mb-4">
        <h2 className="text-2xl font-semibold text-foreground">User Form</h2>
        <p className="text-sm text-muted-foreground">
          Fill out the information below to create or update a user.
        </p>
      </div>

      {/* BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field className="space-y-1">
          <Label className="block text-sm font-medium text-foreground">
            First name
          </Label>
          <Input
            {...register("firstName")}
            placeholder="John"
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName.message}</p>
          )}
        </Field>

        <Field className="space-y-1">
          <Label className="block text-sm font-medium text-foreground">
            Last name
          </Label>
          <Input
            {...register("lastName")}
            placeholder="Doe"
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName.message}</p>
          )}
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field className="space-y-1">
          <Label className="block text-sm font-medium text-foreground">
            Email
          </Label>
          <Input
            type="email"
            {...register("email")}
            placeholder="john.doe@example.com"
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </Field>

        <Field className="space-y-1">
          <Label className="block text-sm font-medium text-foreground">
            Password
          </Label>
          <Input
            type="password"
            {...register("password")}
            placeholder="********"
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </Field>
      </div>

      {/* CONTACT & PROFILE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field className="space-y-1">
          <Label className="block text-sm font-medium text-foreground">
            Phone
          </Label>
          <Input
            {...register("phone")}
            placeholder="9876543210"
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </Field>

        <Field className="space-y-1">
          <Label className="block text-sm font-medium text-foreground">
            Website
          </Label>
          <Input
            {...register("website")}
            placeholder="https://example.com"
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.website && (
            <p className="text-xs text-red-500">{errors.website.message}</p>
          )}
        </Field>
      </div>

      <Field className="space-y-1">
        <Label className="block text-sm font-medium text-foreground">Bio</Label>
        <Textarea
          {...register("bio")}
          placeholder="Short description about the user"
          className="w-full rounded-md border border-input px-3 py-2 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </Field>

      {/* DEMOGRAPHICS (Headless UI) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gender - RadioGroup */}
        <div className="space-y-1">
          <span className="block text-sm font-medium text-foreground">
            Gender
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
                {["male", "female", "other"].map((value) => (
                  <RadioGroup.Option key={value} value={value}>
                    {({ checked }) => (
                      <span
                        className={`cursor-pointer rounded-full border px-3 py-1 text-sm capitalize ${checked
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 text-foreground hover:bg-gray-50"
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

        {/* Role - Listbox */}
        <div className="space-y-1">
          <span className="block text-sm font-medium text-foreground">
            Role
          </span>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Listbox value={field.value} onChange={field.onChange}>
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-input bg-card py-2 pl-3 pr-8 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <span className="block truncate capitalize">
                      {field.value || "Select role"}
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-card py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {["admin", "user", "manager"].map((role) => (
                      <Listbox.Option
                        key={role}
                        value={role}
                        className={({ active }) =>
                          `cursor-pointer select-none py-2 px-3 capitalize ${active ? "bg-blue-50 text-blue-700" : "text-gray-900"
                          }`
                        }
                      >
                        {role}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            )}
          />
        </div>

        {/* Date of birth */}
        <Field className="space-y-1">
          <Label className="block text-sm font-medium text-foreground">
            Date of birth
          </Label>
          <Input
            type="date"
            {...register("dateOfBirth")}
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </Field>
      </div>

      {/* HOBBIES & STATUS (Headless UI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hobbies - multi-select Listbox */}
        <div className="space-y-1">
          <span className="block text-sm font-medium text-foreground">
            Hobbies
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
                  <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-input bg-card py-2 pl-3 pr-8 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <span className="block truncate">
                      {field.value && field.value.length > 0
                        ? field.value.join(", ")
                        : "Select hobbies"}
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-card py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {["reading", "sports", "music"].map((hobby) => (
                      <Listbox.Option
                        key={hobby}
                        value={hobby}
                        className={({ active, selected }) =>
                          `cursor-pointer select-none py-2 px-3 capitalize ${active ? "bg-blue-50 text-blue-700" : "text-gray-900"
                          } ${selected ? "font-medium" : "font-normal"}`
                        }
                      >
                        {hobby}
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

        {/* Active user - Switch */}
        <div className="space-y-1">
          <span className="block text-sm font-medium text-foreground">
            Status
          </span>
          <Controller
            name="isActive"
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
                    } inline-block h-4 w-4 transform rounded-full bg-card shadow transition-transform`}
                />
              </Switch>
            )}
          />
          <p className="text-xs text-gray-500">
            {/** Simple helper text */}
            {/** Not validation-related */}
            Toggle to mark this user as active.
          </p>
        </div>
      </div>

      {/* ADDRESS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field className="space-y-1">
          <Label className="block text-sm font-medium text-foreground">
            City
          </Label>
          <Input
            {...register("address.city")}
            placeholder="City"
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </Field>
        <Field className="space-y-1">
          <Label className="block text-sm font-medium text-foreground">
            Zip code
          </Label>
          <Input
            {...register("address.zip")}
            placeholder="Zip code"
            className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </Field>
      </div>

      {/* PROFILE IMAGE */}
      <Field className="space-y-1">
        <Label className="block text-sm font-medium text-foreground">
          Profile image
        </Label>
        <Input
          type="file"
          {...register("profileImage")}
          className="block w-full text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
        />
        {errors.profileImage && (
          <p className="text-xs text-red-500">
            {errors.profileImage.message as string}
          </p>
        )}
      </Field>

      {/* SKILLS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-800">Skills</h3>
          <Button
            type="button"
            onClick={() => append({ name: "", experience: 1 })}
            className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
          >
            Add skill
          </Button>
        </div>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-2 items-center"
            >
              <Field className="col-span-6 space-y-1">
                <Label className="block text-xs font-medium text-muted-foreground">
                  Skill name
                </Label>
                <Input
                  placeholder="React, Node, Design..."
                  {...register(`skills.${index}.name`)}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </Field>
              <Field className="col-span-4 space-y-1">
                <Label className="block text-xs font-medium text-muted-foreground">
                  Experience (years)
                </Label>
                <Input
                  type="number"
                  {...register(`skills.${index}.experience`, {
                    valueAsNumber: true,
                  })}
                  placeholder="1"
                  className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
        <Button
          type="submit"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          Submit
        </Button>
      </div>
    </form>
  );
}