import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { transportAPI } from "../../../config/api";
import { demoRoutes } from "../../../utils/demoData";
import { isDemoMode } from "../../../utils/demoAuth";
import TransportLayout from "../layout/TransportLayout";

function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState("");

  const loadRoutes = async () => {
    try {
      setError("");
      
      // Use demo data in demo mode or if API fails
      if (isDemoMode()) {
        setRoutes(demoRoutes);
        return;
      }
      
      const response = await transportAPI.getRoutes();
      if (response?.success) {
        setRoutes(response.data || []);
      } else {
        // Fallback to demo data if API fails
        setRoutes(demoRoutes);
      }
    } catch (e) {
      console.log("API failed, using demo data:", e.message);
      // Use demo data as fallback
      setRoutes(demoRoutes);
      setError("Using demo data - " + (e?.message || "Failed to load routes"));
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleEdit = async (route) => {
    const routeName = window.prompt("Route name", route?.routeName || "");
    if (routeName === null) return;

    const startPoint = window.prompt("Start point", route?.startPoint || "");
    if (startPoint === null) return;

    const endPoint = window.prompt("End point", route?.endPoint || "");
    if (endPoint === null) return;

    const fee = window.prompt("Fee", String(route?.fee ?? "0"));
    if (fee === null) return;

    try {
      setError("");
      
      if (isDemoMode()) {
        // Update demo data locally
        setRoutes(prev => prev.map(r => 
          r.id === route.id 
            ? { ...r, routeName, startPoint, endPoint, fee: Number(fee) }
            : r
        ));
        return;
      }
      
      await transportAPI.updateRoute(route.id, {
        routeName,
        startPoint,
        endPoint,
        fee: Number(fee),
      });
      await loadRoutes();
    } catch (e) {
      setError(e?.message || "Failed to update route");
    }
  };

  const handleDelete = async (route) => {
    const ok = window.confirm(`Delete route "${route?.routeName}"?`);
    if (!ok) return;

    try {
      setError("");
      
      if (isDemoMode()) {
        // Remove from demo data locally
        setRoutes(prev => prev.filter(r => r.id !== route.id));
        return;
      }
      
      await transportAPI.deleteRoute(route.id);
      await loadRoutes();
    } catch (e) {
      setError(e?.message || "Failed to delete route");
    }
  };

  return (
    <TransportLayout title="Routes">
      <Card>
        <CardHeader>
          <CardTitle>Manage Routes</CardTitle>
          {isDemoMode() && (
            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              Demo Mode: Showing sample transport routes data
            </div>
          )}
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="mb-3 text-sm text-gray-600 dark:text-gray-300">{error}</div>
          ) : null}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3">Route Name</th>
                  <th className="px-4 py-3">Route Number</th>
                  <th className="px-4 py-3">Start Point</th>
                  <th className="px-4 py-3">End Point</th>
                  <th className="px-4 py-3">Stops</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 dark:divide-gray-900 dark:text-gray-200">
                {routes.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No routes found. Add some routes to get started.
                    </td>
                  </tr>
                ) : (
                  routes.map((route) => (
                    <tr key={route.id}>
                      <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100">{route.routeName}</td>
                      <td className="px-4 py-4">{route.routeNumber}</td>
                      <td className="px-4 py-4">{route.startPoint}</td>
                      <td className="px-4 py-4">{route.endPoint}</td>
                      <td className="px-4 py-4">{route?.stopsCount ?? "-"}</td>
                      <td className="px-4 py-4">₹{route.fee}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          route?.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {route?.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={() => handleEdit(route)}>
                            Edit
                          </Button>
                          <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(route)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </TransportLayout>
  );
}

export default RoutesPage;
