import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import { renderImageUrl } from "../../lib/actions";

const RenderImage: React.FC<{ token: string | null }> = ({ token }) => {
  const { data: renderImage, isPending } = useQuery({
    queryKey: ["render-image"],
    queryFn: () => {
      return renderImageUrl(token);
    },
  });

  return (
    <div className="w-ful h-80 flex items-center justify-center">
      {isPending ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 size={52} className="animate-spin text-primary/75" />
        </div>
      ) : (
        <img
          src={renderImage?.image}
          alt="image"
          className="max-w-full max-h-80 object-contain rounded-sm"
        />
      )}
    </div>
  );
};

export default RenderImage;
