import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Filter, Download, RefreshCw, CheckCircle, Clock, XCircle, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { read_from_db, sync_to_huawei } from "../utils/api";
import { record_datatype } from "../types";
import { toast } from "sonner";

export function records_page() {

  // Default value is true, so it will show loading screen first
  const [is_loading, loading] = useState(true);
  const [job_records, load_records] = useState<record_datatype[]>([]);

  // Load data from db when page load or refresh btn clicked
  const load_data = async () => {
    loading(true);

    try {
      const data = await read_from_db();
      load_records(data);
    }
    catch (error) {
      toast.error("Failed to load job records");
      console.error(error);
    }
    finally { loading(false); }
  };
  useEffect(() => { load_data(); }, []);


  const [search_keywords, setSearchQuery] = useState("");
  // Default value is "all", no filter applied first
  const [sync_status, setStatusFilter] = useState<string>("all");
  const [job_searched, filter_jobs] = useState<record_datatype[]>([]);
  // Start filter when user type keywords or select sync status
  useEffect(() => { 
    let job_details = [...job_records];

    if (search_keywords.trim()) {
      const keywords = search_keywords.toLowerCase();
      // Filter() return a list of data that match the condition
      job_details = job_details.filter(
        (job) =>
          job.jobNumber.toLowerCase().includes(keywords) ||
          job.siteLocation.toLowerCase().includes(keywords) ||
          job.contractorCompany.toLowerCase().includes(keywords) ||
          // Some() return true if at least one element match the condition
          job.personnelNames.some((name) => name.toLowerCase().includes(keywords))
      );
    }

    if (sync_status !== "all") {
      job_details = job_details.filter((job) => job.huaweiSyncStatus === sync_status);
    }

    // Sort by creation date (newest - oldest)
    job_details.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    filter_jobs(job_details); 
  }, [job_records, search_keywords, sync_status]);

  const navigate = useNavigate();


  const comma_saver = (field: string): string => {
    const str = String(field); // In case isnt a string

    // Use "" to cover the sentence
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;  // If have "" inside, give them another""
    }
    return str;
  };

  const export_csv = () => {
    const headers = ["Job Number", "Job Type", "Site Location", "Completion Date", "Personnel", "Company", "Sync Status"];
    const rows = job_searched.map(job => [
      job.jobNumber,
      job.jobType,
      job.siteLocation,
      `${job.completionDate} ${job.completionTime}`,
      job.personnelNames.join("; "),
      job.contractorCompany,
      job.huaweiSyncStatus
    ]);


    const csv = [headers, ...rows].map(row => row.map(comma_saver).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `job_records_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Job records exported");
  };


  const getSyncStatusBadge = (status: record_datatype["huaweiSyncStatus"]) => {
    switch (status) {
      case "synced":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Synced
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
    }
  };


  const [syncingJobId, setSyncingJobId] = useState<string | null>(null);
  const demo_sync = async (jobId: string) => {
    setSyncingJobId(jobId);
    try {
      const result = await sync_to_huawei(jobId);

      if (result.success) {
        toast.success("Job synced to Huawei ISC system");
        // Update local state
        load_records(job_records.map(job => 
          job.id === jobId 
            ? { ...job, huaweiSyncStatus: "synced" as const, huaweiSyncDate: new Date().toISOString() }
            : job
        ));
      }
    }
    catch (error) {
      toast.error("Failed to sync job to Huawei");
      console.error(error);
    }
    finally { setSyncingJobId(null); }
  };


  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Job Records</h2>
          <p className="text-gray-600 mt-1">View and manage completed jobs</p>
        </div>
        <Button onClick={() => navigate("/")}>
          Submit New Job
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by job number, location, company, or personnel..."
                  value={search_keywords}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Select value={sync_status} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="synced">Synced</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {job_searched.length} of {job_records.length} records
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={load_data}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={export_csv}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Records List */}
      {is_loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : job_searched.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No job records found</p>
            {search_keywords || sync_status !== "all" ? (
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="mt-2"
              >
                Clear filters
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {job_searched.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex flex-col gap-3">
                  {/* Row 1: Job number + type */}
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{job.jobNumber}</CardTitle>
                    <Badge variant="outline">{job.jobType}</Badge>
                  </div>
                  {/* Row 2: Sync status + button */}
                  <div className="flex items-center gap-3">
                    {getSyncStatusBadge(job.huaweiSyncStatus)}
                    {job.huaweiSyncStatus === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => demo_sync(job.id)}
                        disabled={syncingJobId === job.id}
                      >
                        {syncingJobId === job.id ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Sync to Huawei
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  {/* Row 3: Location & Completed */}
                  <CardDescription className="flex flex-col gap-1">
                    <span className="flex items-start gap-2">
                      <span className="font-medium shrink-0">Location:</span> {job.siteLocation}
                    </span>
                    <span className="flex items-start gap-2">
                      <span className="font-medium shrink-0">Completed:</span> {job.completionDate} at {job.completionTime}
                    </span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Team Photo */}
                  <div>
                    <img
                      src={job.teamPhotoUrl}
                      alt="Team photo"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>

                  {/* Job Details */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Team Personnel</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.personnelNames.map((name, index) => (
                          <Badge key={index} variant="secondary">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Contractor Company</h4>
                      <p className="text-sm text-gray-900">{job.contractorCompany}</p>
                    </div>

                    {job.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
                        <p className="text-sm text-gray-600">{job.notes}</p>
                      </div>
                    )}

                    {job.huaweiSyncStatus === "synced" && job.huaweiSyncDate && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500">
                          Synced to Huawei ISC: {new Date(job.huaweiSyncDate).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
