import React from 'react';
import { Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge }  from "@/components/ui/label";
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, resetFilters } from '../redux/actions'; // ייבוא פעולות

export default function CandidateFilters({ activeFilterCount }) {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.filters); // קבלת הסינונים מהמצב

  const handleResetFilters = () => {
    dispatch(resetFilters()); // פעולה לאיפוס הסינונים
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg flex items-center">
          <Filter className="w-5 h-5 ml-2 text-gray-500" />
          סינון מועמדים
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="mr-2 bg-indigo-100 text-indigo-800">
              {activeFilterCount} פילטרים פעילים
            </Badge>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 ml-1" />
            איפוס
          </Button>
        )}
      </div>

      <div className="relative mb-4">
        <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="חיפוש לפי שם, מקצוע או מקום לימודים"
          value={filters.searchTerm}
          onChange={(e) => dispatch(setFilter('searchTerm', e.target.value))}
          className="pl-3 pr-10"
        />
      </div>

      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline">
            <span className="text-sm font-medium">פילטרים מהירים</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>מגדר</Label>
                <Select
                  value={filters.gender || ""}
                  onValueChange={(value) => dispatch(setFilter('gender', value || null))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="כל המגדרים" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>כל המגדרים</SelectItem>
                    <SelectItem value="זכר">זכר</SelectItem>
                    <SelectItem value="נקבה">נקבה</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>מגזר</Label>
                <Select
                  value={filters.sector || ""}
                  onValueChange={(value) => dispatch(setFilter('sector', value || null))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="כל המגזרים" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>כל המגזרים</SelectItem>
                    <SelectItem value="חרדי">חרדי</SelectItem>
                    <SelectItem value="דתי-לאומי">דתי-לאומי</SelectItem>
                    <SelectItem value="מסורתי">מסורתי</SelectItem>
                    <SelectItem value="חילוני">חילוני</SelectItem>
                    <SelectItem value="אחר">אחר</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <Label>טווח גילאים: {filters.ageRange[0]} - {filters.ageRange[1]} שנים</Label>
              </div>
              <Slider
                value={filters.ageRange}
                min={18}
                max={70}
                step={1}
                onValueChange={(value) => dispatch(setFilter('ageRange', value))}
                className="my-6"
              />
            </div>

            <div className="mt-4 flex items-center justify-between space-x-2 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="has-resume"
                  checked={filters.hasResume}
                  onCheckedChange={(checked) => dispatch(setFilter('hasResume', checked))}
                />
                <Label htmlFor="has-resume">רק עם קובץ רזומה</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline">
            <span className="text-sm font-medium">פילטרים מתקדמים</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>תחום עיסוק</Label>
                <Input
                  placeholder="הזינו תחום עיסוק"
                  value={filters.profession || ""}
                  onChange={(e) => dispatch(setFilter('profession', e.target.value || null))}
                />
              </div>

              <div className="space-y-2">
                <Label>מקום לימודים</Label>
                <Input
                  placeholder="הזינו מקום לימודים"
                  value={filters.education || ""}
                  onChange={(e) => dispatch(setFilter('education', e.target.value || null))}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator className="my-4" />
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleResetFilters}
        >
          איפוס הכל
        </Button>
        <Button 
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          החל סינון
        </Button>
      </div>
    </div>
  );
}
