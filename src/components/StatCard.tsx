import type { ComponentType, SVGProps } from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <article className="stat-card">
      <Icon />

      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}
