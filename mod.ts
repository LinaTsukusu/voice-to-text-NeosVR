import { serve } from "./deps.ts"
import { SlotCommand, SlotConfig, WebSocketSlot } from "./lib/WebSocketSlot.ts";


const slots: Map<string, WebSocketSlot> = new Map()
serve(async (req: Request): Promise<Response> => {
  const upgrade = req.headers.get("upgrade") || ""
  if (upgrade.toLowerCase() === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req)
    socket.onopen = () => console.log("socket opened")
    socket.onmessage = (e) => {
      const json = JSON.parse(e.data)
      if (!json.command) {
        // 初回接続時
        const config = json as SlotConfig
        if (slots.has(config.guid)) {
          slots.get(config.guid)?.userList.add(config.username)
          socket.close()
        } else {
          const slot = new WebSocketSlot(socket, config)
          slots.set(config.guid, slot)
        }
      } else {
        // command処理
        const command = json as SlotCommand
        switch (command.command) {
          case "close":
            socket.close()
            slots.delete(command.guid)
            break
        }
    }
    }
    socket.onerror = (e) => console.log("socket errored:", e)
    socket.onclose = () => console.log("socket closed")
    return response
  }
  
  const { pathname } = new URL(req.url)
  if (pathname.startsWith("/send")) {
    const body = await req.json()
    if (body.username) {
      slots.forEach((v) => {
        if (v.userList.has(body.username)) {
          v.ws.send(JSON.stringify({
            username: body.username,
            text: body.text,
          }))
        }
      })
      return new Response("sended", { status: 200 })
    }
  }
  return Response.redirect("https://linatsukusu.github.io/voice-to-text-NeosVR" + pathname, 303)
})