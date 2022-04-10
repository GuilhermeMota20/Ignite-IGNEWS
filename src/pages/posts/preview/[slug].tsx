import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";

import styles from '../post.module.scss';

interface PostPreviewProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function PostPreview({ post }: PostPreviewProps) {
    const { data: session } = useSession();
    const router = useRouter()

    useEffect(()=> {
        if(session?.activeSubscription) {
            router.push(`/posts/${post.slug}`)
        }

    }, [session]);

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
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content }} />

                    <div className={styles.continueReading}>
                        Wanna continue reading?
                            
                        <Link href='/'>
                            <a href="">Subscribe now 🤗</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    return{
        paths: [], // quais caminhos (telas) eu gostaria de gerar durante a build | vazio posi quero que seja carregado após o primeiro acesso
        fallback: 'blocking' // true: se um post que for acessado ainda não foi gerado de forma estática, a requisição será feita e quando o conteudo estiver pronto, será mostrado em tela | blocking: apenas quando todo conteudo estiver pronto atraves de serverSideRendering(ssr) em que ele será mostrado em tela 
    }
}

export const getStaticProps: GetStaticProps = async ({ params })=> {
    const { slug } = params
    const prismic = getPrismicClient();
    const response = await prismic.getByUID('ignews-post', String(slug))

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 3)), // splice para pegar apenas os três primeiros conteudos da lista
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long', 
            year: 'numeric' 
        })
    };

    return {
        props: {
            post,
        },
        redirect: 60 * 30, // 30 minutos
    };
}