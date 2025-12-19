import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const Notfound = () => {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-4xl font-bold tracking-tighter text-primary sm:text-6xl">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Page not found</h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/home">
            <Button size="lg" className="font-bold uppercase tracking-wider px-8">
              Go back home
            </Button>
          </Link>
          <Link to="/talktodb">
            <Button variant="ghost" size="lg" className="font-bold uppercase tracking-wider">
              Contact support
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Notfound