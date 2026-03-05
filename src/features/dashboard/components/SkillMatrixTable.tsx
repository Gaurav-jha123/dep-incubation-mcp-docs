import React, { useState, useMemo } from "react";
import { type SkillMatrixData } from "./types";
import SkillMatrixFilters from "./SkillMatrixFilters";

interface SkillMatrixTableProps {
  data: SkillMatrixData;
}

export type sortOrder = "ascending" | "descending";

const SkillMatrixTable: React.FC<SkillMatrixTableProps> = ({ data }) => {
  const [sortColumn, setSortColumn] = useState<string>("User / Skill");
  const [sortOrder, setSortOrder] = useState<sortOrder>("ascending");

  // Create a lookup for skills: { [userId]: { [topicId]: value } }
  const skillLookup: Record<string, Record<string, number>> = {};

  data.skills.forEach(({ userId, topicId, value }) => {
    if (!skillLookup[userId]) skillLookup[userId] = {};
    skillLookup[userId][topicId] = value;
  });

  // Get sorted users based on selected column and order
  const sortedUsers = useMemo(() => {
    const usersCopy = [...data.users];
    const isAscending = sortOrder === "ascending";

    usersCopy.sort((a, b) => {
      let valueA: string | number;
      let valueB: string | number;

      if (sortColumn === "User / Skill") {
        valueA = a.name;
        valueB = b.name;
        const comparison = valueA.localeCompare(valueB);
        return isAscending ? comparison : -comparison;
      }

      valueA = skillLookup[a.id]?.[sortColumn] ?? -Infinity;
      valueB = skillLookup[b.id]?.[sortColumn] ?? -Infinity;
      const comparison = valueA - valueB;
      return isAscending ? comparison : -comparison;
    });

    return usersCopy;
  }, [sortColumn, sortOrder, data.users, skillLookup]);

  const columnOptions = [
    "User / Skill",
    ...data.topics.map(topic => topic.id)
  ];

  // Helper function to render sort arrow
  const renderSortArrow = (columnId: string) => {
    if (sortColumn !== columnId) return null;

    const arrowIcon = sortOrder === "ascending" ? "▲" : "▼";
    return <span className="ml-2">{arrowIcon}</span>;
  };

  return (
    <div className="w-full">
      {/* Filters Section - Now using separate component */}
      <SkillMatrixFilters
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        columnOptions={columnOptions}
        onSortColumnChange={setSortColumn}
        onSortOrderChange={setSortOrder}
      />

      {/* Table Section */}
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
                  {renderSortArrow("User / Skill")}
                </th>
                {data.topics.map(topic => (
                  <th
                    key={topic.id}
                    className="sticky top-0 z-20 bg-white border border-gray-400 px-4 py-2 text-left whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis"
                    style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.04)" }}
                    title={topic.label}
                  >
                    {topic.label}
                    {renderSortArrow(topic.id)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map(user => (
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
    </div>
  );
};

export default SkillMatrixTable;