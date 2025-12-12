import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Bug, Users, AlertCircle, CheckCircle, ArrowRight, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardPage() {
  const { user } = useAuth();
  
  const users = ["DeSean Brown", "Paul Smith", "Mickey Mouse", "Donald Duck"];
  
  const bugs = [
    { title: "Login fails on Safari", priority: "High", status: "Open" },
    { title: "Crash on startup", priority: "Critical", status: "In Progress" },
    { title: "Search returns no results", priority: "Medium", status: "Open" },
    { title: "Text too small on 4K", priority: "Low", status: "Resolved" },
  ];

  const stats = [
    { label: "Total Bugs", value: "24", icon: Bug, iconBg: "bg-blue-500/10", iconColor: "text-blue-600" },
    { label: "Critical Issues", value: "3", icon: AlertCircle, iconBg: "bg-red-500/10", iconColor: "text-red-600" },
    { label: "In Progress", value: "8", icon: Clock, iconBg: "bg-yellow-500/10", iconColor: "text-yellow-600" },
    { label: "Resolved", value: "12", icon: CheckCircle, iconBg: "bg-green-500/10", iconColor: "text-green-600" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical": return "bg-red-100 text-red-700 border-red-200";
      case "high": return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open": return "bg-blue-100 text-blue-700";
      case "in progress": return "bg-yellow-100 text-yellow-700";
      case "resolved": return "bg-green-100 text-green-700";
      case "closed": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 lg:py-16 -mt-6 -mx-6 px-6 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.15),transparent_50%)]" />
        
        <div className="relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Track, Manage & Resolve Issues Seamlessly
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> </span> 
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              A powerful issue tracking system designed for modern development teams.
            </p>
            
            {user && (
              <div>
                <p className="text-lg">
                  Welcome back, <span className="font-semibold text-primary">{user.fullName || user.name || user.email}</span>!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Bugs Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Recent Bugs</h2>
            <p className="text-muted-foreground">Latest reported issues across all projects</p>
          </div>
          <Link to="/bugs">
            <Button variant="ghost" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bugs.map((bug, idx) => (
            <Card key={idx} className="hover:shadow-md transition-all hover:border-primary/50">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">{bug.title}</h3>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getPriorityColor(bug.priority)}`}>
                      {bug.priority}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(bug.status)}`}>
                      {bug.status}
                    </span>
                  </div>
                  <Link to="/bugs" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                    View Details
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Team Members</h2>
            <p className="text-muted-foreground">Your organization's active users</p>
          </div>
          <Link to="/users">
            <Button variant="ghost" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {users.map((user, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <Link to="/users" className="flex flex-col items-center text-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    {user[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user}</p>
                    <p className="text-sm text-muted-foreground">Team Member</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;