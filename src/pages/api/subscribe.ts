import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stripe";
import { fauna } from "../../services/fauna";

export default async (req: NextApiRequest, res: NextApiResponse)=> {
    if(req.method === 'POST') { // verificar se o metodo é post, pois estamos criando algo no nosso bd;
        const session = await getSession({ req }) // dentro de rq temos os coockies

        // const user

        const stripeCustomer = await stripe.customers.create({
            email: session.user.email,

            // quando criado devemos salva-lo no FanuaDB;
        })

        // await fauna.query(
        //     q.Update( // atualizar usuario por email;

        //     )
        // )

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomer.id, // quem está comprando o produto! ID do nosso cliente do stripe
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: 'price_1KYxtqCHZl0Y2ubXxgLYok8E', quantity: 1 }
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })
        return res.status(200).json({sessionId: stripeCheckoutSession.id}); // deu certo
    } else {
        res.setHeader('Allow',  'POST');
        res.status(405).end('Method not allowed');
    }
}