"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import GlobalSidebar from "./GlobalSidebar"
import SettingsNav from "./SettingsNav"
import PageHeader from "./PageHeader"
import SectionCard from "./SectionCard"
import WidgetPreview from "./WidgetPreview"
import ConfirmSwitchModal from "./ConfirmSwitchModal"
import ChatWidgetCard from "./ChatWidgetCard"
import TextingWidgetCard from "./TextingWidgetCard"
import CompareView from "./CompareView"
import InstallationCard from "./InstallationCard"
import InfoBanner from "./InfoBanner"
import CustomizationModal from "./CustomizationModal"
import { useWidgetJourney } from "./useWidgetJourney"
import { useWidgetCustomization } from "./useWidgetCustomization"
import { SwatchIcon, PencilSquareIcon } from "@heroicons/react/24/outline"

/**
 * Agent Settings → Website Widgets. Full app shell wrapping a single
 * click-through journey: Website Chat (default, included) → compare → enable the
 * $50/mo Website Texting add-on → provision the SMS number → live texting, and
 * back. A DialKit panel jumps to any state for review. The live widget preview
 * sits in its own container below, except during the compare takeover.
 */
export default function WebsiteWidgets() {
  const journey = useWidgetJourney()
  const customization = useWidgetCustomization()
  const [confirmSwitchToChat, setConfirmSwitchToChat] = useState(false)
  const [customizeOpen, setCustomizeOpen] = useState(false)

  const { stage } = journey
  const isCompare = stage === "compare"

  const renderMain = () => {
    if (isCompare) {
      return (
        <CompareView
          onBack={journey.closeCompare}
          onUpgrade={journey.upgrade}
          provisioned={journey.addonProvisioned}
        />
      )
    }
    if (stage === "chat") {
      return (
        <ChatWidgetCard
          provisioned={journey.addonProvisioned}
          onCompare={journey.openCompare}
          onSwitchToTexting={journey.switchToTexting}
        />
      )
    }
    return (
      <TextingWidgetCard
        stage={stage}
        numberStatus={journey.numberStatus}
        onActivateNumber={journey.activateNumber}
        onSwitchToChat={() => setConfirmSwitchToChat(true)}
      />
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

      <ConfirmSwitchModal
        open={confirmSwitchToChat}
        from="texting"
        to="chat"
        onClose={() => setConfirmSwitchToChat(false)}
        onConfirm={() => {
          journey.switchToChat()
          setConfirmSwitchToChat(false)
        }}
      />

      <CustomizationModal
        open={customizeOpen}
        type={journey.previewType}
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
