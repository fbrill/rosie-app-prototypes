"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import GlobalSidebar from "./GlobalSidebar"
import SettingsNav from "./SettingsNav"
import PageHeader from "./PageHeader"
import SectionCard from "./SectionCard"
import WidgetPreview from "./WidgetPreview"
import BillingSwitchModal from "./BillingSwitchModal"
import EnableTextingModal from "./EnableTextingModal"
import WidgetCompareInline from "./WidgetCompareInline"
import InstallationCard from "./InstallationCard"
import InfoBanner from "./InfoBanner"
import CustomizationModal from "./CustomizationModal"
import { useWidgetJourney } from "./useWidgetJourney"
import { useWidgetCustomization } from "./useWidgetCustomization"
import { EditModeProvider } from "../edit-mode/EditModeContext"
import EditableText from "../edit-mode/EditableText"
import EditModeToggle from "../edit-mode/EditModeToggle"
import { SwatchIcon, PencilSquareIcon } from "@heroicons/react/24/outline"

// End of the current billing period (prototype constant — kept stable to avoid
// SSR/client date drift).
const BILLING_PERIOD_END = "June 26, 2026"

// When the trial ends and Website Texting billing begins. Whether the account
// is currently in trial is driven live by DialKit (journey.inTrial), so the
// enable flow can be reviewed both in and out of trial. Prototype constant —
// kept stable to avoid SSR/client date drift.
const TRIAL_END = "June 24, 2026"

/**
 * Agent Settings → Website Widgets. The top section is one inline, side-by-side
 * comparison of Website Chat (free, default) and Website Texting ($50/mo add-on)
 * — it shows which widget is live, the lead-journey progress, and the upgrade /
 * switch-back flow. Below sit the Customization and Installation containers.
 */
export default function WebsiteWidgets() {
  const journey = useWidgetJourney()
  const customization = useWidgetCustomization()
  const [billingOpen, setBillingOpen] = useState(false)
  const [enableTextingOpen, setEnableTextingOpen] = useState(false)
  const [customizeOpen, setCustomizeOpen] = useState(false)

  // Which widget type the preview (and, in turn, the Edit modal) is showing.
  // Defaults to the live widget and follows it, but the Chat/Texting toggle can
  // override it — so opening Edit configures exactly what's on screen.
  const [previewType, setPreviewType] = useState(journey.previewType)
  useEffect(() => setPreviewType(journey.previewType), [journey.previewType])

  const { stage } = journey

  return (
    <EditModeProvider>
    <div className="min-h-screen bg-gray-200 p-2.5">
      <div className="flex items-start gap-2.5">
        <GlobalSidebar />
        <SettingsNav />
        <main
          className="flex min-w-0 flex-1 flex-col gap-2.5"
          aria-label="Website Widgets settings"
        >
          <PageHeader
            ready={journey.pendingPublish}
            changeKey={journey.publishNonce}
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-2.5"
          >
            <WidgetCompareInline
              stage={stage}
              liveWidget={journey.liveWidget}
              periodEndLabel={BILLING_PERIOD_END}
              chatSwitchNotice={journey.chatSwitchNotice}
              onChangeToTexting={() => setEnableTextingOpen(true)}
              onChangeToChat={() => setBillingOpen(true)}
              onKeepTexting={journey.keepTexting}
              onDismissChatSwitchNotice={journey.dismissChatSwitchNotice}
            />

            <SectionCard
              icon={SwatchIcon}
              title={
                <EditableText id="customization.sectionTitle" as="span">
                  Website Widget Customization
                </EditableText>
              }
            >
              <InfoBanner>
                <EditableText id="customization.info" multiline>
                  Customize the look of the widget that will display on your
                  website.
                </EditableText>
              </InfoBanner>
              <div className="p-6">
                <WidgetPreview
                  type={journey.previewType}
                  previewType={previewType}
                  onPreviewTypeChange={setPreviewType}
                  settings={customization.settings}
                  activeType={journey.liveWidget}
                />
              </div>

              {/* Footer: edit appearance */}
              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 bg-gray-25 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setCustomizeOpen(true)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-200"
                >
                  <PencilSquareIcon
                    className="size-[18px]"
                    strokeWidth={2}
                  />
                  <EditableText id="customization.editBtn">Edit</EditableText>
                </button>
              </div>
            </SectionCard>

            <InstallationCard />
          </motion.div>
        </main>
      </div>

      <BillingSwitchModal
        open={billingOpen}
        periodEndLabel={BILLING_PERIOD_END}
        onClose={() => setBillingOpen(false)}
        onSwitchNow={() => {
          journey.switchToChatNow()
          setBillingOpen(false)
        }}
        onSchedule={() => {
          journey.scheduleSwitchToChat()
          setBillingOpen(false)
        }}
      />

      <EnableTextingModal
        open={enableTextingOpen}
        isTrial={journey.inTrial}
        trialEndLabel={TRIAL_END}
        onClose={() => setEnableTextingOpen(false)}
        onConfirm={() => {
          journey.subscribeTexting()
          setEnableTextingOpen(false)
        }}
      />

      <CustomizationModal
        open={customizeOpen}
        type={previewType}
        settings={customization.settings}
        onCancel={() => setCustomizeOpen(false)}
        onSave={(next) => {
          customization.save(next)
          journey.markPending()
          setCustomizeOpen(false)
        }}
      />

      <EditModeToggle />
    </div>
    </EditModeProvider>
  )
}
