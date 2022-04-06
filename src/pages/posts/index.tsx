import { GetStaticProps } from 'next';
import Head from 'next/head';
import * as Prismic from '@prismicio/client'
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

import { PrismicProvider } from '@prismicio/react';

export default function Posts() {
    return(
        <PrismicProvider>
            <Head>
                <title>Posts | ig.news</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    <a href="#">
                        <time>03 de Abril de 2022 </time>
                        <strong>Creating a monorepo with Lerna & Yarn Workspaces</strong>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore harum commodi possimus ipsum, porro itaque qui assumenda? Libero esse corrupti, officia voluptate, tempore error qui nihil porro pariatur sapiente perspiciatis.</p>
                    </a>
                    <a href="#">
                        <time>03 de Abril de 2022 </time>
                        <strong>Creating a monorepo with Lerna & Yarn Workspaces</strong>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore harum commodi possimus ipsum, porro itaque qui assumenda? Libero esse corrupti, officia voluptate, tempore error qui nihil porro pariatur sapiente perspiciatis.</p>
                    </a>
                    <a href="#">
                        <time>03 de Abril de 2022 </time>
                        <strong>Creating a monorepo with Lerna & Yarn Workspaces</strong>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore harum commodi possimus ipsum, porro itaque qui assumenda? Libero esse corrupti, officia voluptate, tempore error qui nihil porro pariatur sapiente perspiciatis.</p>
                    </a>
                </div>
            </main>
        </PrismicProvider>
    );
} 

export const getStaticProps: GetStaticProps = async ()=> {
    const prismic = getPrismicClient();

    const response = await prismic.get({
        predicates: Prismic.predicate.at('document.type', 'ignews-post'),
        fetch: ['title', 'content'],
        pageSize: 100,
    });

    // console.log(JSON.stringify(response, null, 2));
    console.log(response);

    return {
        props: {}
    }
};