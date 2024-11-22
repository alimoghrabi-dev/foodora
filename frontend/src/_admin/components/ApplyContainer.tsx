import { Check, X } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../components/ui/use-toast";
import { rejectOrApproveApply } from "../../lib/actions";
import { timeElapsed } from "../../lib/utils";
import emailjs from "@emailjs/browser";
import axios from "axios";

const ApplyContainer: React.FC<{
  index: number;
  id: string;
  restaurantName: string;
  email: string;
  phoneNumber: string;
  description: string;
  createdAt: Date;
  token: string | null;
}> = ({
  index,
  id,
  restaurantName,
  email,
  phoneNumber,
  description,
  createdAt,
  token,
}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const [value, setValue] = useState<string | null>(null);

  const {
    mutate: approveOrRejectApplyMutation,
    isPending: isApprovingOrRejecting,
  } = useMutation({
    mutationFn: async (isRejected: boolean) => {
      await rejectOrApproveApply(id, token);

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      const response = await axios.post("/auth/generate-registration-token", {
        email,
      });

      const responseData = response.data;

      const { token: registrationToken } = responseData;

      const templateParams = {
        from_name: "Foodora Admin",
        to_name: restaurantName,
        to_email: email,
        message: `Your apply has been ${
          isRejected
            ? "rejected"
            : `approved, create your account and join our platform at http://localhost:5173/register-restaurant?token=${registrationToken} (note: this link is valid for 7 days only!)`
        }.`,
      };

      emailjs.send(serviceId, templateId, templateParams, publicKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applies"] });
      queryClient.invalidateQueries({ queryKey: ["auth-status"] });

      toast({
        title: "Success",
        description: `Successfully ${value} apply`,
        className:
          "bg-green-500 text-white text-3xl font-semibold ring-0 border-none",
      });
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    approveOrRejectApplyMutation(false);

    setValue("approved");
  };

  const handleReject = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    approveOrRejectApplyMutation(true);

    setValue("rejected");
  };

  return (
    <div className="w-full flex items-center gap-x-6">
      <p className="text-3xl lilita_one_font font-semibold primary-text">
        {index + 1}
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex-1 p-4 rounded-md bg-white shadow-sm relative flex items-center justify-between gap-4 hover:bg-gray-50 transition-all">
            <div className="flex flex-col items-start gap-y-2.5">
              <div className="flex flex-col items-start">
                <p className="font-semibold text-gray-950 text-lg">
                  {restaurantName}
                </p>
                <span className="text-sm font-medium text-neutral-700 flex items-center gap-x-1.5">
                  Sent in {new Date(createdAt).toDateString()}
                  <p>{`(${timeElapsed(new Date(createdAt))})`}</p>
                </span>
              </div>
              <div className="w-12 h-px bg-black/15" />
              <span className="text-sm font-medium text-neutral-700 flex items-center gap-x-1">
                Phone number: <p className="font-semibold">{phoneNumber}</p>
              </span>
            </div>
            <div className="flex flex-col items-center gap-y-2.5">
              <button
                onClick={handleApprove}
                disabled={isApprovingOrRejecting}
                className="text-green-500 font-semibold text-base flex items-center gap-x-2 hover:opacity-70 transition-all px-2 disabled:opacity-35"
              >
                <Check size={21} />
                Approve
              </button>
              <div className="w-full h-px bg-black/5" />
              <button
                onClick={handleReject}
                disabled={isApprovingOrRejecting}
                className="text-red-500 font-semibold text-base flex items-center gap-x-2 hover:opacity-70 transition-all px-2 disabled:opacity-35"
              >
                <X size={21} />
                Reject
              </button>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="rounded-lg">
          <div className="w-full flex flex-col gap-y-2.5">
            <span className="text-base font-semibold text-gray-700 flex items-center gap-x-1.5">
              Restaurant Name:{" "}
              <p className="font-bold text-gray-900">{restaurantName}</p>
            </span>

            <span className="text-base font-semibold text-gray-700 flex items-center gap-x-1.5">
              Email: <p className="font-bold text-gray-900">{email}</p>
            </span>

            <span className="text-base font-semibold text-gray-700 flex items-center gap-x-1.5">
              Phone Number:{" "}
              <p className="font-bold text-gray-900">{phoneNumber}</p>
            </span>
            <div className="w-full h-px bg-black/15" />
            <p className="text-base font-medium text-gray-800">{description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplyContainer;
