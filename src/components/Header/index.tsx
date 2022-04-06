import { ActiveLink } from '../ActiveLink';

import { SignInButton } from '../SignInButton';

import styles from './styles.module.scss';

export function Header() {
    /* 
        Uma maneira de se fazer isso seria da seguinte forma:
            <a className={asPath === '/' ? styles.active : ''}> teste </a> 
            <a className={asPath === '/posts' ? styles.active : ''}> teste </a> 
    */

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="Logo ig.news" />

                <nav>
                    <ActiveLink activeClassName={styles.active} href='/'>
                        <a>Home</a>
                    </ActiveLink>

                    <ActiveLink activeClassName={styles.active} href={'/posts'}>
                        <a>Posts</a>
                    </ActiveLink>
                </nav>

                <SignInButton />
            </div>
        </header>
    );
}