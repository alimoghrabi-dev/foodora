import React from "react";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";
import { Check, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "../components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishStore } from "../lib/actions";
import { useToast } from "../components/ui/use-toast";
import GoogleMapEmbed from "../components/GoogleMapEmbed";

const Home: React.FC = () => {
  const { admin, token, isPending } = useAuth();
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const isAdminInfoIncomplete =
    !admin?.deliveryTime ||
    !admin?.cuisine ||
    !admin?.coverImage ||
    !admin?.address ||
    !admin?.latitude ||
    !admin?.longitude ||
    !admin?.isEmailVerified ||
    !admin?.description ||
    !admin?.phoneNumber;

  const { mutate: publishStoreMutation, isPending: isPublishing } = useMutation(
    {
      mutationFn: async () => {
        await publishStore(token);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-status"] });

        toast({
          title: "Store published successfully",
          description: "Now people can order from your store!",
          variant: "default",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Something went wrong while publishing store",
          variant: "destructive",
        });
      },
    }
  );

  const handleClick = () => {
    publishStoreMutation();
  };

  return (
    <div>
      {isPending ? null : isAdminInfoIncomplete ? (
        <div className="w-full bg-primary/50 flex items-center justify-center gap-x-4 py-4">
          <TriangleAlert size={24} className="text-white" />
          <h3 className="text-white font-medium text-base">
            Please complete your admin information to publish your store.
          </h3>
          <Link
            to="/info"
            className="text-white font-semibold text-base border border-white px-4 py-1.5 rounded-md hover:bg-white hover:text-primary/50 transition-all"
          >
            Complete your store
          </Link>
        </div>
      ) : !admin?.isPublished ? (
        <div className="w-full bg-primary/50 flex items-center justify-center gap-x-4 py-4">
          <Check size={24} className="text-white" />
          <h3 className="text-white font-medium text-base">
            Now you can publish your store.
          </h3>
          <Button
            type="button"
            onClick={handleClick}
            disabled={isPublishing}
            className="text-white bg-transparent h-9 font-semibold text-base border border-white px-4 py-1.5 rounded-md hover:bg-white hover:text-primary/50 transition-all"
          >
            {isPublishing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Publish"
            )}
          </Button>
        </div>
      ) : null}
      <div className="w-full p-6">
        {admin?.latitude && admin?.longitude && (
          <GoogleMapEmbed
            latitude={admin?.latitude}
            longitude={admin?.longitude}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
