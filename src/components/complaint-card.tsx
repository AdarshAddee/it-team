
'use client';

import type { Complaint } from '@/app/page'; // Assuming type definition in page.tsx or a shared types file
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from '@/lib/utils';

interface ComplaintCardProps {
  complaint: Complaint;
  index: number;
}

export default function ComplaintCard({ complaint, index }: ComplaintCardProps) {
  const dataFields = [
    { label: "Name", value: complaint.name },
    { label: "Department", value: complaint['dept '] }, // Accessing with bracket notation due to space
    { label: "Block", value: complaint.block },
    { label: "Room No.", value: complaint['room-no'] }, // Accessing with bracket notation due to hyphen
  ];

  return (
    <Card
      className="w-full opacity-0 animate-fadeIn mb-6 shadow-lg border-border"
      style={{ animationDelay: `${index * 150 + 100}ms` }} // Staggered animation
    >
      <CardHeader className="pb-4">
        <CardTitle className="font-playfair-display text-xl text-primary">
          Complaint Report
        </CardTitle>
        <CardDescription className="font-montserrat text-xs text-muted-foreground">
          Details for complaint ID: {complaint.id}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {dataFields.map((field, idx) => (
          <div key={field.label}>
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-muted-foreground">{field.label}</span>
              <span className="text-md font-semibold text-foreground text-right break-all">{String(field.value || 'N/A')}</span>
            </div>
            {idx < dataFields.length -1 && <Separator className="mt-2 bg-border/50" />}
          </div>
        ))}

        <div>
          <Separator className="my-3 bg-border" />
          <h3 className="font-playfair-display text-lg font-semibold text-accent mb-1">Issue Description</h3>
          <p className="text-sm text-foreground italic leading-relaxed font-montserrat">
            {complaint.issue || 'No issue description provided.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
