import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-700">Projects</h1>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2">
            <Plus size={18} /> New Project
          </Button>
        </div>
        <p className="text-lg text-blue-600 mb-6">
          Welcome to the Projects page. Here you can manage your projects.
        </p>
        <Separator className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-700">
                  {project.name}
                </CardTitle>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                    project.status === "Completed"
                      ? "bg-green-500 text-white"
                      : project.status === "In Progress"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {project.status}
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.members.map((member) => (
                    <span key={member} className="inline-block px-3 py-1 rounded-full text-sm bg-blue-200 text-blue-800">
                      {member}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">View</Button>
                <Button variant="secondary">Edit</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}