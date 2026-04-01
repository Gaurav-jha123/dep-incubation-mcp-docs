import { Button } from "@/components/atoms";
import { Plus, PlusCircle } from "lucide-react";
import { Table } from "@/components/organisms";
import { useState, useEffect } from "react";
import { fetchAllTopics } from "@/services/api/topics.api";
import { fetchAllUsers } from "@/services/api/users.api";

interface ProjectEntry extends Record<string, unknown> {
  name: string;
  project_id: string;
  description: string;
  type: "CLIENT" | "INTERNAL";
  skills: number[];
}

interface Topic {
  id: number;
  label: string;
  description: string | null;
}

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

interface UserStatusPair {
  id: string;
  user: string;
  status: string;
}

// interface AssignData {
//   users: string[];
//   statuses: string[];
// }

const dummyProjects: ProjectEntry[] = [
  {
    name: "Client Portal Alpha",
    project_id: "PRJ-001",
    description: "Frontend portal for Acme Corp",
    type: "CLIENT",
    skills: [1, 2, 3]
  },
  {
    name: "Mobile Banking App",
    project_id: "PRJ-002",
    description: "Mobile banking application for iOS and Android",
    type: "CLIENT",
    skills: [1, 4, 7]
  },
  {
    name: "E-commerce Platform",
    project_id: "PRJ-003",
    description: "Online shopping platform with payment integration",
    type: "INTERNAL",
    skills: [5, 8, 6]
  }
];

