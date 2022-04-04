import Head from 'next/head';
import styles from './styles.module.scss';

export default function Posts() {
    return(
        <>
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
        </>
    );
} 