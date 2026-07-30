// Shared Materials Statement types — safe to import from both server and
// client code.
//
// This is a single curated block of copy, not a collection — so unlike
// inventory/videos there's no list of records, just one editable statement
// shown on the public Materials page (below the existing hero/intro/
// statements, which are untouched, protected content).

export interface MaterialsStatementContent {
  statement: string;
  updatedAt: string;
}

export const DEFAULT_MATERIALS_STATEMENT: MaterialsStatementContent = {
  statement:
    "Every year all Elk on Planet Earth naturally shed their Antlers. Hansen ONLY uses these Wild Shed Antlers. He uses vintage shells for harps and other instruments, usually they are several decades old.\n\nAll other animal products used are Fossils that are Tens of Thousands of years old.\n\nNo animals were ever, or will ever be harmed in the making of these flutes and jewelry.\n\nAll materials are treated with greatest respect and honor.",
  updatedAt: new Date(0).toISOString(),
};
