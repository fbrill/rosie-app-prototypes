import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"
import EditableText from "../edit-mode/EditableText"

/**
 * The shared FeatureList renderer used by the inline widget comparison
 * (WidgetCompareInline), which supplies its own feature arrays.
 *
 * Renders a checkmark/X feature list. When `idPrefix` is given, each label is
 * editable in edit mode under `${idPrefix}.${index}` — index-keyed so editing a
 * label never changes its override key.
 */
export function FeatureList({ features, idPrefix }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-2">
          {f.yes ? (
            <CheckIcon
              className="mt-0.5 size-5 shrink-0 text-purple-600"
              strokeWidth={2}
            />
          ) : (
            <XMarkIcon
              className="mt-0.5 size-5 shrink-0 text-gray-400"
              strokeWidth={2}
            />
          )}
          <span
            className={`text-sm ${f.yes ? "font-medium text-black" : "text-gray-500"}`}
          >
            {idPrefix ? (
              <EditableText id={`${idPrefix}.${i}`}>{f.label}</EditableText>
            ) : (
              f.label
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}
