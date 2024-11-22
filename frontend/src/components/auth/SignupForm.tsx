import React, { useState } from "react";
import { IoMdMail } from "react-icons/io";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { checkIfEmailAlreadyInUse } from "../../lib/actions";
import SignupNextStageForm from "./SignupNextStageForm";
import { Loader2 } from "lucide-react";

const emailSchema = z.string().email();

const SignupForm: React.FC<{
  setIsLoginActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignupActive: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsLoginActive, setIsSignupActive }) => {
  const [isOnNextStage, setIsOnNextStage] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [errorInput, setErrorInput] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (email: string) => {
      await checkIfEmailAlreadyInUse(email);
    },
    onSuccess: () => {
      setIsOnNextStage(true);
    },
    onError: () => {
      setErrorInput("Email already in use");
    },
  });

  const handleSubmit = () => {
    if (!emailSchema.safeParse(input).success) {
      setErrorInput("Please enter a valid email");
      return;
    } else {
      setErrorInput("");
    }

    mutate(input);
  };

  return (
    <div className="w-full flex flex-col gap-y-4">
      {!isOnNextStage ? (
        <>
          <div className="px-4 flex items-start">
            <div className="bg-gray-200 rounded-md p-1.5 flex flex-col">
              <IoMdMail size={42} className="text-neutral-700" />
              <div className="w-full h-2 bg-primary flex items-center justify-center rounded-full" />
            </div>
          </div>

          <h3 className="text-gray-900 font-bold text-2xl">
            {"What's your email ?"}
          </h3>
          <Input
            value={input}
            onChange={handleChange}
            className="w-full rounded-md border-none ring-1 py-5 ring-gray-900/20 text-base focus-visible:ring-1 focus-visible:ring-gray-900/85 outline-none focus-visible:ring-offset-0 transition-all"
            placeholder="Email"
          />
        </>
      ) : (
        <SignupNextStageForm
          email={input}
          setIsLoginActive={setIsLoginActive}
          setIsSignupActive={setIsSignupActive}
        />
      )}

      {errorInput && (
        <p className="text-center font-semibold text-sm primary-text">
          {errorInput}
        </p>
      )}
      {!isOnNextStage && (
        <Button
          onClick={handleSubmit}
          disabled={!input || isPending}
          type="button"
          className="rounded-md py-6 disabled:bg-black/60"
        >
          {isPending ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            "Continue"
          )}
        </Button>
      )}
    </div>
  );
};

export default SignupForm;
