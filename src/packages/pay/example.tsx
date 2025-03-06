import { PaymentDialog } from "./components";

export default function Example() {
    return (
        <PaymentDialog price={100} productId="123" onSuccess={() => { }} onError={() => { }} />
    )
}