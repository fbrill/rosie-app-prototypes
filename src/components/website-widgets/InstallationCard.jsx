import { useState } from "react"
import {
  CodeBracketSquareIcon,
  GlobeAltIcon,
  ArrowUpRightIcon,
  PencilSquareIcon,
  Square2StackIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline"
import SectionCard from "./SectionCard"
import InfoBanner from "./InfoBanner"

const INSTALL_HELP_URL =
  "https://heyrosie.com/support/en/articles/13414782-website-texting-how-to-install-the-website-widget"

const ALLOWED_DOMAINS = ["northshorepaint.com", "northshorepaint-frisco.com"]

const SNIPPET = `<script
    src="https://widget.heyrosie.com/widget.js"
    async
    data-rosie-business-id="54c4251f-1079-49cb-bf90-f5511d798b07">
</script>`

/** Light-purple action button used in each sub-card header (Edit / Copy). */
function CardAction({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-200"
    >
      <Icon className="size-[18px]" strokeWidth={2} />
      {label}
    </button>
  )
}

/** White card with a grey-icon header, optional action, sublabel, and body. */
function SubCard({ icon: Icon, title, action, sublabel, children }) {
  return (
    <div className="rounded-[12px] border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="size-6 shrink-0 text-gray-700" strokeWidth={1.5} />
          <h3 className="text-base font-semibold text-black">{title}</h3>
        </div>
        {action}
      </div>
      <p className="mt-1 text-sm text-gray-700">{sublabel}</p>
      <div className="mt-4">{children}</div>
    </div>
  )
}

/** Expandable, copyable code snippet box. */
function CodeBlock() {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="relative overflow-hidden rounded-[12px] border border-gray-200 bg-gray-25">
      <pre
        className={`overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-5 text-gray-800 ${
          expanded ? "" : "max-h-[108px]"
        }`}
      >
        <code>{SNIPPET}</code>
      </pre>

      {expanded ? (
        <div className="flex justify-center border-t border-gray-200 bg-white/60 py-2.5">
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <MinusCircleIcon className="size-5" strokeWidth={1.5} />
            Click to Collapse
          </button>
        </div>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-gray-25 to-transparent" />
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="absolute inset-0 flex items-center justify-center"
            aria-label="Expand code snippet"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50">
              <PlusCircleIcon className="size-5" strokeWidth={1.5} />
              Click to Expand
            </span>
          </button>
        </>
      )}
    </div>
  )
}

/**
 * Agent Settings → Website Widgets → Installation section. An info banner links
 * to the install docs, then two cards: the Allowed Domains list and the
 * copyable, expandable installation code snippet. Lives at the bottom of the
 * page, beneath the live preview.
 */
export default function InstallationCard() {
  const [copied, setCopied] = useState(false)

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(SNIPPET)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard unavailable (e.g. insecure context) — no-op for the prototype.
    }
  }

  return (
    <SectionCard icon={CodeBracketSquareIcon} title="Installation">
      <InfoBanner>
        Add this code snippet to your website to display the widget on the
        domains listed below.{" "}
        <a
          href={INSTALL_HELP_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-0.5 font-medium text-gray-900 underline underline-offset-2 hover:text-purple-700"
        >
          Installation Instructions
          <ArrowUpRightIcon className="size-3" strokeWidth={2} />
        </a>
      </InfoBanner>

      <div className="flex flex-col gap-5 p-6">
        <SubCard
          icon={GlobeAltIcon}
          title="Allowed Domains"
          sublabel="Enter the URL of the website(s) where this widget should be displayed."
          action={<CardAction icon={PencilSquareIcon} label="Edit" />}
        >
          <div className="flex flex-col gap-1.5 rounded-[12px] border border-gray-200 bg-gray-25 px-4 py-3.5">
            {ALLOWED_DOMAINS.map((domain) => (
              <span key={domain} className="text-sm text-gray-900">
                {domain}
              </span>
            ))}
          </div>
        </SubCard>

        <SubCard
          icon={CodeBracketSquareIcon}
          title="Installation Code"
          sublabel="Code snippet to add to your website."
          action={
            <CardAction
              icon={copied ? CheckIcon : Square2StackIcon}
              label={copied ? "Copied" : "Copy"}
              onClick={copySnippet}
            />
          }
        >
          <CodeBlock />
        </SubCard>
      </div>
    </SectionCard>
  )
}
