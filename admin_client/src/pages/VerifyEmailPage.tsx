import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { verifyEmail } from "../lib/actions";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";

const VerifyEmailPage: React.FC = () => {
  const { admin, isPending } = useAuth();
  const params = useParams();

  const queryClient = useQueryClient();

  const { mutate: verifyEmailMutation, isPending: isVerifying } = useMutation({
    mutationFn: async () => {
      await verifyEmail(params.token!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-status"] });
    },
  });

  const handleClick = () => {
    verifyEmailMutation();
  };

  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 size={70} className="text-primary/75 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-y-4">
      {!admin ? (
        <p className="text-gray-950 font-semibold text-2xl sm:text-3xl">
          You Should be logged in to Verify your Email
        </p>
      ) : admin?.isEmailVerified ? (
        <p className="text-gray-950 font-semibold text-2xl sm:text-3xl">
          Your email is verified successfully!{" "}
          <Link
            to="/"
            className="text-primary block text-center hover:underline"
          >
            Back Home
          </Link>
        </p>
      ) : (
        <>
          <p className="text-gray-950 font-semibold text-2xl sm:text-3xl">
            Verify Your Email here
          </p>
          <Button
            type="button"
            disabled={isVerifying}
            onClick={handleClick}
            className="font-medium"
          >
            {isVerifying ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Verify"
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export default VerifyEmailPage;
