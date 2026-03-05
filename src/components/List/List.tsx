import React from "react";

export interface ListItem {
  icon?: React.ReactNode;
  label: string;
  description?: string;
}

export interface SimpleListProps {
  items: ListItem[];
  className?: string;
}

export const List: React.FC<SimpleListProps> = ({
  items,
  className = "",
}) => {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item, idx) => (
        <li
          key={idx}
          className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          {item.icon && (
            <span className="text-gray-500 text-lg mt-0.5">{item.icon}</span>
          )}

          <div>
            <p className="text-gray-900 font-medium">{item.label}</p>
            {item.description && (
              <p className="text-gray-600 text-sm mt-0.5">{item.description}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

List.displayName = "List";