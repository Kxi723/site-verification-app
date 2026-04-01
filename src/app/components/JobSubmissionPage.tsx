import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Camera, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { submit_form } from "../utils/api";
import { submission_datatype } from "../types";
import { toast } from "sonner";

export function submission_page() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, submitting] = useState(false);
  const [submitted, display_success_page] = useState(false);

  // Reset form and refresh current date & time
  const clean_form = (): submission_datatype => ({
    jobNumber: "", jobType: "", siteLocation: "",
    completionDate: new Date().toISOString().split("T")[0], // YYYY-MM-DDTHH:MM:SS.MMMZ
    completionTime: new Date().toTimeString().slice(0, 5), // cut here ||14:30||:45 GMT+0800
    contractorCompany: "", notes: "", personnelNames: [],
  });

  // When user click icon at the navigation bar or wanted to submit 
  // new job completion, system will clear session storage
  const clean_session_storage = () => {
    display_success_page(false);
    setFormData(clean_form());
    setTeamPhotoData("");
    setPersonnelInput("");

    sessionStorage.removeItem("jobFormData");
    sessionStorage.removeItem("jobPhotoData");
    sessionStorage.removeItem("jobPersonnelInput");
  };

  const initialKey = useRef(location.key);

  useEffect(() => {
    // Only reset if the layout nav bar is explicitly clicked AFTER initial mount.
    // This prevents wiping the data we just restored from sessionStorage during a tab refresh.
    if (location.key !== initialKey.current) {
      clean_session_storage();
      initialKey.current = location.key;
    }
  }, [location.key]);

  // Load form data from session storage
  const [formData, setFormData] = useState<Partial<submission_datatype>>(() => {
    // 'Partial' used to allow update few data only
    const session_data = sessionStorage.getItem("form_data");

    // Load session data
    if (session_data) {
      try {
        return JSON.parse(session_data);
      }
      catch (e: any) {
        toast.error("Failed to load session data | ", e);
      }
    }
    // Leave blank
    return clean_form();
  });

  // Save data
  useEffect(() => {
    sessionStorage.setItem("form_data", JSON.stringify(formData));
  }, [formData]); // When [formData] changes trigger this

  const [photo, setTeamPhotoData] = useState<string>(() => {
    return sessionStorage.getItem("photo_data") || "";
  });

  useEffect(() => {
    try {
      if (photo) {
        sessionStorage.setItem("photo_data", photo);
      } 
      else {
        sessionStorage.removeItem("photo_data");
      }
    }
    catch (e) {
      console.warn("Could not save photo to sessionStorage", e);
    }
  }, [photo]);

  const [personnelInput, setPersonnelInput] = useState(() => {
    return sessionStorage.getItem("personnel_list") || "";
  });

  useEffect(() => {
    sessionStorage.setItem("personnel_list", personnelInput);
  }, [personnelInput]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Compress image to save memory and prevent tab crashes on mobile
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7); // 70% quality JPEG
          setTeamPhotoData(compressedDataUrl);
          toast.success("Photo captured successfully");
        }
      };
      
      img.onerror = () => {
        toast.error("Failed to process image");
      };
      
      img.src = objectUrl;
      e.target.value = ""; // Reset input value so the same photo can be taken again if needed
    }
  };

  const handleAddPersonnel = () => {
    if (personnelInput.trim()) {
      setFormData({
        ...formData,
        personnelNames: [...(formData.personnelNames || []), personnelInput.trim()],
      });
      setPersonnelInput("");
    }
  };

  const handleRemovePersonnel = (index: number) => {
    setFormData({
      ...formData,
      personnelNames: formData.personnelNames?.filter((_, i) => i !== index) || [],
    });
  };

  const handle_submission = async (e: React.SubmitEvent) => {
    e.preventDefault(); // Cancel native behaviour of the submit button

    if (!formData.jobType) {
      toast.error("Please select a job type");
      return;
    }

    if (!photo) {
      toast.error("Please capture a team photo");
      return;
    }

    if (!formData.personnelNames || formData.personnelNames.length === 0) {
      toast.error("Please add at least one team member");
      return;
    }

    submitting(true);
    try {
      const submission: submission_datatype = {
        jobNumber: formData.jobNumber!,
        jobType: formData.jobType,
        siteLocation: formData.siteLocation!,
        completionDate: formData.completionDate!,
        completionTime: formData.completionTime!,
        contractorCompany: formData.contractorCompany!,
        notes: formData.notes || "",
        photo: photo,
        personnelNames: formData.personnelNames,
      };

      // api.ts
      const result = await submit_form(submission);
      
      if (result.success) {
        display_success_page(true);
        toast.success("Job completion submitted successfully!");
        sessionStorage.removeItem("jobFormData");
        sessionStorage.removeItem("jobPhotoData");
        sessionStorage.removeItem("jobPersonnelInput");
      }
    } 
    catch (error) {
      toast.error("Failed to submit job completion");
      console.error(error);
    } 
    finally {
      submitting(false);
    }
  };

  // Display success message
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Job Submitted Successfully!</h2>
        </div>
        <div className="flex gap-4">
          <Button onClick={clean_session_storage}>
            Submit Another Job
          </Button>
          <Button variant="outline" onClick={() => navigate("/records")}>
            Back to Records
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Submit Job Completion</h2>
        <p className="text-gray-600 mt-1">Record completed work with real-time team photo</p>
      </div>

      {/* Form */}
      <form onSubmit={handle_submission} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Enter the basic information about the completed job</CardDescription>
          </CardHeader>

          <CardContent className = "space-y-4">
            <div className = "grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor = "jobNumber">Job Number *</Label> {/* 'htmlFor': when user click label, the input got focus */}
                <Input
                  id = "jobNumber"
                  placeholder = "e.g., JOB-2026-001"
                  value = {formData.jobNumber}
                  onChange = {(e) => setFormData({ ...formData, jobNumber: e.target.value })}
                  // '...formData' others data remain, but the specific field will be updated
                  required
                />
              </div>

              <div>
                <Label htmlFor = "jobType">Job Type *</Label>
                <Select 
                  value = {formData.jobType}
                  onValueChange = {(value) => setFormData({ ...formData, jobType: value })}
                >
                  <SelectTrigger id = "jobType">
                    <SelectValue placeholder = "Select job type" /> {/* Display the selected value */}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value = "Installation">Installation</SelectItem>
                    <SelectItem value = "Maintenance">Maintenance</SelectItem>
                    <SelectItem value = "Repair">Repair</SelectItem>
                    <SelectItem value = "Inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor = "siteLocation">Site Location *</Label>
              <Input
                id = "siteLocation"
                placeholder = "e.g., Tower Site Alpha - Sector 3"
                value = {formData.siteLocation}
                onChange = {(e) => setFormData({ ...formData, siteLocation: e.target.value })}
                required
                
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor = "completionDate">Completion Date *</Label>
                <Input
                  id = "completionDate"
                  type = "date"
                  value = {formData.completionDate}
                  onChange = {(e) => setFormData({ ...formData, completionDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor = "completionTime">Completion Time *</Label>
                <Input
                  id = "completionTime"
                  type = "time"
                  value = {formData.completionTime}
                  onChange = {(e) => setFormData({ ...formData, completionTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor = "contractorCompany">Contractor Company *</Label>
              <Input
                id = "contractorCompany"
                placeholder = "e.g., TechCom Solutions Ltd."
                value = {formData.contractorCompany}
                onChange = {(e) => setFormData({ ...formData, contractorCompany: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor = "notes">Job Notes</Label>
              <Textarea
                id = "notes"
                placeholder = "Enter any additional notes about the job completion..."
                value = {formData.notes}
                onChange = {(e) => setFormData({ ...formData, notes: e.target.value })}
                rows = {3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-Time Team Photo</CardTitle>
            <CardDescription>
              Capture a live photo of the team who performed this job for verification
            </CardDescription>
          </CardHeader>
          <CardContent className = "space-y-4">
            <input
              type = "file"
              accept = "image/*"
              capture = "environment"
              className = "hidden"
              ref = {fileInputRef}
              onChange = {handleFileChange}
            />
            {photo ? (
              <div className = "space-y-3">
                <img
                  src = {photo}
                  alt = "Team photo"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  type = "button"
                  variant = "outline"
                  onClick = {() => fileInputRef.current?.click()}
                  className = "w-full"
                >
                  <Camera className = "w-4 h-4 mr-2" />
                  Retake Photo
                </Button>
              </div>
            ) : (
              <button
                type = "button"
                onClick = {() => fileInputRef.current?.click()}
                className = "w-full border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-gray-400 transition-colors hover:bg-gray-50"
              >
                <div className = "flex flex-col items-center gap-3">
                  <div className = "w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className = "font-medium text-gray-900">Capture Team Photo</p>
                  <p className = "text-sm text-gray-500">Click to open camera and take a real-time photo</p>
                </div>
              </button>
            )}
            
            <Alert>
              <Camera className = "h-4 w-4" />
              <AlertDescription>
                Real-time camera capture ensures authentic verification that work was completed by your team on-site.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Personnel</CardTitle>
            <CardDescription>Add names of team members who performed this job</CardDescription>
          </CardHeader>
          <CardContent className = "space-y-4">
            <div className = "flex gap-2">
              <Input
                placeholder = "Enter personnel name"
                value = {personnelInput}
                onChange = {(e) => setPersonnelInput(e.target.value)}
                onKeyPress = {(e) => e.key === "Enter" && (e.preventDefault(), handleAddPersonnel())}
              />
              <Button type = "button" onClick={handleAddPersonnel}>
                Add
              </Button>
            </div>

            {formData.personnelNames && formData.personnelNames.length > 0 ? (
              <div className = "space-y-2">
                {formData.personnelNames.map((name, index) => (
                  <div
                    key = {index}
                    className = "flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className = "text-gray-900">{name}</span>
                    <Button
                      type = "button"
                      variant = "ghost"
                      size = "sm"
                      onClick={() => handleRemovePersonnel(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertCircle className = "h-4 w-4" />
                <AlertDescription>
                  No personnel added yet. Add at least one team member.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className = "flex gap-3">
          {/* Cancel button */}
          <Button
            type = "button"
            variant = "outline"
            className = "flex-1"
            onClick = {() => navigate("/records")}
          >
            Cancel
          </Button>
          
          {/* Submit button */}
          <Button type = "submit" className = "flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className = "w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className = "w-4 h-4 mr-2" />
                Submit Job Completion
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}