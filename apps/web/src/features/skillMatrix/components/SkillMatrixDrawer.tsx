import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/atoms';
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
        <Button
          type="button"
          variant='secondary'
          aria-label="Open filters and settings"
          title="Filters & Settings"
        >
          <SlidersHorizontal className="size-5" />
        </Button>
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
            <Button
              aria-label="Close"
              variant='ghost'
            >
              <X className="size-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
          <SkillMatrixQueryBuilder
            users={users}
            topics={topics}
            filters={queryFilters}
            onFiltersChange={onQueryFiltersChange}
          />
          
          <div className="border-t border-border" />
          
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
          
          <div className="border-t border-border" />
          
          <SkillMatrixColumnRearrange
            topics={orderedTopics}
            onOrderChange={onColumnOrderChange}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
