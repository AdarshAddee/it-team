
'use client';

import type { Complaint } from '@/app/page'; // Import the Complaint type
import { useState, useEffect } from 'react';
import { ref, onValue, off, query, orderByKey } from 'firebase/database';
import { database } from '@/lib/firebase';
import ComplaintCard from '@/components/complaint-card';

interface RealtimeComplaintsDisplayProps {
  initialComplaints: Complaint[];
}

export default function RealtimeComplaintsDisplay({ initialComplaints }: RealtimeComplaintsDisplayProps) {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);

  useEffect(() => {
    const complaintsRef = ref(database, 'gna-complaints');
    // We can use query(complaintsRef, orderByKey()) with onValue as well
    // to ensure Firebase sends data in a somewhat ordered way,
    // though we'll still reverse on the client for descending.
    const complaintsQuery = query(complaintsRef, orderByKey());

    const listener = onValue(complaintsQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const complaintsArray: Complaint[] = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name || 'Unknown Name',
          dept: data[key].dept || 'Unknown Department',
          block: data[key].block || 'Unknown Block',
          'room-no': data[key]['room-no'] || 'Unknown Room',
          complaints: data[key].complaints || 'No issue described',
          date: data[key].date || 'N/A',
          status: data[key].status ? String(data[key].status).toLowerCase() : 'pending',
          comment: data[key].comment || '',
          'date-solved': data[key]['date-solved'] || '',
        }));
        setComplaints(complaintsArray.reverse());
      } else {
        console.log("No complaints found in Firebase (real-time).");
        setComplaints([]);
      }
    }, (error) => {
      console.error("Error listening to Firebase complaints:", error);
      // Optionally, set complaints to initial or an error state
    });

    // Cleanup listener on component unmount
    return () => {
      off(complaintsQuery, 'value', listener);
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return (
    <>
      {complaints.length === 0 ? (
        <div
          className="w-full max-w-md sm:max-w-lg md:max-w-2xl p-8 md:p-10 rounded-xl shadow-lg bg-card border-border opacity-0 animate-fadeIn text-center"
          style={{ animationDelay: `200ms` }}
        >
          <p className="text-muted-foreground text-lg">No complaints to display at the moment.</p>
        </div>
      ) : (
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl">
          {complaints.map((complaint, index) => (
            <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
          ))}
        </div>
      )}
    </>
  );
}
