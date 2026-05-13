import { Hero } from "../components/Hero"
import { mockProperties } from "../data/propertiesMock"


function Home() {
  return (
    <div className="bg-background w-full min-h-screen">
      <Hero allProperties={mockProperties}/>
    </div>
  )
}

export default Home
