import Search from '../components/search';
import CitiesList from '../components/cities-list';

export default function Home() {
  return (
    <main className="overflow-hidden h-screen flex flex-col">
      <Search />
      <CitiesList />
    </main>
  );
}
