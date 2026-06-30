<script>
    // Svelte 5 component logic
</script>

<div class="min-h-screen flex flex-col font-sans text-slate-900">
    <!-- Navbar -->
    <nav class="flex justify-between items-center p-6 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div class="text-2xl font-bold text-emerald-800">Afiya-Lunya</div>
        <a href="/login" 
           class="px-6 py-2 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200">
            Login
        </a>
    </nav>

    <!-- Hero Section -->
    <header class="relative flex-grow flex items-center justify-center p-6 overflow-hidden">
        <!-- Background Image (Replace with your actual image path) -->
        <div class="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2000" 
                 alt="Mother and Child" 
                 class="w-full h-full object-cover brightness-[0.6]" />
            <div class="absolute inset-0 bg-emerald-900/40"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 max-w-4xl text-center text-white p-8">
            <h1 class="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                Empowering Maternal Health <br/>
                <span class="text-emerald-300">Across the Postpartum Gap.</span>
            </h1>
            <p class="text-lg md:text-xl mb-10 text-slate-100 leading-relaxed max-w-2xl mx-auto">
                Afiya-Lunya is a secure, AI-driven postpartum initiative protecting nursing mothers in Northern Nigeria. 
                Bridging the gap from pregnancy to recovery with localized, private, and life-saving intervention.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/login" class="px-8 py-4 bg-white text-emerald-900 rounded-lg font-bold text-lg hover:bg-slate-100 transition shadow-xl">
                    Get Started as a CHW
                </a>
                <a href="#about" class="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition">
                    Learn More
                </a>
            </div>
        </div>
    </header>

    <!-- Footer Simple -->
    <footer class="p-8 text-center text-slate-500 bg-slate-50 text-sm">
        &copy; 2026 Afiya-Lunya Initiative. Built for safe, data-driven maternal health.
    </footer>


</div>

