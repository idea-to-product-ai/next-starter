// pages/api/create-payment-intent.js
import Stripe from "stripe";
import { NextRequest, NextResponse } from 'next/server';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');


export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Method Not Allowed" });
}

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, orderId } = await req.json();
    // 创建支付意图
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"], // 支持的支付方式
      metadata: {
        orderId,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
