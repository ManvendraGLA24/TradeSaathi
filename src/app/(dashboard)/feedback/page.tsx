import { FeedbackIcon } from "@/components/sidebar/icons";
import { StaticModulePage } from "@/components/ui/StaticModulePage";

export default function Page() {
  return (
    <StaticModulePage
      title="Feedback"
      icon={<FeedbackIcon size={22} />}
      description="A presentation-only feedback form for product ideas, bugs and general notes."
      cards={[
        { title: "Feature idea", description: "Suggest a workflow or improvement that would help your trading routine.", tag: "IDEA", tone: "accent" },
        { title: "Report an issue", description: "Describe a page or interaction that did not behave as expected.", tag: "BUG REPORT", tone: "down" },
      ]}
      fields={[
        { label: "Subject", placeholder: "What is your feedback about?" },
        { label: "Email (optional)", placeholder: "you@example.com", type: "email" },
        { label: "Category", placeholder: "Choose a category" },
        { label: "Message", placeholder: "Write your feedback…" },
      ]}
      actionLabel="Send feedback"
    />
  );
}
