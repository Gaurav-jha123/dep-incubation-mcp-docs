import { useState, useMemo, useCallback } from 'react';
import { Search, Filter, X, Plus } from 'lucide-react';
import { Input } from '@/components/atoms/Input/Input';
import { Label } from '@/components/atoms/Label/Label';
import { Button } from '@/components/atoms/Button/Button';
import { Dropdown } from '@/components/organisms/Dropdown/Dropdown';

import type { User, Topic } from './types';

export interface QueryFilter {
  id: string;
  type: 'topic' | 'user' | 'score';
  operator: 'contains' | 'equals' | 'greater_than' | 'less_than' | 'between';
  value: string | number;
  value2?: number;
}

interface SkillMatrixQueryBuilderProps {
  users: User[];
  topics: Topic[];
  filters: QueryFilter[];
  onFiltersChange: (filters: QueryFilter[]) => void;
}

const FILTER_TYPES = [
  { value: 'topic', label: 'Topic' },
  { value: 'user', label: 'User' },
  { value: 'score', label: 'Score' },
] as const;

const OPERATORS = {
  topic: [
    { value: 'contains', label: 'contains' },
    { value: 'equals', label: 'equals' },
  ],
  user: [
    { value: 'contains', label: 'contains' },
    { value: 'equals', label: 'equals' },
  ],
  score: [
    { value: 'equals', label: 'equals' },
    { value: 'greater_than', label: 'greater than' },
    { value: 'less_than', label: 'less than' },
    { value: 'between', label: 'between' },
  ],
} as const;

