import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Music, 
  ShoppingCart, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  // In a real app, these would come from API calls
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTracks: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 154,
        totalTracks: 37,
        totalOrders: 28,
        totalRevenue: 3490
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      change: 12,
      trend: "up"
    },
    {
      title: "Featured Tracks",
      value: stats.totalTracks,
      icon: Music,
      change: 5,
      trend: "up"
    },
    {
      title: "Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      change: 8,
      trend: "up"
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: 14,
      trend: "up"
    }
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your platform's performance</p>
      </div>
      
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="h-8 w-8 rounded-md bg-beatforge-100 dark:bg-beatforge-900 flex items-center justify-center text-beatforge-500">
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs flex items-center text-muted-foreground pt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}%
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Recent activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "Michael Brown", item: "Mastering Service", date: "2 days ago", amount: "$200" },
                { user: "Sarah Johnson", item: "Lo-Fi Dreams", date: "3 days ago", amount: "$14.99" },
                { user: "David Wilson", item: "Mixing Service", date: "1 week ago", amount: "$500" },
                { user: "Emily Davis", item: "Future Bass", date: "1 week ago", amount: "$29.99" }
              ].map((order, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-sm font-medium">{order.user.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{order.user}</p>
                    <p className="text-xs text-muted-foreground">
                      Purchased {order.item} · {order.date}
                    </p>
                  </div>
                  <div className="text-sm font-medium">{order.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>New Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Alex Thompson", email: "alex@example.com", date: "Today" },
                { name: "Jessica Lee", email: "jessica@example.com", date: "Today" },
                { name: "Ryan Martinez", email: "ryan@example.com", date: "Yesterday" },
                { name: "Olivia Parker", email: "olivia@example.com", date: "Yesterday" }
              ].map((user, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email} · Joined {user.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 