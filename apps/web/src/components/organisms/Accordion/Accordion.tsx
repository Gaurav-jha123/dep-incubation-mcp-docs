import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from 'lucide-react';

export type AccordionItem = { title: string; content: string }

export interface AccordionProps {
  items: AccordionItem[]
}

export function Accordion({ items }: AccordionProps) {
  return (
    <div className="w-full max-w-md p-2 mx-auto rounded-2xl">
      {items.map((item, idx) => (
        <div key={idx} className="mt-2">
          <Disclosure>
            {({ open }: { open: boolean }) => (
              <>
              <Disclosure.Button
                className="flex justify-between w-full px-4 py-2 text-sm font-medium
                           text-left text-neutral-700 bg-primary-200 rounded-lg
                           hover:bg-primary-400 focus:outline-none focus-visible:ring
                           focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
              >
                <span>{item.title}</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-primary-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-neutral-700">
                {item.content}
              </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      ))}
    </div>
  )
}
