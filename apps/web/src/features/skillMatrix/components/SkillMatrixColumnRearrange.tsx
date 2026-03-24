import {useEffect, useMemo, useRef, useState} from 'react';
import {DragDropProvider} from '@dnd-kit/react';
import {useSortable} from '@dnd-kit/react/sortable';
import {move} from '@dnd-kit/helpers';
import type {Topic} from './types';
import {Button} from '@/components/atoms/Button/Button';

type ItemId = string;

function Sortable({id, label, index}: {id: ItemId; label: string; index: number}) {
  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const {isDragging} = useSortable({id, index, element, handle: handleRef});

  return (
    <li
      ref={setElement}
      className="flex items-center gap-3 rounded-md border border-border bg-neutral-50 px-3 py-2 text-sm transition-shadow"
      data-shadow={isDragging || undefined}
    >
      <Button
        ref={handleRef}
        aria-label={`Drag ${id}`}
        variant='ghost'
        className="inline-flex size-7 shrink-0 cursor-grab items-center justify-center rounded-md border border-input bg-neutral-200 text-neutral-900 active:cursor-grabbing"
      >
        ⋮⋮
      </Button>
      <span className="text-neutral-900">{label}</span>
    </li>
  );
}

interface SkillMatrixColumnRearrangeProps {
  topics: Topic[];
  onOrderChange: (orderedTopicIds: string[]) => void;
  className?: string;
}

export default function SkillMatrixColumnRearrange({topics, onOrderChange, className}: SkillMatrixColumnRearrangeProps) {
  const [items, setItems] = useState<ItemId[]>(() => createItemsFromTopics(topics));
  const topicLabelById = useMemo(
    () => Object.fromEntries(topics.map((topic) => [topic.id, topic.label])),
    [topics],
  );

  useEffect(() => {
    setItems(createItemsFromTopics(topics));
  }, [topics]);

  return (
    <div className={`flex flex-col ${className ?? ''}`}>
      <h4 className="text-sm font-medium text-neutral-900 mb-2">Rearrange Columns</h4>
      <p className="text-xs text-neutral-700 mb-3">Drag and drop topics to reorder the column list.</p>
      <div className="h-96 overflow-y-auto rounded-md border border-border p-3">
        <DragDropProvider
          onDragEnd={(event) => {
            setItems((prevItems) => {
              if (!hasValidDropTarget(event)) {
                return prevItems;
              }

              const nextItems = safelyMoveItems(prevItems, event);

              if (!nextItems || !isValidReorder(prevItems, nextItems)) {
                return prevItems;
              }

              if (!areSameOrder(prevItems, nextItems)) {
                onOrderChange(nextItems);
              }

              return nextItems;
            });
          }}
        >
          <ul className="space-y-2">
            {items.map((id, index) => (
              <Sortable key={id} id={id} label={topicLabelById[id] ?? id} index={index} />
            ))}
          </ul>
        </DragDropProvider>
      </div>
    </div>
  );
}

function createItemsFromTopics(topics: Topic[]) {
  return topics.map((topic) => topic.id);
}

function hasValidDropTarget(event: unknown) {
  if (!event || typeof event !== 'object') {
    return false;
  }

  const maybeEvent = event as {over?: unknown; target?: unknown; collision?: unknown};

  if ('over' in maybeEvent) {
    return Boolean(maybeEvent.over);
  }

  if ('target' in maybeEvent) {
    return Boolean(maybeEvent.target);
  }

  if ('collision' in maybeEvent) {
    return Boolean(maybeEvent.collision);
  }

  return true;
}

function safelyMoveItems(items: ItemId[], event: unknown) {
  try {
    return move(items, event as never);
  } catch {
    return null;
  }
}

function isValidReorder(previousItems: ItemId[], nextItems: ItemId[]) {
  if (previousItems.length !== nextItems.length) {
    return false;
  }

  const previousSet = new Set(previousItems);

  if (previousSet.size !== nextItems.length) {
    return false;
  }

  return nextItems.every((itemId) => previousSet.has(itemId));
}

function areSameOrder(previousItems: ItemId[], nextItems: ItemId[]) {
  return previousItems.every((itemId, index) => itemId === nextItems[index]);
}