
'use server';

import type { Complaint as BaseComplaint } from '@/app/page'; // Use BaseComplaint to avoid conflict
import { get, ref, update } from 'firebase/database';
import { database } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import UpdateComplaintForm from '@/components/update-complaint-form';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, User, Building, Hash, Home, MessageSquareWarning, Edit, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Extend BaseComplaint for this page if needed, or use it directly
export interface Complaint extends BaseComplaint {
  // date_resolved is already in BaseComplaint if updated there
}

async function getComplaintDetails(id: string): Promise<Complaint | null> {
  const complaintRef = ref(database, `gna-complaints/${id}`);
  try {
    const snapshot = await get(complaintRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return {
        id: snapshot.key as string,
        name: data.name || 'Unknown Name',
        dept: data.dept || 'Unknown Department',
        block: data.block || 'Unknown Block',
        'room-no': data['room-no'] || 'Unknown Room',
        complaints: data.complaints || 'No issue described',
        date: data.date || 'N/A',
        status: data.status ? String(data.status).toLowerCase() : 'pending',
        comment: data.comment || '',
        date_resolved: data.date_resolved || '', // Fetch date_resolved
      };
    } else {
      console.log(`No complaint found with ID: ${id}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching complaint ${id} from Firebase:`, error);
    return null;
  }
}

export async function updateComplaintAction(prevState: any, formData: FormData) {
  'use server';
  const complaintId = formData.get('complaintId') as string;
  let status = formData.get('status') as string;
  let comment = formData.get('comment') as string;

  if (!complaintId || !status) {
    return { success: false, message: 'Complaint ID and Status are required.' };
  }

  // Convert to lowercase before saving
  status = status.toLowerCase();
  if (comment !== null && comment !== undefined) {
    comment = comment.trim() === '' ? '' : comment.toLowerCase(); // store empty string if only spaces, else lowercase
  } else {
    comment = ''; // ensure comment is at least an empty string if null/undefined initially
  }


  const complaintRef = ref(database, `gna-complaints/${complaintId}`);
  const updates: Partial<Complaint> & { [key: string]: any } = { status }; // Use any for dynamic keys like date_resolved

  if (comment) { // only add comment to updates if it has content
    updates.comment = comment;
  } else {
    // If comment is empty, we might want to remove it or set it to empty string
    // For RTDB, setting to null removes the field. Setting to empty string stores an empty string.
    // Let's store an empty string to signify an explicitly emptied comment.
    updates.comment = '';
  }

  if (status === 'completed') {
    updates.date_resolved = new Date().toISOString();
  }
  // If status changes from 'completed' to 'pending', date_resolved is not automatically cleared here.
  // This can be added if required:
  // else { updates.date_resolved = null; } // This would remove the field if status is not 'completed'

  try {
    await update(complaintRef, updates);
    revalidatePath('/complaint/[id]', 'page'); 
    revalidatePath('/', 'page'); 
    return { success: true, message: 'Complaint updated successfully!' };
  } catch (error) {
    console.error('Error updating complaint:', error);
    return { success: false, message: 'Failed to update complaint. Please try again.' };
  }
}

const formatDisplayValue = (
  originalValue: string | number | undefined | null,
  fieldType: 'name' | 'department' | 'block' | 'room-no' | 'issue' | 'comment'
): string => {
  const value = String(originalValue || '').trim();
  if (value === '') {
    return fieldType === 'issue' ? 'No issue description provided.' : 
           fieldType === 'comment' ? 'No comments added yet.' : 'N/A';
  }
  switch (fieldType) {
    case 'name':
      return value.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    case 'department':
    case 'block':
    case 'room-no':
      return value.toUpperCase();
    case 'issue':
    case 'comment':
      if (value.length > 0) {
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
      return value;
    default:
      return value;
  }
};

export default async function ComplaintUpdatePage({ params }: { params: { id: string } }) {
  const complaint = await getComplaintDetails(params.id);

  if (!complaint) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background font-poppins">
        <Card className="w-full max-w-md p-8 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-destructive mb-2">Complaint Not Found</h1>
          <p className="text-muted-foreground mb-6">The complaint you are looking for does not exist or could not be loaded.</p>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Complaints
            </Link>
          </Button>
        </Card>
      </main>
    );
  }
  
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
        } catch (e) {/* Keep original if parsing fails */}
    }
  } else if (complaint.date === 'N/A' || !complaint.date) {
    displayDate = 'N/A';
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 md:p-8 bg-background selection:bg-primary/20 font-poppins">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm" className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Complaints
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-primary">Manage Complaint</h1>
          <p className="text-muted-foreground">Update status and add comments for Report ID: {complaint.id}</p>
        </div>

        <Card className="mb-8 shadow-lg border border-border/30 rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary flex items-center">
              <Edit className="w-6 h-6 mr-2.5 text-accent" />
              Update Status & Add Comment
            </CardTitle>
          </CardHeader>
          <UpdateComplaintForm
            complaintId={complaint.id}
            currentComment={complaint.comment || ''}
            currentStatus={complaint.status || 'completed'} 
            updateAction={updateComplaintAction}
          />
        </Card>
        
        <Card className="mb-8 shadow-lg border border-border/30 rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary flex items-center">
              <MessageSquareWarning className="w-6 h-6 mr-2.5 text-accent" />
              Current Complaint Details
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground pt-1 ml-[calc(24px+0.625rem)]">
              Report ID: {complaint.id} | Date Reported: {displayDate}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex items-start">
                <User className="w-4 h-4 text-primary mr-2 mt-1 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Name</p>
                  <p className="text-md font-normal text-foreground">{formatDisplayValue(complaint.name, 'name')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Building className="w-4 h-4 text-primary mr-2 mt-1 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Department</p>
                  <p className="text-md font-normal text-foreground">{formatDisplayValue(complaint.dept, 'department')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Hash className="w-4 h-4 text-primary mr-2 mt-1 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Block</p>
                  <p className="text-md font-normal text-foreground">{formatDisplayValue(complaint.block, 'block')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Home className="w-4 h-4 text-primary mr-2 mt-1 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Room No.</p>
                  <p className="text-md font-normal text-foreground">{formatDisplayValue(complaint['room-no'], 'room-no')}</p>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-md font-semibold text-accent mb-1.5 flex items-center">
                 <FileText className="w-4 h-4 mr-2 text-accent shrink-0" /> {/* Changed icon */}
                Issue Reported
              </h3>
              <p className="text-sm text-foreground/90 bg-muted/20 p-3 rounded-md border border-border/20">
                {formatDisplayValue(complaint.complaints, 'issue')}
              </p>
            </div>
             {complaint.comment && complaint.comment.trim() !== '' && ( // Check if comment exists and is not just whitespace
                <div>
                    <h3 className="text-md font-semibold text-accent mb-1.5 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-accent shrink-0" /> {/* Changed icon */}
                        Previous Comment
                    </h3>
                    <p className="text-sm text-foreground/90 bg-muted/20 p-3 rounded-md border border-border/20">
                        {formatDisplayValue(complaint.comment, 'comment')}
                    </p>
                </div>
            )}
          </CardContent>
        </Card>

      </div>
    </main>
  );
}
