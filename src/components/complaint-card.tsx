
'use client';

import type { Complaint } from '@/app/page';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { User, Building, Hash, Home, MessageSquareWarning, CalendarDays, Edit3 } from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  index: number;
}

const formatDisplayValue = (
  originalValue: string | number | undefined | null,
  fieldType: 'name' | 'department' | 'block' | 'room-no' | 'issue'
): string => {
  const value = String(originalValue || '').trim();

  if (value === '') {
    return fieldType === 'issue' ? 'No issue description provided.' : 'N/A';
  }

  switch (fieldType) {
    case 'name':
      return value
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    case 'department':
    case 'block':
    case 'room-no':
      return value.toUpperCase();
    case 'issue':
      return value.charAt(0).toUpperCase() + value.slice(1);
    default:
      return value;
  }
};


export default function ComplaintCard({ complaint, index }: ComplaintCardProps) {
  let displayDate = complaint.date;
  if (complaint.date && !isNaN(new Date(complaint.date).getTime())) {
    if (complaint.date.length === 4 && /^\d{4}$/.test(complaint.date)) {
        displayDate = complaint.date; 
    } else {
        try {
            const dateObj = new Date(complaint.date);
            if (!isNaN(dateObj.valueOf())) { 
                 displayDate = dateObj.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            }
        } catch (e) {
            // Keep original if parsing fails
        }
    }
  } else if (complaint.date === 'N/A' || !complaint.date) {
    displayDate = 'N/A';
  }

  const statusVariant = complaint.status === 'Completed' ? 'default' : 'secondary';

  return (
    <Link href={`/complaint/${complaint.id}`} passHref>
      <Card
        className={cn(
          "w-full opacity-0 animate-fadeIn mb-8 shadow-xl border border-border/30 rounded-lg bg-card overflow-hidden cursor-pointer",
          "transition-all duration-300 ease-out hover:shadow-2xl hover:border-primary/30 group"
        )}
        style={{ animationDelay: `${index * 150 + 200}ms` }}
      >
        <CardHeader className="p-6 bg-gradient-to-br from-card to-muted/10 border-b border-border/30 relative">
          <CardTitle className="text-2xl font-bold text-primary flex items-center">
            <MessageSquareWarning className="w-7 h-7 mr-3 text-accent" />
            Complaint Details
          </CardTitle>
          <div className="ml-[calc(28px+0.75rem)]">
            <CardDescription className="text-xs text-muted-foreground pt-1">
              Report ID: {complaint.id}
            </CardDescription>
            <p className="text-xs text-muted-foreground pt-0.5 flex items-center">
              <CalendarDays className="w-3 h-3 mr-1.5 text-muted-foreground/80" /> 
              Date: {displayDate}
            </p>
          </div>
          <div className="absolute top-4 right-4 flex items-center space-x-2">
             {complaint.status && (
                <Badge variant={statusVariant} className="text-xs">
                    {complaint.status}
                </Badge>
             )}
            <Edit3 className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1 flex items-start">
              <User className="w-4 h-4 text-primary mr-2.5 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
                  Name
                </p>
                <p className="text-md font-normal text-foreground break-words">
                  {formatDisplayValue(complaint.name, 'name')}
                </p>
              </div>
            </div>

            <div className="space-y-1 flex items-start">
              <Building className="w-4 h-4 text-primary mr-2.5 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
                  Department
                </p>
                <p className="text-md font-normal text-foreground break-words">
                  {formatDisplayValue(complaint.dept, 'department')}
                </p>
              </div>
            </div>

            <div className="space-y-1 flex items-start">
              <Hash className="w-4 h-4 text-primary mr-2.5 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
                  Block
                </p>
                <p className="text-md font-normal text-foreground break-words">
                  {formatDisplayValue(complaint.block, 'block')}
                </p>
              </div>
            </div>
            
            <div className="space-y-1 flex items-start">
              <Home className="w-4 h-4 text-primary mr-2.5 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
                  Room No.
                </p>
                <p className="text-md font-normal text-foreground break-words">
                  {formatDisplayValue(complaint['room-no'], 'room-no')}
                </p>
              </div>
            </div>
          </div>
          
          <Separator className="my-4 bg-border/50" />
          
          <div>
            <h3 className="text-lg font-semibold text-accent mb-2 tracking-tight flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-accent"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.72l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Issue Reported
            </h3>
            <div className="bg-muted/20 p-4 rounded-md shadow-inner border border-border/20">
              <p className="text-md text-foreground/90 leading-relaxed font-normal">
                {formatDisplayValue(complaint.complaints, 'issue')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
