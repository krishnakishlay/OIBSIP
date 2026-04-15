export const PIZZAS = [
  { id: 1, name: "Margherita",      emoji: "🧀", desc: "Classic tomato base, fresh mozzarella, basil leaves.",        price: 249, type: "veg",    badge: "Classic"    },
  { id: 2, name: "BBQ Chicken",     emoji: "🍗", desc: "Smoky BBQ sauce, grilled chicken, red onions, jalapeños.",    price: 399, type: "nonveg", badge: "Bestseller" },
  { id: 3, name: "Farmhouse",       emoji: "🌽", desc: "Capsicum, onions, mushrooms, corn, black olives.",            price: 299, type: "veg"                        },
  { id: 4, name: "Pepperoni Feast", emoji: "🔥", desc: "Double pepperoni, mozzarella, oregano.",                      price: 449, type: "nonveg", badge: "Spicy"      },
  { id: 5, name: "Paneer Tikka",    emoji: "🧅", desc: "Marinated paneer, capsicum, onion, tikka sauce.",             price: 329, type: "veg"                        },
  { id: 6, name: "Chicken Overload",emoji: "🍖", desc: "Grilled chicken strips, jalapeños, mushrooms, double cheese.", price: 479, type: "nonveg", badge: "New"       },
];

export const BUILDER_STEPS = [
  {
    id: "base", label: "Choose Your Base", subtitle: "5 options",
    options: [
      { name: "Thin Crust",     icon: "🫓", price: 0  },
      { name: "Thick Crust",    icon: "🍞", price: 20 },
      { name: "Wheat Crust",    icon: "🌾", price: 30 },
      { name: "Cauliflower",    icon: "🥦", price: 50 },
      { name: "Stuffed Crust",  icon: "🧀", price: 60 },
    ],
  },
  {
    id: "sauce", label: "Pick Your Sauce", subtitle: "5 options",
    options: [
      { name: "Classic Tomato", icon: "🍅", price: 0  },
      { name: "BBQ Smoke",      icon: "🫙", price: 20 },
      { name: "Pesto Herb",     icon: "🌿", price: 30 },
      { name: "Tikka Masala",   icon: "🌶️", price: 20 },
      { name: "White Garlic",   icon: "🧄", price: 25 },
    ],
  },
  {
    id: "cheese", label: "Select Cheese", subtitle: "Premium options",
    options: [
      { name: "Mozzarella",        icon: "🧀", price: 0  },
      { name: "Cheddar",           icon: "🟡", price: 30 },
      { name: "Parmesan",          icon: "🧫", price: 50 },
      { name: "Vegan Cheese",      icon: "🌱", price: 40 },
      { name: "Double Mozzarella", icon: "💛", price: 60 },
    ],
  },
  {
    id: "veggies", label: "Add Veggies", subtitle: "Pick as many as you like", multi: true,
    options: [
      { name: "Onions",    icon: "🧅", price: 20 },
      { name: "Capsicum",  icon: "🫑", price: 20 },
      { name: "Mushrooms", icon: "🍄", price: 30 },
      { name: "Corn",      icon: "🌽", price: 25 },
      { name: "Olives",    icon: "🫒", price: 35 },
      { name: "Jalapeños", icon: "🌶️", price: 25 },
    ],
  },
];

export const TESTIMONIALS = [
  { name: "Priya S.",  initial: "P", rating: 5, text: "Absolutely the best pizza I've had in years. The custom builder is so fun!",       meta: "Mumbai · 50+ orders"    },
  { name: "Arjun K.",  initial: "A", rating: 5, text: "The BBQ Chicken pizza is legendary. Crispy crust, delivered HOT every time.",       meta: "Delhi · 30+ orders"     },
  { name: "Sneha M.",  initial: "S", rating: 5, text: "Love that I can build exactly what I want. The wheat crust with pesto is my go-to.", meta: "Bangalore · 20+ orders" },
  { name: "Rahul T.",  initial: "R", rating: 5, text: "The stuffed crust option is a game changer! Real-time order tracking is great.",    meta: "Hyderabad · 15+ orders" },
  { name: "Aarti V.",  initial: "A", rating: 5, text: "Finally a pizza place that takes veg options seriously. The Farmhouse is incredible!",meta: "Pune · 40+ orders"      },
  { name: "Dev P.",    initial: "D", rating: 5, text: "Ordered 10 custom pizzas for team lunch — all delivered together and piping hot!",   meta: "Chennai · 25+ orders"   },
];

export const BASE_PIZZA_PRICE = 199;