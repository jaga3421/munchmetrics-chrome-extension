// Shared number/currency formatting + cost extraction.

const inrInt = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const inrPlain = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

function toNumber(v) {
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(/[₹,\s]/g, ''));
    return isFinite(n) ? n : 0;
  }
  return 0;
}

function fmtInt(v) {
  return inrPlain.format(toNumber(v));
}

function fmtINR(v) {
  return `₹${inrInt.format(toNumber(v))}`;
}

// Extract a per-order rupee amount from either a Zomato or Swiggy order shape.
function orderCost(order) {
  if (!order) return 0;
  if (typeof order.order_total === 'number') return order.order_total;
  if (typeof order.order_total === 'string') return toNumber(order.order_total);
  if (order.totalCost !== undefined) return toNumber(order.totalCost);
  return 0;
}

export { fmtInt, fmtINR, toNumber, orderCost };
