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

const translations: Record<string, Partial<Record<string, string>>> = {
  pt: {
    'On this page(table of contents)': 'Nesta página',
    'Search(search dialog)': 'Buscar',
    'Search(search trigger)': 'Buscar',
    'Next Page(pagination)': 'Próxima página',
    'Previous Page(pagination)': 'Página anterior',
    'Last updated on(page footer)': 'Última atualização em',
    'Edit on GitHub(edit page)': 'Editar no GitHub',
    'Choose a language(language switcher)': 'Escolha um idioma',
    'Copied Text(code block)(aria-label)': 'Texto copiado',
    'Copy Text(code block)(aria-label)': 'Copiar texto',
    'Copy Markdown(page actions)': 'Copiar Markdown',
    'Open(page actions)': 'Abrir',
  },
  es: {
    'On this page(table of contents)': 'En esta página',
    'Search(search dialog)': 'Buscar',
    'Search(search trigger)': 'Buscar',
    'Next Page(pagination)': 'Página siguiente',
    'Previous Page(pagination)': 'Página anterior',
    'Last updated on(page footer)': 'Última actualización en',
    'Edit on GitHub(edit page)': 'Editar en GitHub',
    'Choose a language(language switcher)': 'Elige un idioma',
    'Copied Text(code block)(aria-label)': 'Texto copiado',
    'Copy Text(code block)(aria-label)': 'Copiar texto',
    'Copy Markdown(page actions)': 'Copiar Markdown',
    'Open(page actions)': 'Abrir',
  },
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
          translations: translations[lang],
        }}
      >
        {children}
      </RootProvider>
      <Footer lang={lang} />
    </>
  );
}
