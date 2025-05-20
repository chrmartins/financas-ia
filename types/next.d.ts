import { NextPage } from 'next';

declare module 'next' {
  export type PageProps = {
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  };
  
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP>;
}