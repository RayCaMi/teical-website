import { Hero } from "../components/Hero";
import type { PropertyData } from '../types';

interface HomeProps {
  properties?: PropertyData[];
  loading?: boolean;
}

export default function Home({ properties = [], loading = false }: HomeProps) {
  if (loading) {
    return (
      <div className="bg-background w-full min-h-screen flex items-center justify-center">
        <p className="text-secondary font-bold text-xl">A carregar destaques...</p>
      </div>
    );
  }

  return (
    <div className="bg-background w-full min-h-screen">
      <Hero allProperties={properties} />
    </div>
  );
}