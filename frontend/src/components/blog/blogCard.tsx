export const BlogCard = () => {
    return (
      <article className="flex flex-col md:flex-row  overflow-hidden transition-transform duration-300 hover:scale-105">
        <aside className="w-full h-[300px]">
          <img
            alt="Blog post"
            src="https://images.unsplash.com/photo-1726180839154-cc98e2df7f9b?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="w-full h-full object-cover rounded-lg"
          />
        </aside>
        <div className="w-full p-6 flex  flex-col justify-between">
          <header>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tokenization</h2>
            <p className="text-gray-600 mb-4">
              Tokenisation is the process of creating digital tokens on a blockchain or distributed ledger that represent ownership, or fractional ownership, of physical or digital assets.
            </p>
          </header>
          <footer>
            <span className="text-sm text-gray-500">20 Jan 2024</span>
          </footer>
        </div>
      </article>
    );
  };
  