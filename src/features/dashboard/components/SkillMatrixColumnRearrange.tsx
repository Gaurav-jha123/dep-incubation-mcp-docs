import {useEffect, useMemo, useRef, useState} from 'react';
import {DragDropProvider} from '@dnd-kit/react';
import {useSortable} from '@dnd-kit/react/sortable';
import {move} from '@dnd-kit/helpers';
import {Modal} from '@/components/Modal/Modal';
import {Columns3} from 'lucide-react';
import type {Topic} from './types';

type ItemId = string;

function Sortable({id, label, index}: {id: ItemId; label: string; index: number}) {
  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const {isDragging} = useSortable({id, index, element, handle: handleRef});

  return (
    <li
      ref={setElement}
      className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm transition-shadow"
      data-shadow={isDragging || undefined}
    >
      <button
        ref={handleRef}
        type="button"
        aria-label={`Drag ${id}`}
        className="inline-flex size-7 shrink-0 cursor-grab items-center justify-center rounded-md border border-input bg-muted/40 text-muted-foreground active:cursor-grabbing"
      >
        ⋮⋮
      </button>
      <span className="text-foreground">{label}</span>
    </li>
  );
}

interface SkillMatrixColumnRearrangeProps {
  topics: Topic[];
  onOrderChange: (orderedTopicIds: string[]) => void;
}

export default function SkillMatrixColumnRearrange({topics, onOrderChange}: SkillMatrixColumnRearrangeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<ItemId[]>(() => createItemsFromTopics(topics));
  const topicLabelById = useMemo(
    () => Object.fromEntries(topics.map((topic) => [topic.id, topic.label])),
    [topics],
  );

  useEffect(() => {
    setItems(createItemsFromTopics(topics));
  }, [topics]);

  return (
    <>
      <button
        type="button"
        className="cursor-pointer bg-transparent ml-5 rounded-md border border-input px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
        onClick={() => setIsOpen(true)}
        aria-label="Rearrange Columns"
        title="Rearrange Columns"
      >
        <Columns3 className="size-5" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Rearrange Skill Matrix Columns"
        description="Drag and drop topics to reorder the column list."
        size="md"
        showCancelButton
      >
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
                
                console.log('nextItems: ', nextItems);
                onOrderChange(nextItems);
              }

              return nextItems;
            });
          }}
        >
          <ul className="mt-1 space-y-2">
            {items.map((id, index) => (
              <Sortable key={id} id={id} label={topicLabelById[id] ?? id} index={index} />
            ))}
          </ul>
        </DragDropProvider>
      </Modal>
    </>
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