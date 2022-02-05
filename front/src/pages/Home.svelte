<script lang="ts">
  import BrowserAlert from "../lib/BrowserAlert.svelte"
  
  let username = new URL(window.location.href).searchParams.get("username")

  let text = ""
  let language = "ja-JP"
  let isRunning = false

  let speech = null
  if (typeof webkitSpeechRecognition !== "undefined") {
    speech = new webkitSpeechRecognition()
  } else if (typeof SpeechRecognition !== "undefined") {
    speech = new SpeechRecognition()
  } else if (typeof mozSpeechRecognition !== "undefined") {
    speech = new mozSpeechRecognition()
  }

  if (speech) {
    speech.lang = "ja-JP"
    speech.continuous = true
    speech.onresult = (e) => {
      speech.stop()
      if (e.results[0].isFinal) {
        text = e.results[0][0].transcript
        fetch("https://voice-to-text-neosvr.deno.dev/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            username: username,
            text: text,
          })
        })
      }
    }

    speech.onend = () => {
      if (isRunning) {
        speech.start()
      }
    }
  }

  function startRec() {
    isRunning = true
    speech.start()
  }

  function stopRec() {
    isRunning = false
    speech.abort()
  }

  function changeLanguage() {
    speech.lang = language
  }

</script>

<div class="py-6 sm:py-8 lg:py-12">
  <div class="max-w-screen-2xl px-4 md:px-8 mx-auto">
    <div class="max-w-lg border rounded-lg mx-auto">
      <div class="flex flex-col gap-4 p-4 md:p-8">
        <div class="form-control">
          <label class="label" for="username">
            <span class="label-text">Username</span>
          </label> 
          <input name="username" type="text" placeholder="username" class="input input-bordered" value={username}>
        </div>
        
        <label class="label" for="language">
          <span class="label-text">Language</span>
        </label> 
        <select name="language" class="select select-bordered w-full" on:change={changeLanguage} bind:value={language}>
          <option value="ja-JP">日本語</option>
          <option value="es-EN">English</option>
        </select>
        {#if !isRunning}
        <button class="btn btn-primary" disabled={isRunning} on:click={startRec}>Start</button>
        {:else}
        <button class="btn btn-secondary" on:click={stopRec}>Stop</button>
        {/if}
      </div>
    </div>

    {#if text !== ""}
    <div class="card text-center shadow-2xl lg:card-side bg-accent text-accent-content max-w-lg gap-4 my-8 mx-auto">
      <div class="card-body py-2">
        <p>{text}</p> 
      </div>
    </div>
    {/if}
    
    <BrowserAlert></BrowserAlert>
  </div>
</div>