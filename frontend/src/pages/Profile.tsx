import React from "react";
import EditProfileCredentialsForm from "../components/EditProfileCredentialsForm";
import EmailVerification from "../components/EmailVerification";
import PasswordChange from "../components/PasswordChange";
import { CircleAlert } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { dataCollection } from "../constants/constants";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../components/ui/button";
import { Sheet } from "../assets/icons/icons";

const Profile: React.FC = () => {
  return (
    <section className="w-full flex items-center justify-center gap-y-8 px-4 mt-28 sm:mt-20 pb-8">
      <div className="flex flex-col gap-y-6 w-[90%] sm:w-[70%] md:w-1/2 lg:w-1/3 items-start">
        <h2 className="text-gray-950 font-bold text-xl flex items-center gap-x-3">
          Your Profile{" "}
          <Dialog>
            <DialogTrigger>
              <CircleAlert size={22} className="text-primary" />
            </DialogTrigger>
            <DialogContent className="max-w-md md:max-w-xl lg:max-w-2xl rounded-2xl">
              <div className="w-full flex flex-col items-center justify-center gap-y-16">
                <img
                  src={Sheet}
                  alt="sheet"
                  className="size-36 object-contain"
                />
                <div className="w-full flex flex-col gap-y-6">
                  <div className="flex flex-col w-full items-start">
                    <p className="text-gray-950 font-semibold text-lg">
                      Data Collection
                    </p>
                    <p className="text-gray-900 font-medium text-sm">
                      Here's how we collect and store your personal data
                    </p>
                  </div>
                  <div className="flex flex-col gap-y-6 w-full">
                    {dataCollection.map((item) => (
                      <div
                        key={item.label}
                        className="w-full flex items-center gap-x-3.5"
                      >
                        <item.icon size={28} className="primary-text" />
                        <div className="flex flex-col">
                          <p className="font-semibold text-sm text-gray-950">
                            {item.label}
                          </p>
                          <p className="font-medium text-xs text-gray-900">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <DialogClose className="w-full flex justify-end">
                    <Button>Close</Button>
                  </DialogClose>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </h2>
        <EditProfileCredentialsForm />
        <div className="w-full h-px bg-black/15" />

        <h2 className="text-gray-950 font-bold text-xl">Email</h2>
        <EmailVerification />

        <div className="w-full h-px bg-black/15" />
        <h2 className="text-gray-950 font-bold text-xl">Password</h2>
        <PasswordChange />
      </div>
    </section>
  );
};

export default Profile;
