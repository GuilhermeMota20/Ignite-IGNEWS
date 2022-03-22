import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from 'faunadb';
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stripe";
import { fauna } from "../../services/fauna";

type User = {
    ref: {
        id: string
    }
    data: {
        stripe_customer_id: string
    }
}

export default async (req: NextApiRequest, res: NextApiResponse)=> {
    if(req.method === 'POST') { // verificar se o metodo é post, pois estamos criando algo no nosso bd;
        const session = await getSession({ req }) // dentro de req temos os coockies

        const user = await fauna.query<User>( // Primeiro devemos procurar um usuario por email;
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id;

        if (!customerId) { // se id de novo customer não existir ele:
            const stripeCustomer = await stripe.customers.create({ // Cria um customer;
                email: session.user.email,
            });

            await fauna.query( // salva no banco;
                q.Update( 
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )

            customerId = stripeCustomer.id; // reatribui a variavel;
        }


        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId, // quem está comprando o produto! ID do nosso cliente do stripe
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