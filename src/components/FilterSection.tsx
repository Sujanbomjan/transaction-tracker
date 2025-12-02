"use client";

import { useSelector, useDispatch } from "react-redux";
import { Filter, Check, X } from "lucide-react";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import {
  selectCategories,
  selectFilters,
  setFilters,
} from "@/redux/features/transactions/transactionsSlice";

export default function FilterSection() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const filters = useSelector(selectFilters);
  const [open, setOpen] = useState(false);

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    dispatch(setFilters({ categories: newCategories }));
  };

  const handleClearCategories = () => {
    dispatch(setFilters({ categories: [] }));
  };

  const handleSelectAllCategories = () => {
    dispatch(setFilters({ categories: [...categories] }));
  };

  const handleTypeChange = (value: string) => {
    dispatch(setFilters({ type: value }));
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Multi-Select Categories */}
          <div className="space-y-2">
            <Label>Categories</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {filters.categories.length === 0
                    ? "All Categories"
                    : `${filters.categories.length} selected`}
                  <Filter className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search categories..." />
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    <div className="flex gap-2 p-2 border-b">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAllCategories}
                        className="flex-1"
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearCategories}
                        className="flex-1"
                      >
                        Clear All
                      </Button>
                    </div>
                    {categories.map((category) => (
                      <CommandItem
                        key={category}
                        onSelect={() => handleCategoryToggle(category)}
                        className="cursor-pointer"
                      >
                        <Checkbox
                          checked={filters.categories.includes(category)}
                          className="mr-2"
                        />
                        <span className="flex-1">{category}</span>
                        {filters.categories.includes(category) && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Selected Categories Display */}
            {filters.categories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {filters.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                    <button
                      onClick={() => handleCategoryToggle(category)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={filters.type} onValueChange={handleTypeChange}>
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Income
                  </div>
                </SelectItem>
                <SelectItem value="expense">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    Expense
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
