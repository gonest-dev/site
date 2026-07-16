import { RootProvider } from 'fumadocs-ui/provider/next';
import { Footer } from '@/components/footer';
import SearchDialog from '@/components/search';
import { i18n } from '@/lib/i18n';
import { notFound } from 'next/navigation';

const localeNames: Record<(typeof i18n.languages)[number], string> = {
  en: 'English',
  pt: 'Português',
  es: 'Español',
};

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  if (!i18n.languages.includes(lang as (typeof i18n.languages)[number])) {
    notFound();
  }

  return (
    <>
      <RootProvider
        theme={{ defaultTheme: 'dark' }}
        search={{ SearchDialog }}
        i18n={{
          locale: lang,
          locales: i18n.languages.map((l) => ({ locale: l, name: localeNames[l] })),
        }}
      >
        {children}
      </RootProvider>
      <Footer />
    </>
  );
}
