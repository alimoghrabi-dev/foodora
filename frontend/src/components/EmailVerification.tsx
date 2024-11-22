import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAuth } from "../context/UseAuth";
import { Check, X } from "lucide-react";

const EmailVerification: React.FC = () => {
  const { user } = useAuth();

  const [inputValue, setInputValue] = useState<string | undefined>(
    user?.email || ""
  );

  useEffect(() => {
    setInputValue(user?.email);
  }, [user?.email]);

  return (
    <div className="w-full space-y-3">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter your email"
        className="w-full border-black/15 focus-visible:border-primary outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
      />
      {user?.isEmailVerified ? (
        <div className="w-fit rounded-full flex items-center gap-x-1.5 px-2 py-1 bg-blue-600/25">
          <span className="rounded-full p-0.5 bg-blue-800">
            <Check size={12} className="text-white" />
          </span>

          <p className="text-xs font-medium text-blue-800">Verified</p>
        </div>
      ) : (
        <div className="w-fit rounded-full flex items-center gap-x-1.5 px-2 py-1 bg-yellow-400/25">
          <span className="rounded-full p-0.5 bg-yellow-500">
            <X size={12} className="text-white" />
          </span>

          <p className="text-xs font-medium text-yellow-500">Unverified</p>
        </div>
      )}
      <Button
        disabled={!inputValue || inputValue === user?.email}
        className="rounded-lg font-semibold disabled:bg-neutral-600/75"
      >
        Save
      </Button>
    </div>
  );
};

export default EmailVerification;
