type User = {
  id: string;
  name: string;
};

type UserSelectorProps = {
  users: User[];
  selectedUser: string;
  onChange: (userId: string) => void;
};

export default function UserSelector({
  users,
  selectedUser,
  onChange,
}: UserSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">Select User</label>

      <select
        value={selectedUser}
        onChange={(e) => onChange(e.target.value)}
        className="border p-3 rounded-lg"
      >
        <option value="">-- Select User --</option>

        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}