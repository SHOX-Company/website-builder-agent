import { LucideIcon } from "lucide-react";
import PageHeader from "@/components/studio/ui/PageHeader";
import Card from "@/components/studio/ui/Card";
import EmptyState from "@/components/studio/ui/EmptyState";
import Badge from "@/components/studio/ui/Badge";
import UploadPlaceholder from "@/components/studio/ui/UploadPlaceholder";

interface PlaceholderPageProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  stat?: string;
  showUpload?: boolean;
}

export default function PlaceholderPage({
  eyebrow,
  title,
  description,
  icon,
  stat,
  showUpload = false,
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow={eyebrow} title={title} actions={<Badge tone="gold">Coming in a future phase</Badge>} />

      <Card padding="none">
        <EmptyState icon={icon} title="Nothing to manage here yet" description={description}>
          {stat && (
            <p className="text-brand-gold text-sm font-sans font-medium mt-1">{stat}</p>
          )}
        </EmptyState>
      </Card>

      {showUpload && <UploadPlaceholder />}
    </div>
  );
}
