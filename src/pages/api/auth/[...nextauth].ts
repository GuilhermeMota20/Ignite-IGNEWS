import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna';

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: 'read:user',
                }
            }
        }),
    ],
    callbacks: {
        async session({session, user, token}) {

            try {
                const userActiveSubscription = await fauna.query(
                    q.Get(
                        q.Intersection([
                            q.Match(
                                q.Index('subscription_by_user_ref'),
                                q.Select(
                                    'ref',
                                    q.Get(
                                        q.Match(
                                            q.Index('user_by_email'),
                                            q.Casefold(session.user.email)
                                        )
                                    )
                                )
                            ),
                            q.Match(
                                q.Index('subscription_by_status'),
                                'active'
                            )
                        ])
                    )
                )
                return {
                    ...session,
                    activeSubscription: userActiveSubscription
                }
            } catch {
                return {
                    ...session,
                    activeSubscription: null
                }
            }
        },
        async signIn({ user, account, profile }) {
            const { email } = user; // email que vem de dentro de user;

            try {
                await fauna.query(
                    q.If( // SE
                        q.Not( // NÃO
                            q.Exists( // EXISTE
                                q.Match(
                                    q.Index('user_by_email'), // procurar por indexe criado no Fauna: user_by_email;
                                    q.Casefold(user.email) // deixa a filtragem igual sendo uppercase ou não;
                                )
                            )
                        ),
                        q.Create(
                            q.Collection('users'), // nome da tabela;
                            { data: { email } } // dados do usuario que queremos inserir;
                        ),
                        q.Get( // Selecionar usuario que bate com index abaixo:
                            q.Match(
                                q.Index('user_by_email'),
                                q.Casefold(user.email)
                            )
                        )
                    )
                )
                return true

            } catch {
                return false;
            }
        },
    },
})