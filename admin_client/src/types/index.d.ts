interface IOpeningHours {
  [key: string]: { opening: string; closing: string };
}

interface IAdmin {
  _id: string;
  name: string;
  email: string;
  description: string;
  isEmailVerified: boolean;
  password: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  openingHours: IOpeningHours;
  deliveryTime: string;
  cuisine: string;
  coverImage: string;
  imageUrl: string;
  isPublished: boolean;
  isOnSale: boolean;
  salePercentage: number;
  rating: number;
  isClosed: boolean;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  restaurantId: string;
  items: Item[];
}

interface Item {
  _id: string;
  name: string;
  description: string;
  restaurantId: string;
  price: number;
  category: Category;
  coverImage: string;
  imageUrl: string | undefined;
  isOutOfStock: boolean;
}

interface Order {
  _id: string;
  userId: IAdmin;
  orderNumber: number;
  orderStatus: string;
  totalPrice: number;
  createdAt: Date;
}

interface ICartItem {
  _id: string;
  userId: string;
  cartId: ICart;
  itemId: IItem;
  price: number;
  quantity: number;
  note: string | null;
}
