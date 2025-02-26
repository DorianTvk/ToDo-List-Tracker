import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertTaskSchema, type Task } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { format, isToday, isTomorrow, isThisWeek } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarClock, Trash2, Plus, Loader2, Clock, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const form = useForm({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: "",
      completed: false,
      dueDate: null,
    },
  });

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    select: (data) => {
      return [...data].sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; completed: boolean; dueDate: string | null }) => {
      await apiRequest("POST", "/api/tasks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      form.reset();
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Task>) => {
      await apiRequest("PATCH", `/api/tasks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    },
  });

  const onSubmit = (data: { title: string; completed: boolean; dueDate: string | null }) => {
    createMutation.mutate(data);
  };

  const getTasksByDate = (date: Date | null) => {
    if (!tasks) return [];
    return tasks.filter(task => {
      if (!task.dueDate || !date) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const groupTasks = () => {
    if (!tasks) return { today: [], tomorrow: [], thisWeek: [], later: [] };

    return tasks.reduce((acc, task) => {
      if (!task.dueDate) {
        acc.later.push(task);
      } else {
        const dueDate = new Date(task.dueDate);
        if (isToday(dueDate)) {
          acc.today.push(task);
          acc.thisWeek.push(task);
        }
        else if (isTomorrow(dueDate)) {
          acc.tomorrow.push(task);
          acc.thisWeek.push(task);
        }
        else if (isThisWeek(dueDate)) {
          acc.thisWeek.push(task);
        }
        else acc.later.push(task);
      }
      return acc;
    }, { today: [], tomorrow: [], thisWeek: [], later: [] } as Record<string, Task[]>);
  };

  const groupedTasks = groupTasks();

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="backdrop-blur-lg bg-white/90 shadow-xl">
          <CardHeader>
            <div className="text-center">
              <div className="text-4xl font-light mb-1 text-primary animate-fade-in">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold mt-6">Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Add a new task..."
                          className="transition-all duration-200 focus:scale-[1.01]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-white"
                          >
                            <CalendarClock className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Set due date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                const now = new Date();
                                date.setHours(now.getHours(), now.getMinutes());
                                field.onChange(date.toISOString());
                              } else {
                                field.onChange(null);
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {createMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Add Task
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-lg bg-white/90 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border bg-white text-blue-500"
              modifiers={{ today: new Date() }}
              modifiersStyles={{
                today: {
                  fontWeight: 'bold',
                  color: '#3B82F6',
                  border: '2px solid #3B82F6'
                }
              }}
              styles={{
                head_cell: { color: '#60A5FA' },
                caption_label: { color: '#3B82F6' },
                nav_button: { color: '#3B82F6' },
                day: { color: '#3B82F6' },
                day_selected: { backgroundColor: '#3B82F6', color: 'white' },
                day_today: { backgroundColor: '#EFF6FF', color: '#3B82F6' }
              }}
            />
            {selectedDate && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Tasks for {format(selectedDate, "PP")}</h3>
                <div className="space-y-2">
                  {getTasksByDate(selectedDate).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={(checked) =>
                            updateMutation.mutate({
                              id: task.id,
                              completed: checked as boolean,
                            })
                          }
                        />
                        <span className={cn(task.completed && "line-through text-muted-foreground")}>
                          {task.title}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-red-500 transition-all duration-200 hover:rotate-12"
                        onClick={() => deleteMutation.mutate(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="backdrop-blur-lg bg-white/90 shadow-xl md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">All Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="today">
              <TabsList className="grid grid-cols-4 bg-white">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
                <TabsTrigger value="thisWeek">This Week</TabsTrigger>
                <TabsTrigger value="later">Later</TabsTrigger>
              </TabsList>
              {Object.entries(groupedTasks).map(([period, periodTasks]) => (
                <TabsContent key={period} value={period} className="space-y-2">
                  {periodTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={(checked) =>
                            updateMutation.mutate({
                              id: task.id,
                              completed: checked as boolean,
                            })
                          }
                        />
                        <div>
                          <p className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                            {task.title}
                          </p>
                          {task.dueDate && (
                            <p className="text-sm text-muted-foreground">
                              Due: {format(new Date(task.dueDate), "PPp")}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-red-500 transition-all duration-200 hover:rotate-12"
                        onClick={() => deleteMutation.mutate(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {periodTasks.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No tasks for this period
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}