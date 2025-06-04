import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Resume } from "@/entities/Resume";
import { SendEmail, InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Search as SearchIcon,
  Filter,
  Download,
  Eye,
  Mail,
  User as UserIcon,
  Calendar,
  Building,
  MapPin,
  BookOpen,
  AlertCircle,
  Sparkles,
  X,
  Plus,
  FileText
} from "lucide-react";

export default function Search() {
  const [currentUser, setCurrentUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    gender: [],
    sector: [],
    ageRange: [18, 50],
    field: []
  });
  const [availableFilters, setAvailableFilters] = useState({
    fields: []
  });
  const [selectedResume, setSelectedResume] = useState(null);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [showAIMatchDialog, setShowAIMatchDialog] = useState(false);
  const [aiMatches, setAiMatches] = useState([]);
  const [aiMatchLoading, setAiMatchLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        
        if (user.role !== "שדכן") {
          navigate(createPageUrl("Dashboard"));
          return;
        }
        
        // השג את כל הרזומות הפעילות
        const allResumes = await Resume.filter({
          is_deleted: false,
          status: "פעיל"
        });
        
        setResumes(allResumes);
        setFilteredResumes(allResumes);
        
        // חלץ פילטרים זמינים
        const uniqueFields = [...new Set(allResumes.map(r => r.field))].filter(Boolean);
        setAvailableFilters({
          ...availableFilters,
          fields: uniqueFields
        });
      } catch (error) {
        navigate(createPageUrl("Login"));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  useEffect(() => {
    // עדכן את הרשימה המסוננת בכל פעם שיש שינוי בחיפוש או בפילטרים
    const applyFilters = () => {
      let result = [...resumes];
      
      // חיפוש
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(resume => 
          resume.first_name?.toLowerCase().includes(query) ||
          resume.last_name?.toLowerCase().includes(query) ||
          resume.field?.toLowerCase().includes(query) ||
          resume.education_place?.toLowerCase().includes(query) ||
          resume.extracted_data?.toLowerCase().includes(query)
        );
      }
      
      // פילטר מגדר
      if (activeFilters.gender.length > 0) {
        result = result.filter(resume => activeFilters.gender.includes(resume.gender));
      }
      
      // פילטר מגזר
      if (activeFilters.sector.length > 0) {
        result = result.filter(resume => activeFilters.sector.includes(resume.sector));
      }
      
      // פילטר גיל
      if (activeFilters.ageRange) {
        const [minAge, maxAge] = activeFilters.ageRange;
        result = result.filter(resume => 
          resume.age >= minAge && resume.age <= maxAge
        );
      }
      
      // פילטר תחום
      if (activeFilters.field.length > 0) {
        result = result.filter(resume => activeFilters.field.includes(resume.field));
      }
      
      setFilteredResumes(result);
    };
    
    applyFilters();
  }, [searchQuery, activeFilters, resumes]);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const toggleFilterItem = (filterType, item) => {
    setActiveFilters(prev => {
      const currentItems = [...prev[filterType]];
      
      if (currentItems.includes(item)) {
        return {
          ...prev,
          [filterType]: currentItems.filter(i => i !== item)
        };
      } else {
        return {
          ...prev,
          [filterType]: [...currentItems, item]
        };
      }
    });
  };

  const clearFilters = () => {
    setActiveFilters({
      gender: [],
      sector: [],
      ageRange: [18, 50],
      field: []
    });
    setSearchQuery("");
  };

  const viewResumeDetails = (resume) => {
    setSelectedResume(resume);
    setShowResumeDialog(true);
  };

  const findAIMatches = async (resume) => {
    setSelectedResume(resume);
    setAiMatchLoading(true);
    setAiMatches([]);
    setShowAIMatchDialog(true);
    setError("");
    
    try {
      // שימוש ב-AI למציאת התאמות
      const result = await InvokeLLM({
        prompt: `
          אני מחפש התאמות שידוכים עבור המועמד הבא:
          שם: ${resume.first_name} ${resume.last_name}
          מגדר: ${resume.gender}
          גיל: ${resume.age}
          מגזר: ${resume.sector}
          מקום לימודים: ${resume.education_place}
          תחום: ${resume.field}
          מידע נוסף: ${resume.extracted_data || ""}
          
          מצא 3 מועמדים מהרשימה הבאה שיתאימו לשידוך עבורו, ודרג אותם לפי רמת ההתאמה מ-1 עד 10 ותן הסבר קצר:
          ${resumes
            .filter(r => r.id !== resume.id && r.gender !== resume.gender)
            .map(r => `
              מועמד מספר ${r.id}:
              שם: ${r.first_name} ${r.last_name}
              מגדר: ${r.gender}
              גיל: ${r.age}
              מגזר: ${r.sector}
              מקום לימודים: ${r.education_place}
              תחום: ${r.field}
              מידע נוסף: ${r.extracted_data || ""}
            `).join("\n")
          }
        `,
        response_json_schema: {
          type: "object",
          properties: {
            matches: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  match_score: { type: "number" },
                  explanation: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      if (result.matches && result.matches.length > 0) {
        // חיבור נתוני המועמדים המלאים למציאת התאמות
        const matchesWithData = result.matches.map(match => {
          const matchResume = resumes.find(r => r.id === match.id);
          return {
            ...match,
            resume: matchResume
          };
        }).filter(m => m.resume); // סנן מקרים שבהם לא נמצאה התאמה
        
        setAiMatches(matchesWithData);
      }
    } catch (error) {
      setError("אירעה שגיאה בעת חיפוש התאמות. אנא נסה שנית.");
      console.error("AI match error:", error);
    } finally {
      setAiMatchLoading(false);
    }
  };

  const sendMatchEmail = async (match1, match2) => {
    try {
      await SendEmail({
        to: currentUser.email,
        subject: "הצעת שידוך חדשה",
        body: `
          <h1>הצעת שידוך חדשה</h1>
          <p>שלום ${currentUser.full_name},</p>
          <p>מצאת התאמה פוטנציאלית בין:</p>
          <ul>
            <li><strong>${match1.first_name} ${match1.last_name}</strong>, בן/בת ${match1.age}, ${match1.sector}</li>
            <li><strong>${match2.first_name} ${match2.last_name}</strong>, בן/בת ${match2.age}, ${match2.sector}</li>
          </ul>
          <p>יש ליצור קשר עם המועמדים כדי לקדם את השידוך.</p>
        `
      });
      
      setSuccess("הצעת השידוך נשלחה לאימייל שלך בהצלחה");
    } catch (error) {
      setError("אירעה שגיאה בעת שליחת האימייל");
      console.error("Email error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto mb-4 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <p className="text-gray-500">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">חיפוש רזומות</h1>
        <p className="text-gray-500">חפש ומצא התאמות מתוך {resumes.length} רזומות פעילות במערכת</p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" className="bg-green-50 text-green-700 border border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* פאנל פילטרים */}
        <Card className="lg:w-64 flex-shrink-0">
          <CardHeader>
            <CardTitle className="text-lg">סננים</CardTitle>
            <CardDescription>
              סנן את הרזומות לפי הקריטריונים הבאים
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">מגדר</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="male-filter" 
                    checked={activeFilters.gender.includes("זכר")}
                    onCheckedChange={() => toggleFilterItem("gender", "זכר")}
                  />
                  <Label htmlFor="male-filter" className="mr-2">זכר</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="female-filter" 
                    checked={activeFilters.gender.includes("נקבה")}
                    onCheckedChange={() => toggleFilterItem("gender", "נקבה")}
                  />
                  <Label htmlFor="female-filter" className="mr-2">נקבה</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-sm font-medium">טווח גילאים</Label>
                <span className="text-sm text-gray-500">
                  {activeFilters.ageRange[0]} - {activeFilters.ageRange[1]}
                </span>
              </div>
              <Slider
                value={activeFilters.ageRange}
                min={18}
                max={70}
                step={1}
                onValueChange={(value) => handleFilterChange("ageRange", value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">מגזר</Label>
              <div className="space-y-2">
                {["חרדי", "דתי לאומי", "מסורתי", "חילוני", "אחר"].map(sector => (
                  <div key={sector} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`sector-${sector}`} 
                      checked={activeFilters.sector.includes(sector)}
                      onCheckedChange={() => toggleFilterItem("sector", sector)}
                    />
                    <Label htmlFor={`sector-${sector}`} className="mr-2">{sector}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">תחום</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {availableFilters.fields.map(field => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`field-${field}`} 
                      checked={activeFilters.field.includes(field)}
                      onCheckedChange={() => toggleFilterItem("field", field)}
                    />
                    <Label htmlFor={`field-${field}`} className="mr-2">{field}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
            >
              <X className="ml-2 h-4 w-4" />
              נקה סננים
            </Button>
          </CardFooter>
        </Card>
        
        {/* תוצאות חיפוש */}
        <div className="flex-1">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="חפש לפי שם, תחום, מוסד לימודים..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">
              נמצאו {filteredResumes.length} רזומות
            </h2>
            
            <div className="flex items-center text-sm text-gray-500">
              <Filter className="h-4 w-4 ml-1" />
              פילטרים פעילים: {Object.values(activeFilters).flat().filter(v => v !== undefined && v !== null && v !== "").length}
            </div>
          </div>
          
          {filteredResumes.length === 0 ? (
            <Card className="bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">לא נמצאו רזומות</h3>
                <p className="text-gray-500 text-center max-w-md">
                  לא נמצאו רזומות התואמות את פרמטרי החיפוש. נסה לשנות את החיפוש או להסיר חלק מהסננים.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResumes.map(resume => (
                <Card key={resume.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        {resume.first_name} {resume.last_name}
                      </CardTitle>
                      <div className="flex items-center text-sm">
                        <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs ${
                          resume.gender === "זכר" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                        }`}>
                          {resume.gender === "זכר" ? "זכר" : "נקבה"}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2 pt-0">
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <UserIcon className="h-4 w-4 ml-1" />
                        גיל: {resume.age}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 ml-1" />
                        מגזר: {resume.sector}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Building className="h-4 w-4 ml-1" />
                        {resume.education_place}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="h-4 w-4 ml-1" />
                        {resume.field}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 bg-gray-50 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => findAIMatches(resume)}
                    >
                      <Sparkles className="ml-1 h-4 w-4 text-amber-500" />
                      מצא שידוכים
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewResumeDetails(resume)}
                    >
                      <Eye className="ml-1 h-4 w-4" />
                      צפייה
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* דיאלוג צפייה ברזומה */}
      <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              רזומה: {selectedResume?.first_name} {selectedResume?.last_name}
            </DialogTitle>
            <DialogDescription>
              פרטי הרזומה המלאים
            </DialogDescription>
          </DialogHeader>
          
          {selectedResume && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">מידע אישי</h3>
                    <div className="mt-3 grid grid-cols-2 gap-y-2">
                      <div>
                        <p className="text-sm text-gray-500">שם מלא</p>
                        <p className="font-medium">
                          {selectedResume.first_name} {selectedResume.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">מגדר</p>
                        <p className="font-medium">{selectedResume.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">גיל</p>
                        <p className="font-medium">{selectedResume.age}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">תאריך לידה</p>
                        <p className="font-medium">
                          {selectedResume.birth_date && format(new Date(selectedResume.birth_date), "dd/MM/yyyy")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">מגזר</p>
                        <p className="font-medium">{selectedResume.sector}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">השכלה ותעסוקה</h3>
                    <div className="mt-3 grid grid-cols-2 gap-y-2">
                      <div>
                        <p className="text-sm text-gray-500">מקום לימודים</p>
                        <p className="font-medium">{selectedResume.education_place}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">תחום</p>
                        <p className="font-medium">{selectedResume.field}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  {selectedResume.extracted_data && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">מידע נוסף</h3>
                      <div className="bg-gray-50 p-4 rounded-lg border text-sm">
                        {selectedResume.extracted_data}
                      </div>
                    </div>
                  )}
                  
                  {selectedResume.resume_file_url && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">קובץ רזומה</h3>
                      <div className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 text-blue-500 ml-3" />
                          <div>
                            <p className="font-medium">{selectedResume.resume_file_name || "רזומה"}</p>
                            <p className="text-xs text-gray-500">
                              הועלה ב-{format(new Date(selectedResume.created_date), "dd/MM/yyyy")}
                            </p>
                          </div>
                        </div>
                        <a
                          href={selectedResume.resume_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
                        >
                          <Download className="h-4 w-4 ml-1" />
                          הורדה
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => findAIMatches(selectedResume)}>
                  <Sparkles className="ml-2 h-4 w-4 text-amber-500" />
                  מצא שיד
חיפוש שידוכים מתאימים
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* דיאלוג התאמות AI */}
      <Dialog open={showAIMatchDialog} onOpenChange={setShowAIMatchDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <Sparkles className="h-5 w-5 ml-2 text-amber-500" />
              חיפוש שידוכים מתאימים
            </DialogTitle>
            <DialogDescription>
              המלצות שידוכים עבור {selectedResume?.first_name} {selectedResume?.last_name}
            </DialogDescription>
          </DialogHeader>
          
          {aiMatchLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="h-12 w-12 mx-auto mb-4 rounded-full border-4 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <p className="text-gray-500">מחפש התאמות מושלמות...</p>
                <p className="text-xs text-gray-400 max-w-xs mx-auto mt-2">
                  הבינה המלאכותית מחפשת את ההתאמות הטובות ביותר. תהליך זה עשוי להימשך מספר שניות.
                </p>
              </div>
            </div>
          ) : aiMatches.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium mb-2">לא נמצאו התאמות</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                לא הצלחנו למצוא שידוכים מתאימים במערכת. נסה להרחיב את החיפוש או לנסות שוב מאוחר יותר.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-start">
                  <UserIcon className="h-5 w-5 mt-1 ml-3 text-blue-600" />
                  <div>
                    <h3 className="font-medium">מועמד/ת: {selectedResume?.first_name} {selectedResume?.last_name}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedResume?.gender}, בן/בת {selectedResume?.age}, {selectedResume?.sector}
                    </p>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="matches">
                <TabsList className="mb-4">
                  <TabsTrigger value="matches">התאמות ({aiMatches.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="matches" className="space-y-4">
                  {aiMatches.map((match, index) => (
                    <Card key={match.resume.id} className="overflow-hidden">
                      <CardHeader className="py-4 bg-gradient-to-r from-amber-50 to-amber-100 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-200 text-amber-800 font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {match.resume.first_name} {match.resume.last_name}
                              </CardTitle>
                              <CardDescription>
                                התאמה: {match.match_score}/10
                              </CardDescription>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => sendMatchEmail(selectedResume, match.resume)}
                          >
                            <Mail className="ml-2 h-4 w-4" />
                            שלח הצעת שידוך
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {match.resume.gender}, בן/בת {match.resume.age}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{match.resume.sector}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{match.resume.education_place}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{match.resume.field}</span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-md">
                            <h4 className="text-sm font-medium mb-2">הסבר להתאמה:</h4>
                            <p className="text-sm text-gray-600">{match.explanation}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}