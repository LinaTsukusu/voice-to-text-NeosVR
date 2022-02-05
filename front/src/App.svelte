<script lang="ts">
  import { Router, Route } from "svelte-routing"
  import Home from "./pages/Home.svelte"
</script>

<div class="lg:pb-12">
  <nav class="navbar mb-2 shadow-lg bg-neutral text-neutral-content">
    <div class="flex-1 px-2 mx-2">
      <span class="text-lg font-bold">
        Voice To Text helper for NeosVR
      </span>
    </div> 
    <div class="flex-none hidden px-2 mx-2 lg:flex">
      <div class="flex items-stretch">
        
      </div>
    </div> 
  </nav>
  <Router>
    <main>
      <Route path="" component={Home} />
    </main>
  </Router>
</div>


<style>
</style>
