import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function LuxeDataPage() {
  const userData = {
    name: "Eleanor Vance",
    department: "Arcane Studies",
    block: "Celestial Wing - VII",
    roomNo: "A-42",
    issue: "The Aetheric Resonator in the laboratory has developed an unscheduled sentience and is demanding philosophical debates at inopportune hours. This is significantly disrupting crucial research on chronomancy and temporal displacement fields.",
  };

  const dataFields = [
    { label: "Name", value: userData.name },
    { label: "Department", value: userData.department },
    { label: "Block", value: userData.block },
    { label: "Room No.", value: userData.roomNo },
  ];

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
      <div
        className="w-full max-w-md sm:max-w-lg p-6 md:p-8 rounded-xl shadow-lg
                   bg-card border border-border
                   opacity-0 animate-fadeIn"
        style={{ animationDelay: `100ms` }} // Base delay for the card itself
      >
        <div className="opacity-0 animate-fadeIn">
          <h1 className="font-playfair-display text-4xl font-bold text-primary mb-2 text-center">
            LuxeData
          </h1>
          <p className="text-center text-muted-foreground mb-8 font-montserrat text-md">
            User Information & Issue Report
          </p>
        </div>
        
        <div className="space-y-6">
          {dataFields.map((field, index) => (
            <div key={field.label} 
                 className="opacity-0 animate-fadeIn"
                 style={{ animationDelay: `${(index + 1) * 150 + 100}ms` }} // Staggered delay after card fades in
            >
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-muted-foreground">{field.label}</span>
                <span className="text-lg font-semibold text-foreground text-right">{field.value}</span>
              </div>
              {index < dataFields.length -1 && <Separator className="mt-3 bg-border" />}
            </div>
          ))}

          <div 
            className="opacity-0 animate-fadeIn pt-4"
            style={{ animationDelay: `${(dataFields.length + 1) * 150 + 100}ms` }} // Staggered delay
          >
            <Separator className="mb-6 bg-border" />
            <h2 className="font-playfair-display text-xl font-semibold text-accent mb-3">Issue Description</h2>
            <p className="text-base text-foreground italic leading-relaxed font-montserrat">
              {userData.issue}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
