import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {SlidersHorizontal, X} from 'lucide-react';
import SkillMatrixFilter from './SkillMatrixFilter';
import SkillMatrixColumnRearrange from './SkillMatrixColumnRearrange';
import type {Topic} from './types';

interface SkillMatrixDrawerProps {
  users: {id: string; name: string}[];
  topics: {id: string; label: string}[];
  selectedUsers: string[];
  selectedTopics: string[];
  onUsersChange: (values: string[]) => void;
  onTopicsChange: (values: string[]) => void;
  orderedTopics: Topic[];
  onColumnOrderChange: (orderedTopicIds: string[]) => void;
  scoreFilters: string[];
  onScoreFilterChange: (values: string[]) => void;
}

export default function SkillMatrixDrawer({
  users,
  topics,
  selectedUsers,
  selectedTopics,
  onUsersChange,
  onTopicsChange,
  orderedTopics,
  onColumnOrderChange,
  scoreFilters,
  onScoreFilterChange,
}: SkillMatrixDrawerProps) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button
          type="button"
          className="cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
          aria-label="Open filters and settings"
          title="Filters & Settings"
        >
          <SlidersHorizontal className="size-5" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-start justify-between">
          <div>
            <DrawerTitle>Filters & Settings</DrawerTitle>
            <DrawerDescription>
              Filter the skill matrix data and rearrange columns.
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <button
              type="button"
              className="rounded-sm cursor-pointer opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex flex-1 flex-col gap-6 overflow-hidden p-4">
          <SkillMatrixFilter
            users={users}
            topics={topics}
            selectedUsers={selectedUsers}
            selectedTopics={selectedTopics}
            onUsersChange={onUsersChange}
            onTopicsChange={onTopicsChange}
            scoreFilters={scoreFilters}
            onScoreFilterChange={onScoreFilterChange}
          />
          <SkillMatrixColumnRearrange
            topics={orderedTopics}
            onOrderChange={onColumnOrderChange}
            className="flex-1 min-h-0"
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
