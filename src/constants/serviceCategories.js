export const SERVICE_CATEGORIES = [
  {
    value: "Cleaning",
    label: "Cleaning Services",
    icon: "🧹",
    description: "House cleaning, office cleaning, deep cleaning.",
  },
  {
    value: "Beauty & Wellness",
    label: "Beauty & Wellness",
    icon: "✨",
    description: "Haircuts, manicures, pedicures, facials, massage therapy, acupuncture, yoga instructors.",
  },
  {
    value: "Electrical",
    label: "Electrical Services",
    icon: "⚡",
    description: "Electrical work, wiring, fittings and power repairs.",
  },
  {
    value: "Plumbing",
    label: "Plumbing Services",
    icon: "🔧",
    description: "Plumbing fixes, pipe work, leak repair and water systems.",
  },
  {
    value: "Painting",
    label: "Painting Services",
    icon: "🎨",
    description: "Interior painting, exterior painting and finishing work.",
  },
  {
    value: "Home Repair",
    label: "Repair Services",
    icon: "🛠️",
    description: "Appliance repair, fixture repair and general home fixes.",
  },
  {
    value: "Tutoring",
    label: "Tutoring Services",
    icon: "📚",
    description: "Academic tutoring, language lessons, music lessons.",
  },
  {
    value: "Health and Fitness",
    label: "Health and Fitness",
    icon: "🏋️",
    description: "Personal training, nutritionists, physiotherapists.",
  },
  {
    value: "Childcare",
    label: "Childcare Services",
    icon: "🧸",
    description: "Babysitting, nanny services, daycare.",
  },
  {
    value: "Cooking",
    label: "Cooking Services",
    icon: "👨‍🍳",
    description: "Personal chefs, meal prep services, cooking classes.",
  },
  {
    value: "Elderly Care",
    label: "Elderly Care Services",
    icon: "❤️",
    description: "In-home care, companionship services, mobility assistance.",
  },
  {
    value: "Laundry",
    label: "Laundry Services",
    icon: "🧺",
    description: "Pickup and delivery laundry, dry cleaning.",
  },
];

export const SERVICE_CATEGORY_VALUES = SERVICE_CATEGORIES.map(({ value }) => value);

export const SERVICE_CATEGORY_OPTIONS = SERVICE_CATEGORIES.map(({ value, label }) => ({
  value,
  label,
}));

const SERVICE_CATEGORY_INDEX = new Map(
  SERVICE_CATEGORIES.flatMap((category) => [
    [category.value, category],
    [category.label, category],
  ])
);

export const getServiceCategoryMeta = (category) => SERVICE_CATEGORY_INDEX.get(category) || null;

export const getServiceCategoryDisplayName = (category) => getServiceCategoryMeta(category)?.label || category || "Service";

export const getServiceCategoryIcon = (category) => getServiceCategoryMeta(category)?.icon || "🔨";
