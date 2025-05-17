
'use client';

import type { Complaint } from '@/app/page';
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
    { label: "Department", value: complaint.dept }, // Updated to use 'dept'
    { label: "Block", value: complaint.block },
    { label: "Room No.", value: complaint['room-no'] },
  ];

  return (
    <Card
      className={cn(
        "w-full opacity-0 animate-fadeIn mb-8 shadow-xl border border-border/30 rounded-lg bg-card overflow-hidden",
        "transition-all duration-300 ease-out hover:shadow-2xl hover:border-primary/30"
      )}
      style={{ animationDelay: `${index * 150 + 200}ms` }}
    >
      <CardHeader className="p-6 bg-gradient-to-br from-card to-muted/20 border-b border-border/30">
        <CardTitle className="font-playfair-display text-2xl text-primary">
          Complaint Details
        </CardTitle>
        <CardDescription className="font-montserrat text-xs text-muted-foreground pt-1">
          Report ID: {complaint.id}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="font-playfair-display text-xl font-semibold text-accent mb-2 tracking-tight">
            Issue Reported
          </h3>
          <div className="bg-muted/30 p-4 rounded-md shadow-inner border border-border/20">
            <p className="text-md text-foreground/90 font-montserrat leading-relaxed italic">
              {complaint.complaints || 'No issue description provided.'} {/* Updated to use 'complaints' */}
            </p>
          </div>
        </div>
        
        <Separator className="my-6 bg-border/50" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {dataFields.map((field, idx) => (
            <div key={field.label} className="space-y-1">
              <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground font-montserrat">
                {field.label}
              </p>
              <p className="text-lg font-semibold text-foreground font-montserrat break-words">
                {String(field.value || 'N/A')}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
