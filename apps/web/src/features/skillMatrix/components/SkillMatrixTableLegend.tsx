import React from "react";

const SkillMatrixTableLegend: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-1 pb-4">
      {/* values */}
      <div className="flex justify-between text-xs text-gray-600 w-60">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>

      {/* gradient bar */}
      <div
        className="h-3 w-60 rounded-sm border"
        style={{
          background:
            "linear-gradient(to right, hsl(0,70%,60%), hsl(60,70%,60%), hsl(120,70%,60%))",
        }}
      />
    </div>
  );
};

export default SkillMatrixTableLegend;
