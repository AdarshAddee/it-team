
'use client';

import type { Complaint } from '@/app/page';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { User, Building, Hash, Home, MessageSquareWarning, CalendarDays, Edit3, ShieldCheck } from 'lucide-react'; // Added ShieldCheck for Serial No
import { useState, useEffect } from 'react';

interface ComplaintCardProps {
  complaint: Complaint;
  index: number;
  displaySerialNo: number; // New prop for display serial number
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
      if (value.length > 0) {
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
      return value;
    default:
      return value;
  }
};


export default function ComplaintCard({ complaint, index, displaySerialNo }: ComplaintCardProps) {
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialRender(false);
    }, 0); 
    return () => clearTimeout(timer);
  }, []);


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

  const statusVariant = complaint.status === 'completed' ? 'default' : 'secondary';
  const statusText = complaint.status === 'completed' ? 'Completed' : 'Pending';


  return (
    <Link href={`/complaint/${complaint.id}`} passHref>
      <Card
        className={cn(
          "w-full mb-8 shadow-xl rounded-lg overflow-hidden cursor-pointer group",
          "transition-all duration-300 ease-out",
          complaint.status === 'pending' 
            ? 'bg-yellow-100 border-yellow-300 hover:shadow-2xl hover:border-yellow-400' 
            : 'bg-card border-border/30 hover:shadow-2xl hover:border-primary/30',
          isInitialRender && "opacity-0 animate-fadeIn"
        )}
        style={isInitialRender ? { animationDelay: `${index * 150 + 200}ms` } : {}}
      >
        <CardHeader className={cn(
            "p-6 border-b relative",
            complaint.status === 'pending' 
                ? 'bg-gradient-to-br from-yellow-100 to-yellow-50/50 border-yellow-300/70'
                : 'bg-gradient-to-br from-card to-muted/10 border-border/30'
            )}
        >
          <CardTitle className="text-2xl font-bold text-primary flex items-center font-poppins">
            <MessageSquareWarning className="w-7 h-7 mr-3 text-accent" />
            Complaint Details
          </CardTitle>
          <div className="ml-[calc(28px+0.75rem)]">
            <p className="text-xs text-muted-foreground pt-0.5 flex items-center font-poppins">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-muted-foreground/80" />
              Serial No: {displaySerialNo}
            </p>
            <CardDescription className="text-xs text-muted-foreground pt-0.5 font-poppins">
              Report ID: {complaint.id}
            </CardDescription>
            <p className="text-xs text-muted-foreground pt-0.5 flex items-center font-poppins">
              <CalendarDays className="w-3 h-3 mr-1.5 text-muted-foreground/80" /> 
              Date: {displayDate}
            </p>
          </div>
          <div className="absolute top-4 right-4 flex items-center space-x-2">
             {complaint.status && (
                <Badge 
                    variant={statusVariant} 
                    className={cn(
                        "text-xs font-poppins",
                        complaint.status === 'pending' && 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
                    )}
                >
                    {statusText}
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
                <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground font-poppins">
                  Name
                </p>
                <p className="text-md font-normal text-foreground break-words font-poppins">
                  {formatDisplayValue(complaint.name, 'name')}
                </p>
              </div>
            </div>

            <div className="space-y-1 flex items-start">
              <Building className="w-4 h-4 text-primary mr-2.5 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground font-poppins">
                  Department
                </p>
                <p className="text-md font-normal text-foreground break-words font-poppins">
                  {formatDisplayValue(complaint.dept, 'department')}
                </p>
              </div>
            </div>

            <div className="space-y-1 flex items-start">
              <Hash className="w-4 h-4 text-primary mr-2.5 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground font-poppins">
                  Block
                </p>
                <p className="text-md font-normal text-foreground break-words font-poppins">
                  {formatDisplayValue(complaint.block, 'block')}
                </p>
              </div>
            </div>
            
            <div className="space-y-1 flex items-start">
              <Home className="w-4 h-4 text-primary mr-2.5 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground font-poppins">
                  Room No.
                </p>
                <p className="text-md font-normal text-foreground break-words font-poppins">
                  {formatDisplayValue(complaint['room-no'], 'room-no')}
                </p>
              </div>
            </div>
          </div>
          
          <Separator className={cn(
              "my-4",
              complaint.status === 'pending' ? 'bg-yellow-300/80' : 'bg-border/50'
            )} 
          />
          
          <div>
            <h3 className="text-lg font-semibold text-accent mb-2 tracking-tight flex items-center font-poppins">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-accent"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.72l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Issue Reported
            </h3>
            <div className={cn(
                "p-4 rounded-md shadow-inner",
                complaint.status === 'pending' 
                    ? 'bg-yellow-50/70 border border-yellow-200/90'
                    : 'bg-muted/20 border border-border/20'
                )}
            >
              <p className="text-md text-foreground/90 leading-relaxed font-normal font-poppins">
                {formatDisplayValue(complaint.complaints, 'issue')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
