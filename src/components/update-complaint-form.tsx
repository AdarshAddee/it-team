
'use client';

import { useEffect, useState } from 'react'; // Import useState
import { useActionState } from 'react'; // Correct import from react
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardContent, CardFooter } from "@/components/ui/card";
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn for conditional styling

interface UpdateComplaintFormProps {
  complaintId: string;
  currentComment: string;
  currentStatus: string; // Expect 'pending' or 'completed' (lowercase)
  updateAction: (prevState: any, formData: FormData) => Promise<{ success: boolean; message: string }>;
}

function SubmitButton({ disabled }: { disabled?: boolean }) { // Accept disabled prop
  const { pending } = useFormStatus();
  const isButtonDisabled = pending || disabled;

  return (
    <Button 
      type="submit" 
      className={cn(
        "w-full sm:w-auto",
        isButtonDisabled && "bg-primary/50 hover:bg-primary/50 cursor-not-allowed" // Lighter blue when inactive
      )} 
      disabled={isButtonDisabled}
    >
      <Send className="mr-2 h-4 w-4" /> {pending ? 'Submitting...' : 'Submit Update'}
    </Button>
  );
}

export default function UpdateComplaintForm({
  complaintId,
  currentComment, // This is the initial comment from DB
  currentStatus,  // This is the initial status from DB (e.g., 'pending' or 'completed')
  updateAction,
}: UpdateComplaintFormProps) {
  const { toast } = useToast();
  const initialState = { success: false, message: '' };
  const [state, formAction] = useActionState(updateAction, initialState);

  // State to track form inputs
  const [formComment, setFormComment] = useState(currentComment);
  const [formStatus, setFormStatus] = useState(currentStatus.toLowerCase());

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast({
          title: 'Success!',
          description: state.message,
          variant: 'default',
          duration: 2000, 
        });
      } else {
          toast({
              title: 'Error',
              description: state.message,
              variant: 'destructive',
              duration: 5000, 
          });
      }
    }
  }, [state, toast]);

  // Determine if form values have changed from initial props
  const hasCommentChanged = formComment.trim().toLowerCase() !== currentComment.trim().toLowerCase();
  const hasStatusChanged = formStatus.toLowerCase() !== currentStatus.toLowerCase();
  const isUnchanged = !hasCommentChanged && !hasStatusChanged;

  return (
    <form action={formAction}>
      <CardContent className="space-y-6">
        <input type="hidden" name="complaintId" value={complaintId} />
        
        <div className="space-y-2">
          <Label htmlFor="comment" className="font-medium">Comment (Optional)</Label>
          <Textarea
            id="comment"
            name="comment"
            placeholder="Add any relevant comments or notes here..."
            rows={4}
            value={formComment} // Controlled component
            onChange={(e) => setFormComment(e.target.value)}
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="font-medium">Status</Label>
          <Select 
            name="status" 
            value={formStatus} // Controlled component
            onValueChange={(value) => setFormStatus(value)}
            required
          >
            <SelectTrigger id="status" className="w-full text-sm">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <SubmitButton disabled={isUnchanged} /> 
      </CardFooter>
    </form>
  );
}

    