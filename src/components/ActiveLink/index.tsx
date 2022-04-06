import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, cloneElement } from 'react';

interface ActiveLinkProps extends LinkProps {
    children: ReactElement;
    activeClassName: string;
}

export function ActiveLink({children, activeClassName, ...rest}: ActiveLinkProps) {
    const { asPath } = useRouter() //em asPath após ser visualizado ele nos passa o valor da url (ex: localhost:3000/posts), o que irá facilitar nossa validação de links ativos e inativos;

    // fazendo uma verificação
    const className = asPath === rest.href // se asPath(link ativo) for igual ao que estou passando dentro do href;
        ? activeClassName // a classe será essa;
        : ''; // se não fica vazia;

    return(
        <Link {...rest}>
            {cloneElement(children, {
                className
            })}
        </Link>
    )
}