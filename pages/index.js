import Link from 'next/link';
import { useRouter } from 'next/router';
import LocaleSwitcher from '../components/locale-switcher';

export default function IndexPage(props) {
	const router = useRouter();
	const { locale, locales, defaultLocale } = router;

	return (
		<div>
			<h1>Index page</h1>
			<p>Current locale: {locale}</p>
			<p>Default locale: {defaultLocale}</p>
			<p>Configured locales: {JSON.stringify(locales)}</p>

			<LocaleSwitcher />

			<Link href="/gsp" prefetch={false}>
				<a>To getStaticProps page</a>
			</Link>
			<br />

			<Link href="/gsp/first" prefetch={false}>
				<a>To dynamic getStaticProps page</a>
			</Link>
			<br />

			<Link href="/gssp" prefetch={false}>
				<a>To getServerSideProps page</a>
			</Link>
			<br />
		</div>
	);
}
