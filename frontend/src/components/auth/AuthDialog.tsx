import React, { useState } from "react";
import { buttonVariants } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import SignupForm from "./SignupForm";
import { ArrowLeft, X } from "lucide-react";
import LoginForm from "./LoginForm";

const AuthDialog: React.FC = () => {
  const [isSignupActive, setIsSignupActive] = useState<boolean>(false);
  const [isLoginActive, setIsLoginActive] = useState<boolean>(false);

  return (
    <>
      <Dialog open={isLoginActive} onOpenChange={setIsLoginActive}>
        <DialogTrigger asChild>
          <p
            className={buttonVariants({
              className:
                "primary-text bg-white ring-1 font-semibold ring-primary h-9 hover:bg-primary hover:text-white rounded-lg text-[16px] cursor-pointer",
            })}
          >
            Log in
          </p>
        </DialogTrigger>
        <DialogContent className="rounded-2xl max-w-[400px] sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              <div className="w-full flex items-center justify-end">
                <DialogClose className="p-1.5 rounded-full border border-black/10 bg-whute shadow-md hover:bg-primary/10 transition ease-in duration-150">
                  <X size={21} className="primary-text" />
                </DialogClose>
              </div>
            </DialogTitle>
          </DialogHeader>
          <LoginForm
            setIsLoginActive={setIsLoginActive}
            setIsSignupActive={setIsSignupActive}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={isSignupActive} onOpenChange={setIsSignupActive}>
        <DialogTrigger asChild>
          <p
            className={buttonVariants({
              className:
                "rounded-lg text-[16px] ring-1 ring-primary hover:opacity-80 cursor-pointer h-9",
            })}
          >
            Sign up
          </p>
        </DialogTrigger>
        <DialogContent
          aria-describedby="description"
          className="rounded-2xl max-w-[385px] sm:max-w-[450px]"
        >
          <DialogHeader>
            <DialogTitle>
              <div className="w-full flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsSignupActive(false);
                    setIsLoginActive(true);
                  }}
                  className="p-1.5 rounded-full hover:bg-primary/10 transition ease-in duration-150"
                >
                  <ArrowLeft size={23} className="primary-text" />
                </button>

                <DialogClose className="p-1.5 rounded-full border border-black/10 bg-whute shadow-md hover:bg-primary/10 transition ease-in duration-150">
                  <X size={21} className="primary-text" />
                </DialogClose>
              </div>
            </DialogTitle>
          </DialogHeader>
          <SignupForm
            setIsLoginActive={setIsLoginActive}
            setIsSignupActive={setIsSignupActive}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthDialog;