export default function SkillMatrixQueryBuilder({
  users,
  topics,
  filters,
  onFiltersChange,
}: SkillMatrixQueryBuilderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleQuickSearch = useCallback((term: string) => {
    setSearchTerm(term);

    if (!term.trim()) {
      onFiltersChange([]);
      return;
    }

    const quickFilters: QueryFilter[] = [];

    if (topics.some(topic => topic.label.toLowerCase().includes(term.toLowerCase()))) {
      quickFilters.push({
        id: 'quick-topic-' + Date.now(),
        type: 'topic',
        operator: 'contains',
        value: term.toLowerCase(),
      });
    }

    if (users.some(user => user.name.toLowerCase().includes(term.toLowerCase()))) {
      quickFilters.push({
        id: 'quick-user-' + Date.now(),
        type: 'user',
        operator: 'contains',
        value: term.toLowerCase(),
      });
    }

    onFiltersChange(quickFilters);
  }, [topics, users, onFiltersChange]);

  const addFilter = () => {
    const newFilter: QueryFilter = {
      id: 'filter-' + Date.now(),
      type: 'topic',
      operator: 'contains',
      value: '',
    };
    onFiltersChange([...filters, newFilter]);
  };

  const removeFilter = (filterId: string) => {
    onFiltersChange(filters.filter(f => f.id !== filterId));
  };

  const updateFilter = (filterId: string, updates: Partial<QueryFilter>) => {
    onFiltersChange(
      filters.map(f => f.id === filterId ? { ...f, ...updates } : f)
    );
  };

  const clearAll = () => {
    setSearchTerm('');
    onFiltersChange([]);
  };

  const getSuggestions = (type: 'topic' | 'user', value: string) => {
    if (!value) return [];

    const items = type === 'topic' ? topics : users;

    return items
      .filter(item => {
        const text = type === 'topic' ? (item as Topic).label : (item as User).name;
        return text.toLowerCase().includes(value.toLowerCase());
      })
      .slice(0, 5)
      .map(item => ({
        id: item.id,
        text: type === 'topic' ? (item as Topic).label : (item as User).name,
      }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <Label className="font-medium" label='Query Builder'/>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Filter className="w-4 h-4 mr-1" />
            Advanced
          </Button>

          {filters.some(f => f.value !== '' && f.value !== undefined) && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Quick Search */}
      <div className="relative">
        <Input
          leftIcon={<Search className="w-4 h-4" />}
          placeholder="Quick search by topic or user name..."
          value={searchTerm}
          onChange={(e) => handleQuickSearch(e.target.value)}
          className="pl-10"
          fullWidth
        />
      </div>

      {/* Active Filters Display */}
      {filters.some(f => f.value !== '' && f.value !== undefined) && (
        <div className="flex flex-wrap gap-2">
          {filters
            .filter(f => f.value !== '' && f.value !== undefined)
            .map((filter) => (
              <div
                key={filter.id}
                role="button"
                tabIndex={0}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary-200 text-neutral-900 text-sm rounded-md border"
                onClick={() => removeFilter(filter.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    removeFilter(filter.id);
                  }
                }}
              >
                <span className="capitalize">{filter.type}</span>
                <span className="text-xs">{filter.operator.replace('_', ' ')}</span>
                <span>{filter.value}</span>
                {filter.value2 && <span>- {filter.value2}</span>}
                <X className="w-3 h-3" />
              </div>
            ))}
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border rounded-lg p-4 bg-neutral-50/50">
          <div className="flex items-center justify-between mb-3">
            <Label className="font-medium" label='Advanced Filters'/>
            <Button
              variant="outline"
              size="sm"
              onClick={addFilter}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Filter
            </Button>
          </div>

          <div className="space-y-3">
            {filters.map((filter, index) => (
              <AdvancedFilterRow
                key={filter.id}
                filter={filter}
                index={index}
                onUpdate={(updates) => updateFilter(filter.id, updates)}
                onRemove={() => removeFilter(filter.id)}
                getSuggestions={getSuggestions}
              />
            ))}
          </div>
        </div>
      )}

      {/* Results Summary */}
      {filters.some(f => f.value !== '' && f.value !== undefined) && (
        <div className="text-sm text-neutral-700 bg-primary-200 p-2 rounded">
          <span className="font-medium">Active filters:</span>{' '}
          {filters.filter(f => f.value !== '' && f.value !== undefined).length} filter
          {filters.filter(f => f.value !== '' && f.value !== undefined).length !== 1 ? 's' : ''} applied
        </div>
      )}
    </div>
  );
}

interface AdvancedFilterRowProps {
  filter: QueryFilter;
  index: number;
  onUpdate: (updates: Partial<QueryFilter>) => void;
  onRemove: () => void;
  getSuggestions: (type: 'topic' | 'user', value: string) => Array<{id: string; text: string}>;
}

function AdvancedFilterRow({
  filter,
  index,
  onUpdate,
  onRemove,
  getSuggestions,
}: AdvancedFilterRowProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    if (filter.type === 'score') return [];
    return getSuggestions(filter.type, filter.value.toString());
  }, [filter.type, filter.value, getSuggestions]);

  const handleTypeChange = (type: QueryFilter['type']) => {
    onUpdate({
      type,
      operator: OPERATORS[type][0].value,
      value: '',
      value2: undefined,
    });
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded bg-neutral-50">
      {index > 0 && (
        <span className="text-xs bg-neutral-500 px-2 py-1 rounded text-neutral-900">AND</span>
      )}

      <Dropdown size="sm" className="flex-shrink-0">
        <Dropdown.Trigger>{filter.type}</Dropdown.Trigger>
        <Dropdown.Content>
          {FILTER_TYPES.map((type) => (
            <Dropdown.Item
              key={type.value}
              onClick={() => handleTypeChange(type.value)}
            >
              {type.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown>

      <Dropdown size="sm" className="flex-shrink-0">
        <Dropdown.Trigger>{filter.operator}</Dropdown.Trigger>
        <Dropdown.Content>
          {OPERATORS[filter.type].map((op) => (
            <Dropdown.Item
              key={op.value}
              onClick={() =>
                onUpdate({ operator: op.value as QueryFilter["operator"] })
              }
            >
              {op.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown>

      <div className="relative flex-1">
        <Input
          type={filter.type === "score" ? "number" : "text"}
          value={filter.value}
          onChange={(e) =>
            onUpdate({
              value:
                filter.type === "score"
                  ? parseInt(e.target.value) || 0
                  : e.target.value,
            })
          }
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={
            filter.type === "score" ? "0-100" : `Search ${filter.type}...`
          }
          fullWidth
          inputSize='sm'
          min={filter.type === "score" ? 0 : undefined}
          max={filter.type === "score" ? 100 : undefined}
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 bg-neutral-50 border rounded-md shadow-lg z-10 mt-1"
          role="listbox"
          aria-label={`${filter.type} suggestions`}
          >
            {suggestions.map((suggestion) => (
              <li
                role='option'
                key={suggestion.id}
                aria-selected={false}
                tabIndex={0}
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-neutral-400 cursor-pointer"
                onClick={() => {
                  onUpdate({ value: suggestion.text });
                  setShowSuggestions(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onUpdate({ value: suggestion.text });
                    setShowSuggestions(false);
                  }
                }}
              >
                {suggestion.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      {filter.operator === "between" && (
        <>
          <span className="text-sm text-neutral-500">and</span>
          <Input
            type="number"
            value={filter.value2 || ""}
            onChange={(e) =>
              onUpdate({ value2: parseInt(e.target.value) || 0 })
            }
            placeholder="100"
            className="text-sm w-20"
            min={0}
            max={100}
          />
        </>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="p-1 h-auto flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}