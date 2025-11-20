import { Button } from "./ui/button";

function CheckoutButton() {
  return (
    <div>
      <form action="/api/checkout_sessions" method="POST">
        <section>
          <Button type="submit" role="link">
            Buy Ticket
          </Button>
        </section>
      </form>
    </div>
  );
}

export default CheckoutButton;
