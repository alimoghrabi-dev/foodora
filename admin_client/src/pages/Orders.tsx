import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { TiThSmall } from "react-icons/ti";
import { PiCookingPot } from "react-icons/pi";
import { RiHandbagLine } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
import { useAuth } from "../context/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getRestaurantOrders } from "../lib/actions";
import { IoBagCheck } from "react-icons/io5";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { cn, formatCreatedAt, formatPrice } from "../lib/utils";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Orders: React.FC = () => {
  const { token } = useAuth();

  const navigate = useNavigate();

  const {
    data: orders,
    isPending,
    isLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getRestaurantOrders(token);
    },
  });

  return (
    <div className="w-full flex items-start justify-start gap-4 py-5 px-8">
      <div className="w-full flex flex-col gap-y-2.5">
        <h2 className="text-primary font-bold text-2xl">Orders</h2>
        <hr className="bg-primary/10" />
        <Tabs defaultValue="all" className="w-full flex items-start gap-x-4">
          <TabsList className="w-fit flex flex-col gap-y-2.5">
            <TabsTrigger
              value="all"
              className="px-4 py-2.5 rounded-full flex items-center justify-between gap-x-10"
            >
              <div className="flex items-center gap-x-2">
                <TiThSmall size={18} />
                <p className="font-semibold text-base">All</p>
              </div>

              <p className="text-base font-semibold">
                {isPending || isLoading ? (
                  <Loader2
                    size={12}
                    className="text-neutral-500 animate-spin"
                  />
                ) : (
                  orders?.orders?.length
                )}
              </p>
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="px-4 py-2.5 rounded-full flex items-center justify-between gap-x-10"
            >
              <div className="flex items-center gap-x-2">
                <RiHandbagLine size={18} />
                <p className="font-semibold text-base">New</p>
              </div>
              <p className="text-base font-semibold">
                {isPending || isLoading ? (
                  <Loader2
                    size={12}
                    className="text-neutral-500 animate-spin"
                  />
                ) : (
                  orders?.pendingOrdersLength
                )}
              </p>
            </TabsTrigger>
            <TabsTrigger
              value="preparing"
              className="px-4 py-2.5 rounded-full flex items-center justify-between gap-x-10"
            >
              <div className="flex items-center gap-x-2">
                <PiCookingPot size={18} />
                <p className="font-semibold text-base">Preparing</p>
              </div>
              <p className="text-base font-semibold">
                {isPending || isLoading ? (
                  <Loader2
                    size={12}
                    className="text-neutral-500 animate-spin"
                  />
                ) : (
                  orders?.acceptedOrdersLength
                )}
              </p>
            </TabsTrigger>
            <TabsTrigger
              value="ready"
              className="px-4 py-2.5 rounded-full flex items-center justify-between gap-x-10"
            >
              <div className="flex items-center gap-x-2">
                <IoBagCheck size={18} />
                <p className="font-semibold text-base">Ready</p>
              </div>

              <p className="text-base font-semibold">
                {isPending || isLoading ? (
                  <Loader2
                    size={12}
                    className="text-neutral-500 animate-spin"
                  />
                ) : (
                  orders?.readyOrdersLength
                )}
              </p>
            </TabsTrigger>
            <TabsTrigger
              value="delivering"
              className="px-4 py-2.5 rounded-full flex items-center justify-between"
            >
              <div className="flex items-center gap-x-2">
                <TbTruckDelivery size={18} />
                <p className="font-semibold text-base">Delivering</p>
              </div>

              <p className="text-base font-semibold">
                {isPending || isLoading ? (
                  <Loader2
                    size={12}
                    className="text-neutral-500 animate-spin"
                  />
                ) : (
                  orders?.deliveringOrdersLength
                )}
              </p>
            </TabsTrigger>
          </TabsList>

          <div className="w-px h-[330px] bg-primary/10" />
          <TabsContent value="all" className="flex-1">
            <Table>
              <TableCaption className="text-neutral-700 font-semibold text-base">
                {orders?.orders?.length === 0
                  ? "No orders found."
                  : "A list of your orders."}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">#Order</TableHead>
                  <TableHead className="w-[150px]">Customer</TableHead>
                  <TableHead className="w-[150px]">Status</TableHead>
                  <TableHead className="w-[150px]">Amount</TableHead>
                  <TableHead className="text-right">Ordered at</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.orders?.map((order: Order) => (
                  <TableRow
                    key={order._id}
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <TableCell className="font-semibold text-[13px]">
                      #{order.orderNumber}
                    </TableCell>
                    <TableCell className="font-medium text-[13px]">
                      {order.userId.name}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-sm font-bold capitalize",
                        order.orderStatus === "pending"
                          ? "text-yellow-500"
                          : order.orderStatus === "accepted"
                          ? "text-green-500"
                          : "text-primary"
                      )}
                    >
                      {order.orderStatus}
                    </TableCell>
                    <TableCell className="font-semibold text-primary text-[14px]">
                      {formatPrice(order.totalPrice)}
                    </TableCell>

                    <TableCell className="text-right font-semibold text-[14px]">
                      {formatCreatedAt(order.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="new" className="flex-1">
            <Table>
              <TableCaption className="text-neutral-700 font-semibold text-base">
                {orders?.newOrders?.length === 0
                  ? "No orders found."
                  : "A list of your orders."}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">#Order</TableHead>
                  <TableHead className="w-[150px]">Customer</TableHead>
                  <TableHead className="w-[150px]">Status</TableHead>
                  <TableHead className="w-[150px]">Amount</TableHead>
                  <TableHead className="text-right">Ordered at</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.newOrders?.map((order: Order) => (
                  <TableRow
                    key={order._id}
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <TableCell className="font-semibold text-[13px]">
                      #{order.orderNumber}
                    </TableCell>
                    <TableCell className="font-medium text-[13px]">
                      {order.userId.name}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-sm font-bold capitalize",
                        order.orderStatus === "pending"
                          ? "text-yellow-500"
                          : order.orderStatus === "accepted"
                          ? "text-green-500"
                          : "text-primary"
                      )}
                    >
                      {order.orderStatus}
                    </TableCell>
                    <TableCell className="font-semibold text-primary text-[14px]">
                      {formatPrice(order.totalPrice)}
                    </TableCell>

                    <TableCell className="text-right font-semibold text-[14px]">
                      {formatCreatedAt(order.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="preparing" className="flex-1">
            <Table>
              <TableCaption className="text-neutral-700 font-semibold text-base">
                {orders?.preparingOrders?.length === 0
                  ? "No orders found."
                  : "A list of your orders."}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">#Order</TableHead>
                  <TableHead className="w-[150px]">Customer</TableHead>
                  <TableHead className="w-[150px]">Status</TableHead>
                  <TableHead className="w-[150px]">Amount</TableHead>
                  <TableHead className="text-right">Ordered at</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.preparingOrders?.map((order: Order) => (
                  <TableRow
                    key={order._id}
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <TableCell className="font-semibold text-[13px]">
                      #{order.orderNumber}
                    </TableCell>
                    <TableCell className="font-medium text-[13px]">
                      {order.userId.name}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-sm font-bold capitalize",
                        order.orderStatus === "pending"
                          ? "text-yellow-500"
                          : order.orderStatus === "accepted"
                          ? "text-green-500"
                          : "text-primary"
                      )}
                    >
                      {order.orderStatus}
                    </TableCell>
                    <TableCell className="font-semibold text-primary text-[14px]">
                      {formatPrice(order.totalPrice)}
                    </TableCell>

                    <TableCell className="text-right font-semibold text-[14px]">
                      {formatCreatedAt(order.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="ready" className="flex-1">
            <Table>
              <TableCaption className="text-neutral-700 font-semibold text-base">
                {orders?.readyOrders?.length === 0
                  ? "No orders found."
                  : "A list of your orders."}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">#Order</TableHead>
                  <TableHead className="w-[150px]">Customer</TableHead>
                  <TableHead className="w-[150px]">Status</TableHead>
                  <TableHead className="w-[150px]">Amount</TableHead>
                  <TableHead className="text-right">Ordered at</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.readyOrders?.map((order: Order) => (
                  <TableRow
                    key={order._id}
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <TableCell className="font-semibold text-[13px]">
                      #{order.orderNumber}
                    </TableCell>
                    <TableCell className="font-medium text-[13px]">
                      {order.userId.name}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-sm font-bold capitalize",
                        order.orderStatus === "pending"
                          ? "text-yellow-500"
                          : order.orderStatus === "accepted"
                          ? "text-green-500"
                          : "text-primary"
                      )}
                    >
                      {order.orderStatus}
                    </TableCell>
                    <TableCell className="font-semibold text-primary text-[14px]">
                      {formatPrice(order.totalPrice)}
                    </TableCell>

                    <TableCell className="text-right font-semibold text-[14px]">
                      {formatCreatedAt(order.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="delivering" className="flex-1">
            <Table>
              <TableCaption className="text-neutral-700 font-semibold text-base">
                {orders?.deliveringOrders?.length === 0
                  ? "No orders found."
                  : "A list of your orders."}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">#Order</TableHead>
                  <TableHead className="w-[150px]">Customer</TableHead>
                  <TableHead className="w-[150px]">Status</TableHead>
                  <TableHead className="w-[150px]">Amount</TableHead>
                  <TableHead className="text-right">Ordered at</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.deliveringOrders?.map((order: Order) => (
                  <TableRow
                    key={order._id}
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <TableCell className="font-semibold text-[13px]">
                      #{order.orderNumber}
                    </TableCell>
                    <TableCell className="font-medium text-[13px]">
                      {order.userId.name}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-sm font-bold capitalize",
                        order.orderStatus === "pending"
                          ? "text-yellow-500"
                          : order.orderStatus === "accepted"
                          ? "text-green-500"
                          : "text-primary"
                      )}
                    >
                      {order.orderStatus}
                    </TableCell>
                    <TableCell className="font-semibold text-primary text-[14px]">
                      {formatPrice(order.totalPrice)}
                    </TableCell>

                    <TableCell className="text-right font-semibold text-[14px]">
                      {formatCreatedAt(order.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Orders;
