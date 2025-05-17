import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DataItemProps {
  label: string;
  value: string;
  index: number;
  isLargeText?: boolean;
}

const DataItem: React.FC<DataItemProps> = ({ label, value, index, isLargeText = false }) => (
  <div
    className="opacity-0 animate-fadeIn mb-4"
    style={{ animationDelay: `${index * 150}ms` }}
  >
    <p className={cn("text-sm font-medium text-muted-foreground", isLargeText && "mb-1")}>{label}</p>
    <p className={cn("text-lg font-semibold text-foreground", isLargeText && "text-base italic leading-relaxed")}>{value}</p>
  </div>
);


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
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary">
      <div
        className="w-full max-w-lg p-8 md:p-10 rounded-2xl shadow-2xl
                   bg-[hsla(0,0%,100%,0.5)] dark:bg-[hsla(var(--primary-hsl),0.1)]
                   backdrop-blur-xl border border-[hsla(0,0%,100%,0.2)] dark:border-[hsla(var(--primary-hsl),0.2)]
                   shadow-primary/10 dark:shadow-primary/20"
      >
        <div className="opacity-0 animate-fadeIn">
          <h1 className="font-playfair-display text-4xl font-bold text-primary mb-2 text-center">
            LuxeData
          </h1>
          <p className="text-center text-muted-foreground mb-8 font-lora text-md">
            User Information & Issue Report
          </p>
        </div>
        
        <div className="space-y-6">
          {dataFields.map((field, index) => (
            <div key={field.label} 
                 className="opacity-0 animate-fadeIn"
                 style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-muted-foreground">{field.label}</span>
                <span className="text-lg font-semibold text-foreground text-right">{field.value}</span>
              </div>
              {index < dataFields.length -1 && <Separator className="mt-3 bg-primary/20" />}
            </div>
          ))}

          <div 
            className="opacity-0 animate-fadeIn pt-4"
            style={{ animationDelay: `${(dataFields.length + 1) * 100}ms` }}
          >
            <Separator className="mb-6 bg-primary/30" />
            <h2 className="font-playfair-display text-xl font-semibold text-accent mb-2">Issue Description</h2>
            <p className="text-base text-foreground italic leading-relaxed font-lora">
              {userData.issue}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
