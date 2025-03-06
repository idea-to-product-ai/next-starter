import Stripe from "stripe";
import { NextResponse } from "next/server";
import { Order, Subscription, Payment } from "@/orm/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // 从 Stripe Dashboard 获取

const plans = {
  '1': 30,
  '2': 365,
  '3': 365 * 100,
}

export async function POST(req) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook 验证失败: ${err.message}` }, { status: 400 });
  }
  if (event.type === "charge.succeeded") {
    const session = event.data.object;
    console.log(`✅ 订单 ${session.id} 已支付`);
    // 查询订单信息
    const { data: orderData, error: orderError } = await Order.getOrder(session.metadata.orderId);

    if (orderError || !orderData) {
      console.error('查询订单失败:', orderError);
      return NextResponse.json({ error: '查询订单失败' }, { status: 500 });
    }

    const { data: subscriptionData, error: subscriptionError } = await Subscription.createSubscription({
      userId: orderData.user_id,
      productId: orderData.product_id,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + plans[orderData.product_id] * 24 * 60 * 60 * 1000),
    });

    if (subscriptionError) {
      console.error('创建订阅失败:', subscriptionError);
      return NextResponse.json({ error: '创建订阅失败' }, { status: 500 });
    }

    const { data: paymentData, error: paymentError } = await Payment.createPayment({
      orderId: session.metadata.orderId,
      amount: session.amount,
      currency: session.currency,
      status: 'succeeded',
      stripePaymentIntentId: session.id,
    });

    if (paymentError) {
      console.error('创建支付记录失败:', paymentError);
      return NextResponse.json({ error: '创建支付记录失败' }, { status: 500 });
    }

    const { data: updateOrderData, error: updateOrderError } = await Order.updateOrder(session.metadata.orderId, {
      status: 'paid',
    });

    if (updateOrderError) {
      console.error('更新订单状态失败:', updateOrderError);
      return NextResponse.json({ error: '更新订单状态失败' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
