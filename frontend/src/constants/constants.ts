import { FaCrown, FaRegUser } from "react-icons/fa6";
import { BiSpreadsheet } from "react-icons/bi";
import { IoTicketOutline } from "react-icons/io5";
import { AiOutlineMail } from "react-icons/ai";
import { FaPhoneAlt } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { TbMessageShare } from "react-icons/tb";

export const dropdownMenuLinks = [
  {
    label: "Become a PRO",
    href: "/subscription",
    icon: FaCrown,
  },
  {
    label: "Orders & reordering",
    href: "/orders",
    icon: BiSpreadsheet,
  },
  {
    label: "Profile",
    href: "/account",
    icon: FaRegUser,
  },
  {
    label: "Vouchers",
    href: "/vouchers",
    icon: IoTicketOutline,
  },
];

export const subscriptionOffers = [
  {
    name: "Monthly",
    price: 9.99,
  },
  {
    name: "Half-yearly",
    price: 49.99,
    offer: "10%",
  },
  {
    name: "Yearly",
    price: 89.99,
    offer: "30%",
  },
];

export const dataCollection = [
  {
    label: "Name",
    description: "Required to create your profile and start using our services",
    icon: FaRegUser,
  },
  {
    label: "Email address",
    description:
      "Required to create your profile and use our services. This is a way to verify your identity when you log in.",
    icon: AiOutlineMail,
  },
  {
    label: "Mobile number",
    description:
      "Required to create your profile and use our services. This is a way to verify your identity when you log in.",
    icon: FaPhoneAlt,
  },
];

export const adminRoutes = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: MdSpaceDashboard,
  },
  {
    label: "Applies",
    href: "/admin/dashboard/applies",
    icon: TbMessageShare,
  },
];
