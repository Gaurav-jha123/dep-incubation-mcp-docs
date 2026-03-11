import React from "react";

const SkillMatrixTableLegend: React.FC = () => {
  return (
    <div className="flex items-center gap-2 pr-4">
      {/* values */}
      <div className="flex flex-col justify-between text-xs text-gray-600 h-[240px]">
        <span>100</span>
        <span>75</span>
        <span>50</span>
        <span>25</span>
        <span>0</span>
      </div>

      {/* gradient bar */}
      <div
        className="w-[12px] h-[240px] rounded-sm border"
        style={{
          background:
            "linear-gradient(to bottom, hsl(120,70%,60%), hsl(60,70%,60%), hsl(0,70%,60%))",
        }}
      />
    </div>
  );
};

export default SkillMatrixTableLegend;
