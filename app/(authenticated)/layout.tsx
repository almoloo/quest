const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<section className="md:grow flex flex-col-reverse md:grid md:grid-cols-6 md:container md:mx-auto gap-5">
			<main className="md:col-span-4 p-5">{children}</main>
			<aside className="md:col-span-2 p-5">aside</aside>
		</section>
	);
};

export default Layout;
