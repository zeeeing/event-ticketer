import Link from "next/link";
import { Button } from "./ui/button";

function OrderHistoryButton() {
  return (
    <div>
      <Button asChild variant="link">
        <Link href="/order_history">View your past orders</Link>
      </Button>
    </div>
  );
}

export default OrderHistoryButton;
