
import { get, ref, query, orderByKey } from 'firebase/database';
import { database } from '@/lib/firebase';
import ComplaintCard from '@/components/complaint-card';
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Define the Complaint type
export interface Complaint {
  id: string;
  name: string;
  dept: string; // Changed from 'dept ' to 'dept'
  block: string;
  'room-no': string;
  complaints: string; // Changed from 'issue' to 'complaints'
}

async function getComplaints(): Promise<Complaint[]> {
  const complaintsRef = ref(database, 'gna-complaints');
  // Order by key (Firebase push IDs are chronological)
  const complaintsQuery = query(complaintsRef, orderByKey());

  try {
    const snapshot = await get(complaintsQuery);
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Convert object to array and add id, ensure all fields are mapped
      const complaintsArray: Complaint[] = Object.keys(data).map(key => ({
        id: key,
        name: data[key].name || 'Unknown Name',
        dept: data[key].dept || 'Unknown Department', // Updated to use 'dept'
        block: data[key].block || 'Unknown Block',
        'room-no': data[key]['room-no'] || 'Unknown Room',
        complaints: data[key].complaints || 'No issue described', // Updated to use 'complaints'
      }));
      return complaintsArray.reverse(); // Reverse for descending order (newest first)
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
        className="w-full max-w-md sm:max-w-lg md:max-w-2xl opacity-0 animate-fadeIn mb-10" // Increased mb
        style={{ animationDelay: `50ms` }} 
      >
        <h1 className="font-playfair-display text-4xl sm:text-5xl font-bold text-primary mb-3 text-center">
          GNA Complaints
        </h1>
        <p className="text-center text-muted-foreground mb-8 font-montserrat text-lg">
          Recent Issue Reports
        </p>
        <Separator className="bg-border/70" />
      </div>

      {complaints.length === 0 ? (
        <div 
          className="w-full max-w-md sm:max-w-lg md:max-w-2xl p-8 md:p-10 rounded-xl shadow-lg bg-card border-border opacity-0 animate-fadeIn text-center"
          style={{ animationDelay: `200ms` }}
        >
          <p className="text-muted-foreground font-montserrat text-lg">No complaints to display at the moment.</p>
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
