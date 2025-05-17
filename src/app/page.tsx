
import { get, ref, query, orderByKey } from 'firebase/database';
import { database } from '@/lib/firebase';
import ComplaintCard from '@/components/complaint-card';
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Define the Complaint type
export interface Complaint {
  id: string;
  name: string;
  dept: string;
  block: string;
  'room-no': string;
  complaints: string; // Was 'issue', now 'complaints' from DB
  date: string;
  status?: string; 
  comment?: string; 
}

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
        dept: data[key].dept || 'Unknown Department', // Corrected from 'dept '
        block: data[key].block || 'Unknown Block',
        'room-no': data[key]['room-no'] || 'Unknown Room',
        complaints: data[key].complaints || 'No issue described', // Corrected from 'issue'
        date: data[key].date || 'N/A',
        status: data[key].status ? String(data[key].status).toLowerCase() : 'pending', // Ensure lowercase, default to pending
        comment: data[key].comment || '', 
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
  const complaints = await getComplaints();

  return (
    <main className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 md:p-8 bg-background selection:bg-primary/20">
      <div 
        className="w-full max-w-md sm:max-w-lg md:max-w-2xl opacity-0 animate-fadeIn mb-10"
        style={{ animationDelay: `50ms` }} 
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-3 text-center font-poppins">
          GNA Complaints
        </h1>
        <p className="text-center text-muted-foreground mb-8 text-lg font-poppins">
          Recent Issue Reports
        </p>
        <Separator className="bg-border/70" />
      </div>

      {complaints.length === 0 ? (
        <div 
          className="w-full max-w-md sm:max-w-lg md:max-w-2xl p-8 md:p-10 rounded-xl shadow-lg bg-card border-border opacity-0 animate-fadeIn text-center"
          style={{ animationDelay: `200ms` }}
        >
          <p className="text-muted-foreground text-lg font-poppins">No complaints to display at the moment.</p>
        </div>
      ) : (
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl">
          {complaints.map((complaint, index) => (
            <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
          ))}
        </div>
      )}
    </main>
  );
}
