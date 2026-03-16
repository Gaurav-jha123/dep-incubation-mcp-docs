import React, { useMemo, useState, useLayoutEffect, useRef } from "react";
import { Table } from "@/components/organisms";
import { type SkillMatrixData } from "./types";

interface SkillMatrixTableProps {
  data: SkillMatrixData;
  currentUserId: string;
  onUpdateSkill: (userId: string, topicId: string, value: number) => void;
}

type FlatUserRow = {
  id: string;
  name: string;
} & Record<string, number | string>;

const getHeatmapColor = (value: number): string => {
  const hue = (value / 100) * 120;
  return `hsl(${hue}, 70%, 60%)`;
};

const SkillMatrixTable: React.FC<SkillMatrixTableProps> = ({
  data,
  onUpdateSkill,
  currentUserId,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [calculatedRows, setCalculatedRows] = useState<number>(5);

  const [editingCell, setEditingCell] = useState<{
    userId: string;
    topicId: string;
  } | null>(null);

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
          cellRenderer={(value, key, row) => {
            if (key === "name") {
              const isOwner = row.id === currentUserId;
              return (
                <div className="px-4 py-3 flex items-center gap-2 font-medium">
                  <span>{value as string}</span>

                  {isOwner && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500"
                    >
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  )}
                </div>
              );
            }

            if (typeof value === "number") {
              const isOwner = row.id === currentUserId;

              const isEditing =
                editingCell?.userId === row.id && editingCell?.topicId === key;

              if (isEditing) {
                return (
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    defaultValue={value}
                    autoFocus
                    className="w-full text-center border rounded outline-none"
                    onBlur={(e) => {
                      const val = Number(e.target.value);

                      if (Number.isNaN(val) || val < 0 || val > 100) {
                        setEditingCell(null);
                        return;
                      }

                      onUpdateSkill(row.id, key, val);
                      setEditingCell(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const input = e.target as HTMLInputElement;
                        const val = Number(input.value);

                        if (Number.isNaN(val) || val < 0 || val > 100) {
                          setEditingCell(null);
                          return;
                        }

                        onUpdateSkill(row.id, key, val);
                        setEditingCell(null);
                      }
                    }}
                  />
                );
              }

              return (
                <button
                  type="button"
                  disabled={!isOwner}
                  className={`px-4 py-3 w-full flex items-center justify-center font-medium ${
                    isOwner ? "cursor-pointer" : ""
                  }`}
                  style={{
                    backgroundColor: getHeatmapColor(value),
                  }}
                  onClick={() => {
                    if (!isOwner) return;

                    setEditingCell({
                      userId: row.id,
                      topicId: key,
                    });
                  }}
                >
                  {value}
                </button>
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
 