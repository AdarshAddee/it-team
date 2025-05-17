
'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardContent, CardFooter } from "@/components/ui/card";
import { Send } from 'lucide-react';

interface UpdateComplaintFormProps {
  complaintId: string;
  currentComment: string;
  currentStatus: string; // Expect 'Pending' or 'Completed'
  updateAction: (prevState: any, formData: FormData) => Promise<{ success: boolean; message: string }>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      <Send className="mr-2 h-4 w-4" /> {pending ? 'Submitting...' : 'Submit Update'}
    </Button>
  );
}

export default function UpdateComplaintForm({
  complaintId,
  currentComment,
  currentStatus,
  updateAction,
}: UpdateComplaintFormProps) {
  const { toast } = useToast();
  const initialState = { success: false, message: '' };
  const [state, formAction] = useFormState(updateAction, initialState);

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Success!',
        description: state.message,
        variant: 'default', 
      });
    } else if (state?.message && !state.success) {
        toast({
            title: 'Error',
            description: state.message,
            variant: 'destructive',
        });
    }
  }, [state, toast]);

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
            defaultValue={currentComment}
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="font-medium">Status</Label>
          <Select name="status" defaultValue={currentStatus} required>
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
        <SubmitButton />
      </CardFooter>
    </form>
  );
}
