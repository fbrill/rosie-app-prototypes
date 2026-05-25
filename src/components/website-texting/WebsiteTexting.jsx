import GlobalSidebar from "./GlobalSidebar"
import SettingsNav from "./SettingsNav"
import PageHeader from "./PageHeader"
import WidgetTypeCard from "./WidgetTypeCard"
import TextingSettingsCard from "./TextingSettingsCard"

/**
 * Agent Settings → Website Widgets page. Full app shell (global sidebar +
 * settings sub-nav + content) exploring the layout of the Website Texting
 * widget type. Foundation only — interactions/options come in a later pass.
 */
export default function WebsiteTexting() {
  return (
    <div className="min-h-screen bg-gray-200 p-2.5">
      <div className="flex items-start gap-2.5">
        <GlobalSidebar />
        <SettingsNav />
        <main className="flex min-w-0 flex-1 flex-col gap-2.5" aria-label="Website Widgets settings">
          <PageHeader />
          <WidgetTypeCard />
          <TextingSettingsCard />
        </main>
      </div>
    </div>
  )
}
