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