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
import SkillMatrixQueryBuilder, { type QueryFilter } from './SkillMatrixQueryBuilder';
import type {Topic} from './types';

interface SkillMatrixDrawerProps {
  users: {id: string; name: string}[];
  topics: {id: string; label: string}[];
  selectedUsers: string[];
  selectedTopics: string[];
  onUsersChange: (values: string[]) => void;
  onTopicsChange: (values: string[]) => void;
  onUserCreate: (label: string) => void;
  onTopicCreate: (label: string) => void;
  orderedTopics: Topic[];
  onColumnOrderChange: (orderedTopicIds: string[]) => void;
  scoreFilters: string[];
  onScoreFilterChange: (values: string[]) => void;
  queryFilters: QueryFilter[];
  onQueryFiltersChange: (filters: QueryFilter[]) => void;
}

export default function SkillMatrixDrawer({
  users,
  topics,
  selectedUsers,
  selectedTopics,
  onUsersChange,
  onTopicsChange,
  onUserCreate,
  onTopicCreate,
  orderedTopics,
  onColumnOrderChange,
  scoreFilters,
  onScoreFilterChange,
  queryFilters,
  onQueryFiltersChange,
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
      <DrawerContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl">
        <DrawerHeader className="flex flex-row items-start justify-between">
          <div>
            <DrawerTitle>Query Builder & Filters</DrawerTitle>
            <DrawerDescription>
              Build complex queries, filter skill matrix data, and rearrange columns.
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
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
          <SkillMatrixQueryBuilder
            users={users}
            topics={topics}
            filters={queryFilters}
            onFiltersChange={onQueryFiltersChange}
          />
          
          <div className="border-t border-gray-200" />
          
          <SkillMatrixFilter
            users={users}
            topics={topics}
            selectedUsers={selectedUsers}
            selectedTopics={selectedTopics}
            onUsersChange={onUsersChange}
            onTopicsChange={onTopicsChange}
            onUserCreate={onUserCreate}
            onTopicCreate={onTopicCreate}
            scoreFilters={scoreFilters}
            onScoreFilterChange={onScoreFilterChange}
          />
          
          <div className="border-t border-gray-200" />
          
          <SkillMatrixColumnRearrange
            topics={orderedTopics}
            onOrderChange={onColumnOrderChange}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
