import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";

import styles from './post.module.scss';

interface PostProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function Post({ post }: PostProps) {
    return(
        <>
            <Head>
                <title>{post.title} | ig.news</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{ post.title }</h1>
                    <time>{ post.updatedAt }</time>

                    <div 
                        className={styles.postContent}
                        dangerouslySetInnerHTML={{ __html: post.content }} /> {/* aqui estou alocando um codigo em html buscado do Prismic (no caso o content do post) */}
                </article>
            </main>
        </>
    );
}

// Aqui iremos utilizar o metodo getServerSideProps pois toda tela que é gerada de forma estática não é segura, no nosso caso faremos isso pois teremos duas telas de visualização o modo de que não é assinante e o de quem é assinante!
export const getServerSideProps: GetServerSideProps = async ({ req, params })=> {
    const session = await getSession({ req }) // aqui consigo saber se meu usuario está logado ou não;
    const { slug } = params // aqui estou pegando o valor de slug dentro de params;

    // Se o usuario não estiver logado: se não tiver uma sessão posso levar ele para outra tela:
    if (!session?.activeSubscription) {
        return{
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    const prismic = getPrismicClient();

    const response = await prismic.getByUID('ignews-post', String(slug))

    // formatação do post
    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long', 
            year: 'numeric' 
        })
    };

    return {
        props: {
            post,
        }
    };
}