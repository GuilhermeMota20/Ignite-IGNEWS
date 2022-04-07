import { type } from 'os';
import { GetStaticProps } from 'next';
import Head from 'next/head';

import * as Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import styles from './styles.module.scss';
import Link from 'next/link';

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
}

interface PostsProps {
    posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
    return(
        <>
            <Head>
                <title>Posts | ig.news</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map(post => (
                        <Link href={`/posts/${post.slug}`}>
                            <a key={post.slug}>
                                <time>{post.updatedAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>
        </>
    );
} 

export const getStaticProps: GetStaticProps = async ()=> {
    const prismic = getPrismicClient();

    const response = await prismic.get({
        predicates: Prismic.predicate.at('document.type', 'ignews-post'),
        fetch: ['title', 'content'],
        pageSize: 100,
    });

    // formatando dados buscados pela requisição acima:
    const posts = response.results.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '', // se não houver um paragrafo no inicio então me retorne uma string vazia;
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit', // dia formatado com dois digitos
                month: 'long', // mês formatado como string (escrito)
                year: 'numeric' // ano formatado como numérico (ano completo)
            })
        };
    });

    return {
        props: {
            posts
        }
    }
};