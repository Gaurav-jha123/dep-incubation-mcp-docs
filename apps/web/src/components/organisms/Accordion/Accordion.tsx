import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronUpIcon } from 'lucide-react';

export type AccordionItem = { title: string; content: string }

export interface AccordionProps {
  items: AccordionItem[]
}

export function Accordion({ items }: AccordionProps) {
  return (
    <div className="w-full p-2 mx-auto rounded-2xl">
      {items.map((item, idx) => (
        <Disclosure key={idx}>
          {({ open }: { open: boolean }) => (
            <>
              <DisclosureButton
                className="mt-2 flex w-full justify-between px-4 py-2 text-sm font-medium
                           text-left text-neutral-700 bg-primary-200 rounded-lg
                           hover:bg-primary-400 focus:outline-none focus-visible:ring
                           focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
              >
                <span>{item.title}</span>
                <ChevronUpIcon
                  className={`w-5 h-5 text-primary-500 transition-transform ${open ? 'rotate-180' : ''}`}
                />
              </DisclosureButton>
              <DisclosurePanel className="px-4 pt-4 pb-2 text-sm text-neutral-700">
                {item.content}
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  )
}
