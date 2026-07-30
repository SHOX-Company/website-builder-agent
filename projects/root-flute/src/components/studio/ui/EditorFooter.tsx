import StudioButton from "@/components/studio/ui/Button";

interface EditorFooterProps {
  onDelete?: () => void;
  deleteLabel?: string;
  deleteDisabled?: boolean;
  onCancel?: () => void;
  cancelLabel?: string;
  cancelDisabled?: boolean;
  onSave: () => void;
  saveLabel: string;
  saveDisabled?: boolean;
  error?: string | null;
}

/**
 * The one footer every Studio editor (drawer or single-document page) uses.
 * Destructive action pinned left, Cancel + primary action grouped right —
 * three independent flex items rather than nested text, so nothing wraps or
 * clips on narrow phones the way "Delete Permanently / Cancel / Save
 * Changes" used to.
 */
export default function EditorFooter({
  onDelete,
  deleteLabel = "Delete",
  deleteDisabled,
  onCancel,
  cancelLabel = "Cancel",
  cancelDisabled,
  onSave,
  saveLabel,
  saveDisabled,
  error,
}: EditorFooterProps) {
  return (
    <div
      className="flex-shrink-0 border-t border-brand-border px-4 sm:px-6 pt-3 sm:pt-4 flex flex-col gap-2"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      {error && <p className="text-xs text-red-400/90">{error}</p>}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-shrink-0">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleteDisabled}
              className="px-2 py-2 -mx-2 text-xs sm:text-sm font-sans font-medium text-red-400/90 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {deleteLabel}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {onCancel && (
            <StudioButton variant="ghost" size="sm" onClick={onCancel} disabled={cancelDisabled}>
              {cancelLabel}
            </StudioButton>
          )}
          <StudioButton size="sm" onClick={onSave} disabled={saveDisabled}>
            {saveLabel}
          </StudioButton>
        </div>
      </div>
    </div>
  );
}
