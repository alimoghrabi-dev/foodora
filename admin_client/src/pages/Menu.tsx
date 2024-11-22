import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMenuItems, removeDiscount } from "../lib/actions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Loader2 } from "lucide-react";
import { cn, formatPrice } from "../lib/utils";
import { Button, buttonVariants } from "../components/ui/button";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Edit } from "../assets";
import { MdDiscount } from "react-icons/md";
import StoreDiscountHandler from "../components/StoreDiscountHandler";
import { useToast } from "../components/ui/use-toast";

const Menu: React.FC = () => {
  const { toast } = useToast();
  const { token, admin } = useAuth();

  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: items, isPending } = useQuery({
    queryKey: ["menu-items"],
    queryFn: () => {
      return getMenuItems(token);
    },
  });

  const { mutate: removeDiscountMutation, isPending: isRemovingDiscount } =
    useMutation({
      mutationFn: async () => {
        await removeDiscount(token);
      },
      onSuccess: () => {
        setIsOpen(false);

        toast({
          title: "Discount Removed",
        });

        queryClient.invalidateQueries({ queryKey: ["admin-status"] });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to apply discount.",
        });
      },
    });

  if (isPending) {
    return (
      <div className="w-full flex items-center justify-center pt-28">
        <Loader2 size={68} className="text-primary opacity-70 animate-spin" />
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col gap-y-4 p-5">
      <div className="w-full flex items-center justify-end gap-x-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            className={cn(
              "flex items-center gap-x-2 hover:opacity-85 transition duration-200",
              admin?.isOnSale ? "text-red-500" : "text-primary"
            )}
          >
            <MdDiscount size={17} className="mt-0.5" />
            {admin?.isOnSale ? "Remove Discount" : "Apply Discount"}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {admin?.isOnSale
                  ? "Are you sure you want to turn off discount ?"
                  : "Put the discount percentage here."}
              </DialogTitle>
            </DialogHeader>
            {admin?.isOnSale ? (
              <div className="w-full flex gap-x-2 mt-2">
                <DialogClose
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full",
                  })}
                >
                  Cancel
                </DialogClose>
                <Button
                  variant={"destructive"}
                  disabled={isRemovingDiscount}
                  onClick={() => removeDiscountMutation()}
                  className="w-full"
                >
                  {isRemovingDiscount ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </div>
            ) : (
              <StoreDiscountHandler token={token} setIsOpen={setIsOpen} />
            )}
          </DialogContent>
        </Dialog>
        <Link
          to="/menu/create-category"
          className={buttonVariants({ variant: "outline" })}
        >
          Create Category
        </Link>
        <Link to="/menu/add" className={buttonVariants()}>
          Create Item
        </Link>
      </div>
      <div className="w-full h-px bg-black/10" />

      {items?.length === 0 ? (
        <div className="w-full flex items-center justify-center py-4 text-gray-950 font-semibold text-base sm:text-[18px]">
          You have no items in your menu yet.
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your menu items.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Index</TableHead>
              <TableHead>Showcase</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                Price{" "}
                {admin?.isOnSale && `(Discounted - ${admin?.salePercentage}%)`}
              </TableHead>
              <TableHead className="text-right">Edit</TableHead>
            </TableRow>
          </TableHeader>
          {items?.map((item: Item, index: number) => (
            <TableBody className="relative">
              {item?.isOutOfStock && (
                <div className="absolute inset-y-0 inset-x-16 flex items-center bg-white/50 justify-center z-10">
                  <p className="bg-white text-xl font-bold text-red-500">
                    - Out of Stock -
                  </p>
                </div>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <TableRow key={index}>
                    <TableCell className="font-semibold">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <img
                        src={item?.imageUrl}
                        alt={`image-${index + 1}`}
                        className="w-28 h-14 object-cover rounded-sm"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item?.name}</TableCell>
                    <TableCell className="font-medium">
                      {item?.category?.name}
                    </TableCell>
                    <TableCell className="font-medium">
                      {admin?.isOnSale ? (
                        <div className="flex gap-x-1.5">
                          <p className="line-through">
                            {formatPrice(item?.price)}
                          </p>
                          <p className="text-red-500 font-semibold">
                            {formatPrice(
                              item?.price -
                                (item?.price * admin?.salePercentage) / 100
                            )}
                          </p>
                        </div>
                      ) : (
                        formatPrice(item?.price)
                      )}
                    </TableCell>
                    <TableCell className="flex items-center justify-end">
                      <Link
                        to={`/menu/item/edit/${item?._id}`}
                        className="w-6 h-6 mt-3.5"
                      >
                        <img
                          src={Edit}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          alt="edit"
                          className="w-full h-full object-contain cursor-pointer hover:opacity-85 transition-all"
                        />
                      </Link>
                    </TableCell>
                  </TableRow>
                </DialogTrigger>
                <DialogContent className="max-w-md md:max-w-lg lg:max-w-2xl rounded-lg">
                  <DialogHeader className="mb-2.5">
                    <DialogTitle className="text-gray-950 font-semibold text-2xl">
                      {item?.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="w-full flex items-start gap-x-3">
                    <img
                      src={item?.imageUrl}
                      alt="image"
                      className="max-w-48 max-h-32 object-contain rounded-sm"
                    />
                    <div className="flex flex-col justify-between h-full py-0.5 gap-y-4">
                      <p className="hidden md:block text-sm font-medium text-neutral-700">
                        {item?.description}
                      </p>
                      <span className="flex flex-col">
                        <p className="text-[13px] font-semibold text-gray-950">
                          Category: {item?.category?.name}
                        </p>
                        <p className="text-base font-bold text-primary">
                          {formatPrice(item?.price)}
                        </p>
                      </span>
                    </div>
                  </div>
                  <p className="block md:hidden text-sm font-medium text-neutral-700">
                    {item?.description}
                  </p>
                </DialogContent>
              </Dialog>
            </TableBody>
          ))}
        </Table>
      )}
    </section>
  );
};

export default Menu;
