import React, { useMemo, useState, useLayoutEffect, useRef } from "react";
import { Table } from "@/components/organisms";
import { type SkillMatrixData } from "./types";

interface SkillMatrixTableProps {
  data: SkillMatrixData;
}

type FlatUserRow = {
  id: string;
  name: string;
} & Record<string, number | string>;

const getHeatmapColor = (value: number): string => {
  const hue = (value / 100) * 120;
  return `hsl(${hue}, 70%, 60%)`;
};

const SkillMatrixTable: React.FC<SkillMatrixTableProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [calculatedRows, setCalculatedRows] = useState<number>(5);

  const MAIN_CONTAINER_PADDING = 30;
  const FILTER_COMPONENT_HEIGHT = 50;
  const SPACER = 20;

  useLayoutEffect(() => {
    const calculateVisibleRows = (): void => {
      const main = document.getElementsByTagName("main")[0];

      if (!main) return;

      const mainHeight = main.clientHeight;

      const ESTIMATED_TABLE_HEADER_FOOTER_HEIGHT = 100;
      const estimatedRowHeight = 50;

      const availableHeight =
        mainHeight -
        (MAIN_CONTAINER_PADDING +
          FILTER_COMPONENT_HEIGHT +
          SPACER +
          ESTIMATED_TABLE_HEADER_FOOTER_HEIGHT);

      const rows = Math.floor(availableHeight / estimatedRowHeight);

      setCalculatedRows(Math.max(1, rows));
    };

    calculateVisibleRows();

    window.addEventListener("resize", calculateVisibleRows);

    return () => window.removeEventListener("resize", calculateVisibleRows);
  }, []);

  const tableData = useMemo<FlatUserRow[]>(() => {
    const skillLookup: Record<string, Record<string, number>> = {};

    data.skills.forEach(({ userId, topicId, value }) => {

      data.skills.forEach(({ userId, topicId, value }) => {
        if (!skillLookup[userId]) {
          skillLookup[userId] = {};
        }

        skillLookup[userId][topicId] = value;
      });


      if (!skillLookup[userId]) {
        skillLookup[userId] = {};
      }

      skillLookup[userId][topicId] = value;
    });

    return data.users.map((user) => {
      const row: FlatUserRow = {
        id: user.id,
        name: user.name,
      };

      data.topics.forEach((topic) => {
        const value = skillLookup[user.id]?.[topic.id];
        row[topic.id] = value ?? "";
      });

      return row;
    });
  }, [data]);

  const headers = ["User / Topic", ...data.topics.map((topic) => topic.label)];

  const keys = [
    "name",
    ...data.topics.map((topic) => topic.id),
  ] as (keyof FlatUserRow)[];

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-w-0 overflow-hidden flex flex-col"
    >
      {/* table */}
      <div className="flex-1 min-h-0 overflow-auto">
        <Table
          headers={headers}
          keys={keys}
          data={tableData}
          rowsPerPageOptions={[calculatedRows]}
          showSearch={false}
          stickyHeader
          stickyFirstColumn
          cellRenderer={(value, key) => {
            if (key === "name") {
              return (
                <div className="px-4 py-3 w-full h-full flex items-center font-medium">
                  {value as string}
                </div>
              );
            }

            if (typeof value === "number") {
              return (
                <div
                  className="px-4 py-3 w-full h-full flex items-center justify-center font-medium"
                  style={{
                    backgroundColor: getHeatmapColor(value),
                  }}
                >
                  {value}
                </div>
              );
            }

            return "";
          }}
        />
      </div>
    </div>
  );
};

export default SkillMatrixTable;
