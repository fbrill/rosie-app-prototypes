"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import GlobalSidebar from "./GlobalSidebar"
import SettingsNav from "./SettingsNav"
import PageHeader from "./PageHeader"
import SectionCard from "./SectionCard"
import WidgetPreview from "./WidgetPreview"
import BillingSwitchModal from "./BillingSwitchModal"
import WidgetSelector from "./WidgetSelector"
import HowItWorksBanner from "./HowItWorksBanner"
import CompareView from "./CompareView"
import InstallationCard from "./InstallationCard"
import InfoBanner from "./InfoBanner"
import CustomizationModal from "./CustomizationModal"
import { useWidgetJourney } from "./useWidgetJourney"
import { useWidgetCustomization } from "./useWidgetCustomization"
import { SwatchIcon, PencilSquareIcon } from "@heroicons/react/24/outline"

// End of the current billing period (prototype constant — kept stable to avoid
// SSR/client date drift).
const BILLING_PERIOD_END = "June 26, 2026"

/**
 * Agent Settings → Website Widgets. The top section is two stacked containers —
 * Website Chat (free, default) and Website Texting ($50/mo add-on) — that show
 * which widget is live, the lead-journey progress, and the upgrade / switch-back
 * flow. Below sit the unchanged Customization and Installation containers. A
 * DialKit panel jumps to any state for review.
 */
export default function WebsiteWidgets() {
  const journey = useWidgetJourney()
  const customization = useWidgetCustomization()
  const [billingOpen, setBillingOpen] = useState(false)
  const [customizeOpen, setCustomizeOpen] = useState(false)
  const [introVisible, setIntroVisible] = useState(true)

  // Which widget type the preview (and, in turn, the Edit modal) is showing.
  // Defaults to the live widget and follows it, but the Chat/Texting toggle can
  // override it — so opening Edit configures exactly what's on screen.
  const [previewType, setPreviewType] = useState(journey.previewType)
  useEffect(() => setPreviewType(journey.previewType), [journey.previewType])

  const { stage } = journey
  const isCompare = stage === "compare"

  const renderMain = () => {
    if (isCompare) {
      return (
        <CompareView
          onBack={journey.closeCompare}
          onUpgrade={journey.subscribeTexting}
          provisioned={journey.addonProvisioned}
        />
      )
    }
    // One Widget container (radio group of the two types) under a dismissible
    // how-it-works + upsell banner.
    return (
      <>
        {introVisible && (
          <HowItWorksBanner
            onDismiss={() => setIntroVisible(false)}
            onUpsell={journey.openCompare}
          />
        )}
        <WidgetSelector
          stage={stage}
          liveWidget={journey.liveWidget}
          periodEndLabel={BILLING_PERIOD_END}
          chatSwitchNotice={journey.chatSwitchNotice}
          onUpsell={journey.openCompare}
          onSwitchToChat={() => setBillingOpen(true)}
          onKeepTexting={journey.keepTexting}
          onDismissChatSwitchNotice={journey.dismissChatSwitchNotice}
        />
      </>
    )
  }

  return (
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

          <AnimatePresence mode="wait">
            <motion.div
              key={isCompare ? "compare" : "widget"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-2.5"
            >
              {renderMain()}

              {!isCompare && (
                <>
                  <SectionCard
                    icon={SwatchIcon}
                    title="Website Widget Customization"
                  >
                    <InfoBanner>
                      Customize the look of the widget that will display on your
                      website.
                    </InfoBanner>
                    <div className="p-6">
                      <WidgetPreview
                        type={journey.previewType}
                        previewType={previewType}
                        onPreviewTypeChange={setPreviewType}
                        settings={customization.settings}
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
                        Edit
                      </button>
                    </div>
                  </SectionCard>

                  <InstallationCard />
                </>
              )}
            </motion.div>
          </AnimatePresence>
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
    </div>
  )
}
