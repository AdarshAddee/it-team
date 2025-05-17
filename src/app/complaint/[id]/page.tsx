
'use server';

import type { Complaint } from '@/app/page';
import { get, ref, update } from 'firebase/database';
import { database } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, User, Building, Hash, Home, MessageSquareWarning, CalendarDays, Send, AlertCircle } from 'lucide-react';

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
        status: data.status || 'Pending',
        comment: data.comment || '',
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

async function updateComplaintAction(formData: FormData) {
  'use server';
  const complaintId = formData.get('complaintId') as string;
  const status = formData.get('status') as string;
  const comment = formData.get('comment') as string;

  if (!complaintId || !status) {
    return { success: false, message: 'Complaint ID and Status are required.' };
  }

  const complaintRef = ref(database, `gna-complaints/${complaintId}`);
  const updates: Partial<Complaint> = { status };
  if (comment !== null && comment !== undefined) { // Only update comment if provided
    updates.comment = comment;
  }

  try {
    await update(complaintRef, updates);
    revalidatePath('/complaint/[id]', 'page'); // Revalidate this specific complaint page
    revalidatePath('/', 'page'); // Revalidate the home page to update card status
    return { success: true, message: 'Complaint updated successfully!' };
  } catch (error) {
    console.error('Error updating complaint:', error);
    return { success: false, message: 'Failed to update complaint. Please try again.' };
  }
}

// Helper to format display values (copied from complaint-card for consistency, can be moved to utils)
const formatDisplayValue = (
  originalValue: string | number | undefined | null,
  fieldType: 'name' | 'department' | 'block' | 'room-no' | 'issue' | 'comment'
): string => {
  const value = String(originalValue || '').trim();
  if (value === '') {
    return fieldType === 'issue' ? 'No issue description provided.' : 
           fieldType === 'comment' ? 'No comments yet.' : 'N/A';
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
      return value.charAt(0).toUpperCase() + value.slice(1);
    default:
      return value;
  }
};

export default async function ComplaintUpdatePage({ params }: { params: { id: string } }) {
  const complaint = await getComplaintDetails(params.id);

  if (!complaint) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background">
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


  // Component to handle form submission and state for messages
  // This part needs to be a client component if we want instant feedback without full page reload
  // For now, Server Action will cause a page reload/revalidation
  // To show message from server action, we'd need a client component wrapper or pass it via searchParams

  return (
    <main className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 md:p-8 bg-background selection:bg-primary/20">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm" className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Complaints
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-primary">Update Complaint Status</h1>
          <p className="text-muted-foreground">Manage the status and add comments for Report ID: {complaint.id}</p>
        </div>

        <Card className="mb-8 shadow-lg border border-border/30 rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary flex items-center">
              <MessageSquareWarning className="w-6 h-6 mr-2.5 text-accent" />
              Current Complaint Details
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground pt-1 ml-[calc(24px+0.625rem)]">
              Report ID: {complaint.id} | Date: {displayDate}
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
              <h3 className="text-md font-semibold text-accent mb-1.5">Issue Reported</h3>
              <p className="text-sm text-foreground/90 bg-muted/20 p-3 rounded-md border border-border/20">
                {formatDisplayValue(complaint.complaints, 'issue')}
              </p>
            </div>
             {complaint.comment && (
                <div>
                    <h3 className="text-md font-semibold text-accent mb-1.5">Previous Comment</h3>
                    <p className="text-sm text-foreground/90 bg-muted/20 p-3 rounded-md border border-border/20">
                        {formatDisplayValue(complaint.comment, 'comment')}
                    </p>
                </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border border-border/30 rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Update Status & Add Comment</CardTitle>
          </CardHeader>
          <form action={updateComplaintAction}>
            <CardContent className="space-y-6">
              <input type="hidden" name="complaintId" value={complaint.id} />
              
              <div className="space-y-2">
                <Label htmlFor="comment" className="font-medium">Comment (Optional)</Label>
                <Textarea
                  id="comment"
                  name="comment"
                  placeholder="Add any relevant comments or notes here..."
                  rows={4}
                  defaultValue={complaint.comment || ''}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="font-medium">Status</Label>
                <Select name="status" defaultValue={complaint.status || 'Pending'} required>
                  <SelectTrigger id="status" className="w-full text-sm">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full sm:w-auto">
                <Send className="mr-2 h-4 w-4" /> Submit Update
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}

// Note: For instant feedback messages (like "Update successful!") without a full page reload after form submission,
// the form handling part would ideally be in a client component using `useFormState` and `useFormStatus` from 'react-dom'.
// The current server action will revalidate the page, reflecting changes after submission.
// To show the message from `updateComplaintAction`, one common pattern is to redirect with a query parameter
// (e.g., /complaint/[id]?message=success) and then display it. Or use a client component with useFormState.
