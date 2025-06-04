import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Resume } from "@/entities/Resume";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, BarChart3, FileUp, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userResume, setUserResume] = useState(null);
  const [stats, setStats] = useState({
    totalResumes: 0,
    activeResumes: 0,
    totalMatches: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        
        // אם המשתמש הוא מועמד, בדוק אם יש לו רזומה
        if (user.role === "מועמד") {
          const resumes = await Resume.filter({
            created_by: user.email,
            is_deleted: false
          });
          
          if (resumes.length > 0) {
            setUserResume(resumes[0]);
          }
        }
        
        // השג סטטיסטיקות בסיסיות
        const allResumes = await Resume.filter({ is_deleted: false });
        const activeResumes = allResumes.filter(r => r.status === "פעיל");
        
        setStats({
          totalResumes: allResumes.length,
          activeResumes: activeResumes.length,
          totalMatches: 0 // במערכת אמיתית היינו מביאים מספר ההתאמות מה-API
        });
        
      } catch (error) {
        navigate(createPageUrl("Login"));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);
  
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

  const goToResumePage = () => {
    navigate(createPageUrl("MyResume"));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">שלום, {currentUser.full_name}</h1>
        <p className="text-gray-500 mt-1">ברוכים הבאים למערכת ניהול הרזומות והשידוכים</p>
      </div>
      
      {currentUser.role === "מועמד" && (
        <div className="grid grid-cols-1 gap-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary to-primary-dark text-white">
              <CardTitle className="text-xl">הרזומה שלי</CardTitle>
              <CardDescription className="text-white/80">
                {userResume ? "נהל ועדכן את הרזומה שלך" : "טרם הגדרת רזומה במערכת"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {userResume ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">שם מלא</p>
                      <p className="font-medium">{userResume.first_name} {userResume.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">מגדר</p>
                      <p className="font-medium">{userResume.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">גיל</p>
                      <p className="font-medium">{userResume.age}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">מגזר</p>
                      <p className="font-medium">{userResume.sector}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">מקום לימודים</p>
                      <p className="font-medium">{userResume.education_place}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">תחום</p>
                      <p className="font-medium">{userResume.field}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">סטטוס</p>
                    <div className="flex items-center mt-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      <span className="font-medium">{userResume.status}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 mb-4">עדיין לא יצרת את הרזומה שלך</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-gray-50 flex justify-end">
              <Button onClick={goToResumePage}>
                {userResume ? "עריכת רזומה" : "יצירת רזומה"}
                <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {currentUser.role === "שדכן" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium">
                  <div className="flex items-center">
                    <div className="p-2 rounded-md bg-blue-100 text-blue-700 mr-3">
                      <FileText className="h-5 w-5" />
                    </div>
                    רזומות פעילות
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.activeResumes}</p>
                <p className="text-gray-500 text-sm">מתוך {stats.totalResumes} רזומות במערכת</p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="ghost" asChild className="w-full">
                  <a href={createPageUrl("Search")}>
                    חיפוש רזומות
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium">
                  <div className="flex items-center">
                    <div className="p-2 rounded-md bg-purple-100 text-purple-700 mr-3">
                      <Users className="h-5 w-5" />
                    </div>
                    שידוכים מוצעים
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalMatches}</p>
                <p className="text-gray-500 text-sm">מספר השידוכים שהוצעו</p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="ghost" asChild className="w-full">
                  <a href={createPageUrl("Matches")}>
                    ניהול שידוכים
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium">
                  <div className="flex items-center">
                    <div className="p-2 rounded-md bg-green-100 text-green-700 mr-3">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    סטטיסטיקות
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold">נתוני המערכת</p>
                <p className="text-gray-500 text-sm">צפייה בדוחות ונתונים מפורטים</p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="ghost" asChild className="w-full">
                  <a href={createPageUrl("Statistics")}>
                    צפייה בסטטיסטיקות
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card className="w-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0">
                  <h3 className="text-2xl font-bold mb-2">מציאת התאמות לשידוכים</h3>
                  <p className="text-white/80 max-w-md">
                    השתמש במערכת החכמה שלנו כדי למצוא התאמות מושלמות באמצעות בינה מלאכותית
                  </p>
                </div>
                <Button size="lg" variant="outline" className="bg-white hover:bg-white/90 text-purple-700 border-none" asChild>
                  <a href={createPageUrl("Search")}>
                    <FileUp className="mr-2 h-5 w-5" />
                    חיפוש רזומות
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}