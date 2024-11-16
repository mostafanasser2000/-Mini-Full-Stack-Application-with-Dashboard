import { format } from "date-fns";

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};
export const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  return format(new Date(dateString), "MMM d, yyyy h:mm a");
};
