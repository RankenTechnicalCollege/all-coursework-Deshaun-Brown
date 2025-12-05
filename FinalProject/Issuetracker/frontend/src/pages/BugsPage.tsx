import { BugList } from "@/components/BugList";

export function BugsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Bug Tracker</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage software bugs
        </p>
      </div>
      <BugList />
    </div>
  );
}

export default BugsPage;