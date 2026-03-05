import React from "react";
import { type SkillMatrixData } from "./types";

interface SkillMatrixTableProps {
  data: SkillMatrixData;
}

const SkillMatrixTable: React.FC<SkillMatrixTableProps> = ({ data }) => {
  // Create a lookup for skills: { [userId]: { [topicId]: value } }
  const skillLookup: Record<string, Record<string, number>> = {};

  data.skills.forEach(({ userId, topicId, value }) => {
    if (!skillLookup[userId]) skillLookup[userId] = {};
    skillLookup[userId][topicId] = value;
  });

  return (
    <div className="overflow-x-auto max-w-full">
      <div className="max-h-[600px] overflow-y-auto">
        <table className="min-w-[900px] w-full border border-gray-400 border-separate">
          <thead>
            <tr>
              <th
                className="sticky top-0 left-0 z-30 bg-white border border-gray-400 px-4 py-2 shadow whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis"
                style={{ boxShadow: "2px 2px 4px rgba(0,0,0,0.04)" }}
              >
                User / Skill
              </th>
              {data.topics.map(topic => (
                <th
                  key={topic.id}
                  className="sticky top-0 z-20 bg-white border border-gray-400 px-4 py-2 text-left whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis"
                  style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.04)" }}
                  title={topic.label}
                >
                  {topic.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.users.map(user => (
              <tr key={user.id}>
                <td
                  className="sticky left-0 z-10 bg-white border border-gray-400 px-4 py-2 font-medium shadow"
                  style={{ boxShadow: "2px 0 4px rgba(0,0,0,0.04)" }}
                >
                  {user.name}
                </td>
                {data.topics.map(topic => (
                  <td key={topic.id} className="border border-gray-400 px-4 py-2">
                    {skillLookup[user.id] && skillLookup[user.id][topic.id] !== undefined
                      ? skillLookup[user.id][topic.id]
                      : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkillMatrixTable;