import React from "react";
import { Link } from "react-router-dom";
import type { Section } from "@/data/categorySections";

type CategoryMenuProps = {
  sections: Section[];
};

export default function CategoryMenu({ sections }: CategoryMenuProps) {
  return (
    <div className="space-y-6">
      {sections.map((section, idx) => (
        <div key={`${section.title}-${idx}`} className="rounded-lg border border-border/50 bg-card/40 p-4">
          <div className="mb-3 flex items-center gap-2">
            {section.icon ? (
              <span className="text-xl leading-none" aria-hidden>
                {section.icon}
              </span>
            ) : null}
            <h2 className="text-lg font-semibold">{section.title}</h2>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {section.items.map((item, i) => (
              <li key={`${item.to}-${i}`} className="">
                <Link
                  to={item.to}
                  className="block rounded-md px-2 py-2 hover:bg-muted/40 transition-colors"
                >
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}