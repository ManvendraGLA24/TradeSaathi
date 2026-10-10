import { SettingsIcon } from "@/components/sidebar/icons";
import { StaticModulePage } from "@/components/ui/StaticModulePage";

export default function Page() {
  return (
    <StaticModulePage
      title="Settings"
      icon={<SettingsIcon size={22} />}
      description="Profile and display preference panels presented as a static interface preview."
      metrics={[
        { label: "ACCOUNT", value: "Guest trader", change: "Profile preview", tone: "accent" },
        { label: "TRADING LEVEL", value: "Intermediate", change: "Preference sample", tone: "accent" },
      ]}
      blocks={[
        {
          title: "Profile",
          cards: [
            { title: "Account details", description: "Display name: Guest trader · Email: guest@example.com · Experience: —", tag: "PROFILE", tone: "accent" },
            { title: "Chart platform", description: "Preferred chart workspace for opening market charts.", value: "TradingView", tag: "PREFERENCE", tone: "up" },
          ],
        },
        {
          title: "Display preferences",
          cards: [
            { title: "Dark mode", description: "Low-light interface for longer charting sessions.", value: "Selected", tag: "THEME", tone: "accent" },
            { title: "Notifications", description: "Scanner and product updates preference preview.", value: "Manage alerts", tag: "ALERTS", tone: "accent" },
          ],
        },
        {
          title: "Account & subscription",
          description: "Subscription and connected-service details would be shown here.",
          table: {
            columns: ["SETTING", "STATUS", "DETAILS"],
            rows: [
              ["Plan", "Free", "Sample account"],
              ["Market data", "Preview mode", "No live feed connected"],
              ["Connected broker", "Not connected", "Connection UI preview"],
            ],
          },
        },
      ]}
    />
  );
}
