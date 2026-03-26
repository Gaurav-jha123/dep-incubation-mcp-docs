import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider, type DividerProps } from "./Divider";

const meta: Meta<typeof Divider> = {
  title: "Atoms/Divider",
  component: Divider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

const orientationOptions = ["Horizontal", "vertical"] as const;

const sizeOptions = ["Small", "Medium", "Large"] as const;

const sizeMapping = {
  "Small" : "sm",
  "Medium" : "md",
  "Large": "lg"
}

export default meta;
type Story = StoryObj<typeof Divider>;

export const HorizontalSmall: Story = {
  args: {
    orientation: "horizontal",
    size: "sm",
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4 w-[300px]">
        <div className="text-sm">Content Above</div>
        <Story />
        <div className="text-sm">Content Below</div>
      </div>
    ),
  ],
};

export const HorizontalMedium: Story = {
  args: {
    orientation: "horizontal",
    size: "md",
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4 w-[300px]">
        <div className="text-sm">Content Above</div>
        <Story />
        <div className="text-sm">Content Below</div>
      </div>
    ),
  ],
};

export const HorizontalLarge: Story = {
  args: {
    orientation: "horizontal",
    size: "lg",
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4 w-[300px]">
        <div className="text-sm">Content Above</div>
        <Story />
        <div className="text-sm">Content Below</div>
      </div>
    ),
  ],
};

export const VerticalSmall: Story = {
  args: {
    orientation: "vertical",
    size: "sm",
  },
  decorators: [
    (Story) => (
      <div className="flex items-center gap-4 h-[50px]">
        <div className="text-sm">Left Content</div>
        <Story />
        <div className="text-sm">Right Content</div>
      </div>
    ),
  ],
};

export const VerticalMedium: Story = {
  args: {
    orientation: "vertical",
    size: "md",
  },
  decorators: [
    (Story) => (
      <div className="flex items-center gap-4 h-[50px]">
        <div className="text-sm">Left Content</div>
        <Story />
        <div className="text-sm">Right Content</div>
      </div>
    ),
  ],
};

export const VerticalLarge: Story = {
  args: {
    orientation: "vertical",
    size: "lg",
  },
  decorators: [
    (Story) => (
      <div className="flex items-center gap-4 h-[50px]">
        <div className="text-sm">Left Content</div>
        <Story />
        <div className="text-sm">Right Content</div>
      </div>
    ),
  ],
};

export const StatesAndSelection: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="space-y-10 p-8">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-white p-3 text-left text-sm font-semibold text-neutral-900">
              State
            </th>
            {orientationOptions.map((orientation, index) => (
              <th
                key={`${orientation}_head_${index}`}
                className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500"
              >
                {orientation}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sizeOptions.map((size, index) => (
            <tr
              key={`${size}_${index}`}
              className="border-t border-dashed border-neutral-200"
            >
              <td className="sticky left-0 z-10 bg-white p-3 text-sm font-medium text-neutral-500">
                {size}
              </td>
              {orientationOptions.map((orientation) => (
                <td
                  key={`${orientation}_data_${index}`}
                  className="p-3 text-center "
                >
                  {orientation === "Horizontal" ? (
                    <div className="flex flex-col gap-4 w-[300px]">
                      <div className="text-sm">Content Above</div>
                      <Divider orientation={orientation.toLowerCase() as DividerProps["orientation"]} size={sizeMapping[size] as DividerProps["size"]}/>
                      <div className="text-sm">Content Below</div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 h-[50px]">
                      <div className="text-sm">Left Content</div>
                      <Divider orientation={orientation.toLowerCase() as DividerProps["orientation"]} size={sizeMapping[size] as DividerProps["size"]}/>
                      <div className="text-sm">Right Content</div>
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};
