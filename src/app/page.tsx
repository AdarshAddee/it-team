
import { get, ref, query, orderByKey } from 'firebase/database';
import { database } from '@/lib/firebase';
import RealtimeComplaintsDisplay from '@/components/realtime-complaints-display';
import { Separator } from "@/components/ui/separator";

// Define the Complaint type
export interface Complaint {
  id: string;
  name: string;
  dept: string;
  block: string;
  'room-no': string;
  complaints: string; // Changed from 'issue'
  date: string;
  status?: string;
  comment?: string;
  'date-solved'?: string; // Changed from date_resolved
}

// Function to fetch the starting serial number
async function getStartingSerialNo(): Promise<number> {
  const counterRef = ref(database, 'counters/gnaComplaintsSrNo');
  try {
    const snapshot = await get(counterRef);
    if (snapshot.exists()) {
      const val = snapshot.val();
      const srNo = parseInt(val);
      return isNaN(srNo) ? 1 : srNo;
    } else {
      console.log("gnaComplaintsSrNo not found in counters, defaulting to 1.");
      return 1;
    }
  } catch (error) {
    console.error("Error fetching gnaComplaintsSrNo from Firebase:", error);
    return 1; // Default to 1 in case of error
  }
}

// This function will still be used for the initial server-side fetch
async function getComplaints(): Promise<Complaint[]> {
  const complaintsRef = ref(database, 'gna-complaints');
  const complaintsQuery = query(complaintsRef, orderByKey());

  try {
    const snapshot = await get(complaintsQuery);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const complaintsArray: Complaint[] = Object.keys(data).map(key => ({
        id: key,
        name: data[key].name || 'Unknown Name',
        dept: data[key].dept || 'Unknown Department', // Corrected: no space after dept
        block: data[key].block || 'Unknown Block',
        'room-no': data[key]['room-no'] || 'Unknown Room',
        complaints: data[key].complaints || 'No issue described', // Corrected: 'complaints' instead of 'issue'
        date: data[key].date || 'N/A',
        status: data[key].status ? String(data[key].status).toLowerCase() : 'pending', // Default to 'pending' and ensure lowercase
        comment: data[key].comment || '',
        'date-solved': data[key]['date-solved'] || '', // Fetch 'date-solved'
      }));
      return complaintsArray.reverse();
    } else {
      console.log("No complaints found in Firebase.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching complaints from Firebase:", error);
    return [];
  }
}

export default async function LuxeDataComplaintsPage() {
  const initialComplaints = await getComplaints();
  const startingSrNo = await getStartingSerialNo();

  return (
    <main className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 md:p-8 bg-background selection:bg-primary/20 font-poppins">
      <div
        className="w-full max-w-md sm:max-w-lg md:max-w-2xl opacity-0 animate-fadeIn mb-10"
        style={{ animationDelay: `50ms` }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-3 text-center">
          GNA Complaints
        </h1>
        <p className="text-center text-muted-foreground mb-8 text-lg">
          Recent Issue Reports
        </p>
        <Separator className="bg-border/70" />
      </div>

      {/* Use the new client component to display complaints */}
      <RealtimeComplaintsDisplay initialComplaints={initialComplaints} startingSrNo={startingSrNo} />
    </main>
  );
}
