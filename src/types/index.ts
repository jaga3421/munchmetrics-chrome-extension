interface OrderDate {
  day: number;
  month: number;
  timeSlot: number;
  year: number;
}

interface Phone {
  isACD: boolean;
  isDirect: boolean;
  mobile_string: string;
  mobile_string_display: string;
  phone_string: string;
  phone_string_available: number;
}

interface Rating {
  aggregate_rating: string;
  has_fake_reviews: number;
  is_new: boolean;
  rating_color: string;
  rating_subtitle: string;
  rating_text: string;
  subtext: string;
  votes: string;
}

interface RatingOption {
  label: string;
  value: string;
}

interface RatingData {
  header: string;
  options: RatingOption[];
  selected: string;
}

interface Locality {
  addressString: string;
  cityId: number;
  directionTitle: string;
  directionUrl: string;
  localityName: string;
  localityUrl: string;
}

interface RestaurantInfo {
  establishment: any[];
  id: number;
  isBookmarked: boolean;
  locality: Locality;
  name: string;
  phone: Phone;
  rating: Rating;
  ratingData: RatingData;
  resPath: string;
  resUrl: string;
  thumb: string;
}

interface SummarySection {
  crystalPageUrl: string;
  shouldShowModal: boolean;
  title: string;
}

interface Order {
  bgColorV2: {
    tint: string;
    type: string;
  };
  deliveryDetails: {
    deliveryAddress: string;
    deliveryLabel: string;
    deliveryMessage: string;
    deliveryStatus: number;
  };
  dishString: string;
  dishes: string[];
  hashId: string;
  isFavourite: number;
  isOrderTrackable: number;
  orderDate: OrderDate;
  orderId: number;
  paymentStatus: number;
  rating: number | string; // Replace with a specific type if available
  ratingV2: string;
  reOrderUrl: string;
  resInfo: RestaurantInfo;
  showReorderButton: boolean;
  status: number;
  summarySection: SummarySection;
  totalCost: string;
}

interface ReviewSummary {
  total_orders: number;
  total_cost_spent: string;
  most_expensive_order: {
    order: Order;
    cost: number;
  };
  least_expensive_order: {
    order: Order;
    cost: number;
  };
  average_order_cost: string;
  top_dishes: {
    name: string;
    count: number;
  }[];
  top_restaurants: {
    resInfo: {
      establishment: string[];
      id: number;
      isBookmarked: boolean;
      locality: {
        addressString: string;
        cityId: number;
        directionTitle: string;
        directionUrl: string;
        localityName: string;
        localityUrl: string;
      };
      name: string;
      phone: {
        isACD: boolean;
        isDirect: boolean;
        mobile_string: string;
        mobile_string_display: string;
        phone_string: string;
        phone_string_available: number;
      };
      rating: {
        aggregate_rating: string;
        has_fake_reviews: number;
        is_new: boolean;
        rating_color: string;
        rating_subtitle: string;
        rating_text: string;
        subtext: string;
        votes: string;
      };
      ratingData: {
        header: string;
        options: {
          label: string;
          value: string;
        }[];
        selected: string;
      };
      resPath: string;
      resUrl: string;
      thumb: string;
    };
    count: number;
  }[];
  top_cities: {
    name: string;
    count: number;
  }[];
  all_cities: string[];
  all_years: number[];
}

export { Order, ReviewSummary };
