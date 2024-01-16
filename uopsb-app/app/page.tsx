import Nav from '../components/Nav'

const metadata = {
    title: "UOP Study Buddy",
    description: "Author: Taylor McFarlane",
  };
  
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Nav/>
    </main>
  )
}
