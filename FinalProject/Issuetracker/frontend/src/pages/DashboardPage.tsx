import { Card, CardHeader, CardContent } from "../components/ui/card";

export function DashboardPage() {
  const users = ["DeSean Brown", "Paul Smith", "Mickey Mouse", "Donald Duck"];
  
  const bugs = [
    "It's broken, please fix.",
    "Crash on startup.",
    "I'm not even sure what happened here is the error code 404 ...",
    "Doesn't support wide screen monitors.",
    "Text is too small on my 4K monitor.",
    "Doesn't work on my iPhone 3."
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="font-bold bg-muted">Users</CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {users.map((user, idx) => (
              <li key={idx} className="px-6 py-3">{user}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="font-bold bg-muted">Bugs</CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {bugs.map((bug, idx) => (
              <li key={idx} className="px-6 py-3">
                <a href="#" className="text-primary hover:underline">{bug}</a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;