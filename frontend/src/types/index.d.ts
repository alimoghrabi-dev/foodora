interface ICart {
  _id: string;
  userId: string;
  restaurantId: IRestaurant;
  cartItems: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface IUser {
  id: string;
  googleId: string;
  name: string;
  nickname: string;
  email: string;
  isEmailVerified: boolean;
  isAdmin: boolean;
  dateOfBirth: Date;
  phoneNumber: string;
  cartId: ICart[];
  createdAt: Date;
  updatedAt: Date;
}

interface Apply {
  _id: string;
  restaurantName: string;
  description: string;
  email: string;
  phoneNumber: string;
  address: string;
  isRejected: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IRestaurant {
  _id: string;
  name: string;
  email: string;
  description: string;
  isEmailVerified: boolean;
  password: string;
  address: string;
  phoneNumber: string;
  openingHours: string;
  deliveryTime: string;
  cuisine: string;
  coverImage: string;
  imageUrl: string;
  rating: number;
  latitude: number;
  longitude: number;
  isPublished: boolean;
  isOnSale: boolean;
  salePercentage: number;
  isClosed: boolean;
  isTimeout: boolean;
}

interface ICategory {
  _id: string;
  name: string;
  restaurantId: Schema.Types.ObjectId;
}

interface IItem {
  _id: string;
  name: string;
  description: string;
  restaurantId: Schema.Types.ObjectId;
  price: number;
  category: Schema.Types.ObjectId;
  coverImage: string;
  imageUrl: string;
  isOnSale: boolean;
  salePercentage: number;
  isOutOfStock: boolean;
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

interface IOrder {
  _id: string;
  userId: IUser;
  restaurantId: IRestaurant;
  orderStatus: string;
  orderNumber: string;
}
