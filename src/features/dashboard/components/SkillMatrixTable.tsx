import React, { useMemo, useState, useLayoutEffect, useRef } from "react";
import { type SkillMatrixData } from "./types";
import { Table } from "../../../components/Table/Table";

interface SkillMatrixTableProps {
  data: SkillMatrixData;
}

type FlatUserRow = {
  id: string;
  name: string;
  [key: string]: string | number;
};

const SkillMatrixTable: React.FC<SkillMatrixTableProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [calculatedRows, setCalculatedRows] = useState(5);

  useLayoutEffect(() => {
    const calculateVisibleRows = () => {
      if (!containerRef.current) return;

      const availableHeight = containerRef.current.clientHeight;
      const estimatedStaticHeight = 200; // Search bar, header, pagination + gaps
      const estimatedRowHeight = 50; // Table row height

      const availableHeightForRows = availableHeight - estimatedStaticHeight;
      const rowsThatFit = Math.floor(availableHeightForRows / estimatedRowHeight);

      setCalculatedRows(Math.max(1, rowsThatFit));
    };

    calculateVisibleRows();

    window.addEventListener("resize", calculateVisibleRows);
    return () => window.removeEventListener("resize", calculateVisibleRows);
  }, []);

  const tableData = useMemo(() => {
    const skillLookup: Record<string, Record<string, number>> = {};
    
    data.skills.forEach(({ userId, topicId, value }) => {
      if (!skillLookup[userId]) skillLookup[userId] = {};
      skillLookup[userId][topicId] = value;
    });

    return data.users.map((user) => {
      const row: FlatUserRow = {
        id: user.id,
        name: user.name,
      };

      data.topics.forEach((topic) => {
        row[topic.id] = skillLookup[user.id]?.[topic.id] ?? "";
      });

      return row;
    });
  }, [data]);

  const headers = ["User / Skill", ...data.topics.map((topic) => topic.label)];
  const keys = ["name", ...data.topics.map((topic) => topic.id)];

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] min-w-0">
      <Table
        headers={headers}
        keys={keys}
        data={tableData}
        // ONLY pass the dynamically calculated row count!
        rowsPerPageOptions={[calculatedRows]} 
        showSearch={false}
      />
    </div>
  );
};

export default SkillMatrixTable;