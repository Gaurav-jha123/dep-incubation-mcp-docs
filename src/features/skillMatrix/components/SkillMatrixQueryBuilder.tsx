import { useState, useMemo, useCallback } from 'react';
import { Search, Filter, X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { User, Topic } from './types';

export interface QueryFilter {
  id: string;
  type: 'topic' | 'user' | 'score';
  operator: 'contains' | 'equals' | 'greater_than' | 'less_than' | 'between';
  value: string | number;
  value2?: number; // for 'between' operator
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

  // Quick search functionality
  const handleQuickSearch = useCallback((term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      onFiltersChange([]);
      return;
    }

    const quickFilters: QueryFilter[] = [];
    
    // Search in topic names
    if (topics.some(topic => topic.label.toLowerCase().includes(term.toLowerCase()))) {
      quickFilters.push({
        id: 'quick-topic-' + Date.now(),
        type: 'topic',
        operator: 'contains',
        value: term.toLowerCase(),
      });
    }
    
    // Search in user names
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

  // Add new filter
  const addFilter = () => {
    const newFilter: QueryFilter = {
      id: 'filter-' + Date.now(),
      type: 'topic',
      operator: 'contains',
      value: '',
    };
    onFiltersChange([...filters, newFilter]);
  };

  // Remove filter
  const removeFilter = (filterId: string) => {
    onFiltersChange(filters.filter(f => f.id !== filterId));
  };

  // Update filter
  const updateFilter = (filterId: string, updates: Partial<QueryFilter>) => {
    onFiltersChange(
      filters.map(f => f.id === filterId ? { ...f, ...updates } : f)
    );
  };

  // Clear all filters
  const clearAll = () => {
    setSearchTerm('');
    onFiltersChange([]);
  };

  // Get suggestions for autocomplete
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
          <Label className="font-medium">Query Builder</Label>
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
          {filters.length > 0 && (
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Quick search by topic or user name..."
          value={searchTerm}
          onChange={(e) => handleQuickSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Active Filters Display */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-900 text-sm rounded-md border"
            >
              <span className="capitalize">{filter.type}</span>
              <span className="text-xs">{filter.operator.replace('_', ' ')}</span>
              <span>{filter.value}</span>
              {filter.value2 && <span>- {filter.value2}</span>}
              <button
                onClick={() => removeFilter(filter.id)}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border rounded-lg p-4 bg-gray-50/50">
          <div className="flex items-center justify-between mb-3">
            <Label className="font-medium">Advanced Filters</Label>
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
      {filters.length > 0 && (
        <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
          <span className="font-medium">Active filters:</span> {filters.length} filter{filters.length !== 1 ? 's' : ''} applied
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
    <div className="flex items-center gap-2 p-2 border rounded bg-white">
      {index > 0 && (
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">AND</span>
      )}
      
      {/* Type Select */}
      <select
        value={filter.type}
        onChange={(e) => handleTypeChange(e.target.value as QueryFilter['type'])}
        className="px-2 py-1 border rounded text-sm"
      >
        {FILTER_TYPES.map(type => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      {/* Operator Select */}
      <select
        value={filter.operator}
        onChange={(e) => onUpdate({ operator: e.target.value as QueryFilter['operator'] })}
        className="px-2 py-1 border rounded text-sm"
      >
        {OPERATORS[filter.type].map(op => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>

      {/* Value Input */}
      <div className="relative">
        <Input
          type={filter.type === 'score' ? 'number' : 'text'}
          value={filter.value}
          onChange={(e) => onUpdate({ value: filter.type === 'score' ? parseInt(e.target.value) || 0 : e.target.value })}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={filter.type === 'score' ? '0-100' : `Search ${filter.type}...`}
          className="text-sm w-32"
          min={filter.type === 'score' ? 0 : undefined}
          max={filter.type === 'score' ? 100 : undefined}
        />
        
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10 mt-1">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100"
                onClick={() => {
                  onUpdate({ value: suggestion.text });
                  setShowSuggestions(false);
                }}
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Second Value for 'between' operator */}
      {filter.operator === 'between' && (
        <>
          <span className="text-sm text-gray-500">and</span>
          <Input
            type="number"
            value={filter.value2 || ''}
            onChange={(e) => onUpdate({ value2: parseInt(e.target.value) || 0 })}
            placeholder="100"
            className="text-sm w-20"
            min={0}
            max={100}
          />
        </>
      )}

      {/* Remove Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onRemove}
        className="p-1 h-auto"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}