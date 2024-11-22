import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { editRestaurantHours } from "../lib/actions";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface OpeningHoursState {
  [key: string]: { opening: string; closing: string };
}

const DaysOfTheWeekOpeningHours: React.FC<{
  token: string | null;
  adminOpeningHours: IOpeningHours | undefined;
}> = ({ token, adminOpeningHours }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [hours, setHours] = useState<OpeningHoursState>(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = {
        opening: adminOpeningHours?.[day]?.opening || "",
        closing: adminOpeningHours?.[day]?.closing || "",
      };
      return acc;
    }, {} as OpeningHoursState)
  );

  useEffect(() => {
    if (adminOpeningHours) {
      setHours(
        daysOfWeek.reduce((acc, day) => {
          acc[day] = {
            opening: adminOpeningHours[day]?.opening || "",
            closing: adminOpeningHours[day]?.closing || "",
          };
          return acc;
        }, {} as OpeningHoursState)
      );
    }
  }, [adminOpeningHours]);

  const { mutate: saveRestaurantHoursMutation, isPending } = useMutation({
    mutationFn: async () => {
      await editRestaurantHours(token, hours);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-status"] });

      toast({
        title: "Store hours updated",
        description: "Opening hours updated successfully",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong while updating hours",
        variant: "destructive",
      });
    },
  });

  const handleTimeChange = (
    day: string,
    type: "opening" | "closing",
    value: string
  ) => {
    setHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  return (
    <div className="w-full flex flex-col gap-y-8">
      <div className="w-full flex flex-col items-center justify-center gap-y-1.5">
        <p className="text-base font-semibold text-gray-950">
          Set opening and closing times for each day of the week
        </p>
        <div className="w-28 h-px bg-primary/15" />
        <p className="text-gray-950 font-bold text-sm underline">
          Note: if you want a day off keep values empty
        </p>
      </div>

      <div className="w-full grid sm:grid-cols-2 justify-items-center gap-5">
        {daysOfWeek.map((day) => (
          <div key={day} className="flex flex-col gap-y-2">
            <p className="font-semibold capitalize">{day}</p>
            <div className="flex gap-x-4">
              <div className="flex flex-col gap-y-1.5">
                <label className="text-sm">Opening</label>
                <input
                  type="time"
                  value={hours[day]?.opening || ""}
                  onChange={(e) =>
                    handleTimeChange(day, "opening", e.target.value)
                  }
                  className="border border-gray-300 outline-none focus:border-primary rounded px-2 py-1 transition-all"
                />
              </div>
              <div className="flex flex-col gap-y-1.5">
                <label className="text-sm">Closing</label>
                <input
                  type="time"
                  value={hours[day]?.closing || ""}
                  onChange={(e) =>
                    handleTimeChange(day, "closing", e.target.value)
                  }
                  className="border border-gray-300 outline-none focus:border-primary rounded px-2 py-1 transition-all"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center mt-4">
        <Button
          disabled={isPending}
          onClick={() => saveRestaurantHoursMutation()}
          className="w-[200px] h-[40px] rounded-lg"
        >
          {isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            "Save Hours"
          )}
        </Button>
      </div>
    </div>
  );
};

export default DaysOfTheWeekOpeningHours;
