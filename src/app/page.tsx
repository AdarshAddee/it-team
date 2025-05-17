
import { get, ref, query, orderByKey } from 'firebase/database';
import { database } from '@/lib/firebase';
import ComplaintCard from '@/components/complaint-card';
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Define the Complaint type
export interface Complaint {
  id: string;
  name: string;
  'dept ': string; // Key with a trailing space
  block: string;
  'room-no': string; // Key with a hyphen
  issue: string;
  // Add any other fields that might exist in your Firebase data
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
        'dept ': data[key]['dept '] || 'Unknown Department',
        block: data[key].block || 'Unknown Block',
        'room-no': data[key]['room-no'] || 'Unknown Room',
        issue: data[key].issue || 'No issue described',
      }));
      return complaintsArray.reverse(); // Reverse for descending order (newest first)
    } else {
      console.log("No complaints found in Firebase.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching complaints from Firebase:", error);
    // In a real app, you might want to throw the error or handle it more gracefully
    return []; // Return empty on error to prevent breaking the page
  }
}

export default async function LuxeDataComplaintsPage() {
  const complaints = await getComplaints();

  return (
    <main className="min-h-screen w-full flex flex-col items-center p-4 bg-background selection:bg-primary/20">
      <div 
        className="w-full max-w-md sm:max-w-lg opacity-0 animate-fadeIn mb-8"
        style={{ animationDelay: `50ms` }} // Initial animation for header
      >
        <h1 className="font-playfair-display text-4xl font-bold text-primary mb-2 text-center">
          GNA Complaints
        </h1>
        <p className="text-center text-muted-foreground mb-6 font-montserrat text-md">
          Recent Issue Reports
        </p>
        <Separator className="bg-border" />
      </div>

      {complaints.length === 0 ? (
        <div 
          className="w-full max-w-md sm:max-w-lg p-6 md:p-8 rounded-xl shadow-lg bg-card border-border opacity-0 animate-fadeIn text-center"
          style={{ animationDelay: `200ms` }}
        >
          <p className="text-muted-foreground font-montserrat">No complaints to display at the moment.</p>
        </div>
      ) : (
        <div className="w-full max-w-md sm:max-w-lg">
          {complaints.map((complaint, index) => (
            <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
          ))}
        </div>
      )}
    </main>
  );
}
