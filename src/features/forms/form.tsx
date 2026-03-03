import { useForm, useFieldArray} from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const onSubmit: SubmitHandler<FormValues> = (data:any) => {
  console.log(data);
};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto space-y-4 p-6 shadow-lg rounded-lg"
    >
      <h2 className="text-2xl font-bold">Modern React Form</h2>

      {/* TEXT INPUT */}
      <input {...register("firstName")} placeholder="First Name" />
      <p>{errors.firstName?.message}</p>

      <input {...register("lastName")} placeholder="Last Name" />
      <p>{errors.lastName?.message}</p>

      {/* EMAIL */}
      <input {...register("email")} placeholder="Email" type="email" />
      <p>{errors.email?.message}</p>

      {/* PASSWORD */}
      <input {...register("password")} placeholder="Password" type="password" />
      <p>{errors.password?.message}</p>

      {/* NUMBER (Correct way) */}
      {/* <input
        type="number"
        {...register("age", { valueAsNumber: true })}
        placeholder="Age"
      />
      <p>{errors.age?.message}</p> */}

      {/* TEXTAREA */}
      <textarea {...register("bio")} placeholder="Bio" />

      {/* URL */}
      <input {...register("website")} placeholder="Website" />
      <p>{errors.website?.message}</p>

      {/* PHONE */}
      <input {...register("phone")} placeholder="Phone" />
      <p>{errors.phone?.message}</p>

      {/* RADIO */}
      <div>
        <label>
          <input {...register("gender")} type="radio" value="male" /> Male
        </label>
        <label>
          <input {...register("gender")} type="radio" value="female" /> Female
        </label>
        <label>
          <input {...register("gender")} type="radio" value="other" /> Other
        </label>
      </div>
      <p>{errors.gender?.message}</p>

      {/* SELECT */}
      <select {...register("role")}>
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="manager">Manager</option>
      </select>

      {/* MULTI CHECKBOX */}
      <div>
        {["reading", "sports", "music"].map((hobby) => (
          <label key={hobby}>
            <input
              type="checkbox"
              value={hobby}
              {...register("hobbies")}
            />
            {hobby}
          </label>
        ))}
      </div>
      <p>{errors.hobbies?.message}</p>

      {/* SWITCH */}
      <label>
        <input type="checkbox" {...register("isActive")} />
        Active User
      </label>

      {/* DATE */}
      <input type="date" {...register("dateOfBirth")} />

      {/* FILE */}
      <input type="file" {...register("profileImage")} />
      <p>{errors.profileImage?.message as string}</p>

      {/* DYNAMIC ARRAY */}
      <div>
        <h3>Skills</h3>
        {fields.map((field, index) => (
          <div key={field.id}>
            <input
              placeholder="Skill Name"
              {...register(`skills.${index}.name`)}
            />
            <input
              type="number"
              {...register(`skills.${index}.experience`, {
                valueAsNumber: true,
              })}
              placeholder="Experience (years)"
            />
            <button type="button" onClick={() => remove(index)}>
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ name: "", experience: 1 })}
        >
          Add Skill
        </button>
      </div>

      {/* NESTED OBJECT */}
      <input {...register("address.city")} placeholder="City" />
      <input {...register("address.zip")} placeholder="Zip Code" />

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
}