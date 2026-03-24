import { Button, Divider } from "@/components/atoms";
import { Card } from "@/components/molecules";
import { Plus } from "lucide-react";
import "./Projects.scss";

// Example project data
const projects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Revamp the company website for better UX and performance.",
    status: "In Progress",
    members: ["Alice", "Bob"],
  },
  {
    id: 2,
    name: "Mobile App Launch",
    description: "Develop and launch the new mobile app for iOS and Android.",
    status: "Completed",
    members: ["Charlie", "Dana"],
  },
  {
    id: 3,
    name: "Marketing Campaign",
    description: "Plan and execute the Q2 marketing campaign.",
    status: "Pending",
    members: ["Eve", "Frank"],
  },
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-success-50 to-primary-50 flex flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary-900">Projects</h1>
          <Button className="bg-primary-500 hover:bg-primary-700 text-neutral-50 font-semibold flex items-center gap-2">
            <Plus size={18} /> New Project
          </Button>
        </div>
        <p className="text-lg text-primary-700 mb-6">
          Welcome to the Projects page. Here you can manage your projects.
        </p>
        <Divider className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="shadow-lg"
              variant="actions"
              title={project.name}
              actions={
                <>
                  <Button variant="outline">View</Button>
                  <Button variant="secondary">Edit</Button>
                </>
              }
            >
              <div className="border-b border-border px-4 pb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                    project.status === "Completed"
                      ? "bg-success-500 text-neutral-50"
                      : project.status === "In Progress"
                        ? "bg-warning-500 text-neutral-900"
                        : "bg-neutral-400 text-neutral-900"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <div>
                <p className="text-neutral-700 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.members.map((member) => (
                    <span
                      key={member}
                      className="inline-block px-3 py-1 rounded-full text-sm bg-primary-200 text-primary-900"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}