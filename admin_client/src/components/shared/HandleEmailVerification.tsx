import { useMutation } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import React from "react";
import { getVerificationToken } from "../../lib/actions";
import { useToast } from "../ui/use-toast";
import emailjs from "@emailjs/browser";

const HandleEmailVerification: React.FC<{
  name: string | undefined;
  email: string | undefined;
  token: string | null;
}> = ({ name, email, token }) => {
  const { toast } = useToast();

  const { mutate: sendEmail, isPending } = useMutation({
    mutationFn: async () => {
      const emailToken = await getVerificationToken(token);

      return emailToken;
    },
    onSuccess: (data) => {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      const templateParams = {
        from_name: "Foodora Admin",
        to_name: name,
        to_email: email,
        message: `Your verification link is http://localhost:5173/verify-email/${data} (valid for 24 hours)`,
      };

      emailjs.send(serviceId, templateId, templateParams, publicKey);

      toast({
        title: "Email sent successfully",
        description: "Check your email for verification link",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong while sending email",
        variant: "destructive",
      });
    },
  });

  const handleButtonClick = () => {
    sendEmail();
  };

  return (
    <div className="w-fit rounded-full flex items-center gap-x-1.5 px-2 py-1 bg-yellow-400/25">
      <span className="rounded-full p-0.5 bg-yellow-500">
        <X size={12} className="text-white" />
      </span>

      <p className="text-xs font-medium text-yellow-500">
        Your email is Unverified,
      </p>
      {isPending ? (
        <Loader2 size={18} className="animate-spin text-yellow-500 ml-2" />
      ) : (
        <p
          onClick={handleButtonClick}
          className="text-sm font-medium text-yellow-500 hover:underline pl-1 cursor-pointer"
        >
          Verify
        </p>
      )}
    </div>
  );
};

export default HandleEmailVerification;