export default function Projects() {
  const [projects, setProjects] = useState<ProjectEntry[]>(dummyProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectEntry | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<ProjectEntry>({
    name: "",
    project_id: "",
    description: "",
    type: "CLIENT",
    skills: []
  });
  // const [assignData, setAssignData] = useState<AssignData>({
  //   users: [],
  //   statuses: []
  // });
  const [userStatusPairs, setUserStatusPairs] = useState<UserStatusPair[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    // Fetch topics and users from APIs
    const loadData = async () => {
      try {
        // Fetch topics
        const topicsData = await fetchAllTopics();
        setTopics(topicsData);
        
        // Fetch users
        const usersData = await fetchAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Fallback to dummy data if API fails
        setTopics([
          { id: 1, label: "React", description: "React.js framework" },
          { id: 2, label: "Node.js", description: "Node.js runtime" },
          { id: 3, label: "MongoDB", description: "MongoDB database" },
          { id: 4, label: "TypeScript", description: "TypeScript superset" },
          { id: 5, label: "Python", description: "Python programming" },
          { id: 6, label: "Docker", description: "Containerization" },
          { id: 7, label: "AWS", description: "Amazon Web Services" },
          { id: 8, label: "PostgreSQL", description: "PostgreSQL database" },
          { id: 9, label: "GraphQL", description: "GraphQL API" },
          { id: 10, label: "Kubernetes", description: "Container orchestration" }
        ]);
        setUsers([
          { id: 1, name: "Alice Johnson", email: "alice@example.com", createdAt: new Date().toISOString() },
          { id: 2, name: "Bob Smith", email: "bob@example.com", createdAt: new Date().toISOString() },
          { id: 3, name: "Charlie Brown", email: "charlie@example.com", createdAt: new Date().toISOString() },
          { id: 4, name: "Diana Prince", email: "diana@example.com", createdAt: new Date().toISOString() },
          { id: 5, name: "Edward Norton", email: "edward@example.com", createdAt: new Date().toISOString() }
        ]);
      }
    };
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProjects([...projects, formData]);
    setFormData({
      name: "",
      project_id: "",
      description: "",
      type: "CLIENT",
      skills: []
    });
    setIsModalOpen(false);
  };

  const handleInputChange = (field: keyof ProjectEntry, value: string | number[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // const handleSkillToggle = (skillId: number) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     skills: prev.skills.includes(skillId)
  //       ? prev.skills.filter(s => s !== skillId)
  //       : [...prev.skills, skillId]
  //   }));
  // };

  const getSkillLabels = (skillIds: number[]) => {
    return skillIds.map(id => topics.find(topic => topic.id === id)?.label || `Unknown (${id})`).join(', ');
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Assign project:', selectedProject?.project_id, 'assignments:', userStatusPairs);
    setIsAssignModalOpen(false);
    setSelectedProject(null);
    setUserStatusPairs([]);
    setSelectedUser("");
    setSelectedStatus("");
  };

  const handleAddUserStatus = () => {
    if (selectedUser && selectedStatus) {
      const newPair: UserStatusPair = {
        id: `${selectedUser}-${selectedStatus}-${Date.now()}`,
        user: selectedUser,
        status: selectedStatus
      };
      setUserStatusPairs(prev => [...prev, newPair]);
      setSelectedUser("");
      setSelectedStatus("");
    }
  };

  const handleRemoveUserStatus = (id: string) => {
    setUserStatusPairs(prev => prev.filter(pair => pair.id !== id));
  };

  const handleAssignClick = (project: ProjectEntry) => {
    setSelectedProject(project);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={18} /> Create
        </Button>
      </div>
      
      <div className="flex-1 min-h-0">
        <Table
          caption="Project Assignments"
          headers={["Name", "Project ID", "Description", "Skills", "Action"]}
          keys={["name", "project_id", "description", "skills", "action"]}
          cellRenderer={(value: unknown, key: keyof ProjectEntry, row: ProjectEntry) => {
            if (key === "action") {
              return (
                <Button
                  size="sm"
                  onClick={() => handleAssignClick(row)}
                >
                  Assign
                </Button>
              );
            }
            if (key === "skills") {
              return getSkillLabels(row.skills);
            }
            return value as React.ReactNode;
          }}
          data={projects}
          showSearch={true}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-8 w-full max-w-4xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-foreground mb-6">Create New Project Entry</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="project-name" className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <input
                    id="project-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="project-id" className="block text-sm font-medium text-foreground mb-2">Project ID</label>
                  <input
                    id="project-id"
                    type="text"
                    required
                    value={formData.project_id}
                    onChange={(e) => handleInputChange("project_id", e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-foreground"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="project-description" className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    id="project-description"
                    required
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-foreground resize-none"
                    rows={4}
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="block text-sm font-medium text-foreground mb-2">Project Type</div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="projectType"
                        value="CLIENT"
                        checked={formData.type === "CLIENT"}
                        onChange={(e) => handleInputChange("type", e.target.value)}
                        className="text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-sm text-foreground">Client</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="projectType"
                        value="INTERNAL"
                        checked={formData.type === "INTERNAL"}
                        onChange={(e) => handleInputChange("type", e.target.value)}
                        className="text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-sm text-foreground">Internal</span>
                    </label>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="project-skills" className="block text-sm font-medium text-foreground mb-2">Skills</label>
                  <select
                    id="project-skills"
                    multiple
                    value={formData.skills.map(String)}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, (option) => Number((option as HTMLOptionElement).value));
                      handleInputChange("skills", selectedOptions);
                    }}
                    className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-foreground"
                    size={Math.max(4, topics.length)}
                  >
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">Hold Ctrl/Cmd to select multiple skills</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-8 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {selectedProject?.name}
            </h2>
            <form onSubmit={handleAssignSubmit}>
              <div className="space-y-6">
                {/* Selection Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="assign-user" className="block text-sm font-medium text-foreground mb-2">Select User</label>
                    <select
                      id="assign-user"
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-foreground"
                    >
                      <option value="">Choose a user</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.name}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="assign-status" className="block text-sm font-medium text-foreground mb-2">Select Status</label>
                    <select
                      id="assign-status"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-foreground"
                    >
                      <option value="">Choose a status</option>
                      <option value="ONBOARDED">ONBOARDED</option>
                      <option value="ASSIGNED">ASSIGNED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="ON_HOLD">ON_HOLD</option>
                    </select>
                  </div>
                </div>
                
                {/* Add Button */}
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={handleAddUserStatus}
                    disabled={!selectedUser || !selectedStatus}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle size={18} /> Add Assignment
                  </Button>
                </div>

                {/* Selected Assignments */}
                {userStatusPairs.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-foreground">Selected Assignments:</h3>
                    <div className="space-y-2">
                      {userStatusPairs.map((pair) => (
                        <div key={pair.id} className="flex items-center justify-between p-3 bg-muted border border-border rounded-md">
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">{pair.user}</span>
                            <span className="text-sm text-muted-foreground">→</span>
                            <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded">{pair.status}</span>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveUserStatus(pair.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <Button
                  type="button"
                  onClick={() => {
                    setIsAssignModalOpen(false);
                    setSelectedProject(null);
                    setUserStatusPairs([]);
                    setSelectedUser("");
                    setSelectedStatus("");
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                >
                  Assign
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}