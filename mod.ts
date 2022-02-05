import { serve, WebSocketAcceptedClient, WebSocketServer } from "./deps.ts"
import { SlotCommand, SlotConfig, WebSocketSlot } from "./lib/WebSocketSlot.ts";


const wss = new WebSocketServer()
const slots: Map<string, WebSocketSlot> = new Map()

wss.on("connection", (ws: WebSocketAcceptedClient ) => {
  ws.on("message", (message: string) => {
    const json = JSON.parse(message)
    if (!json.command) {
      // 初回接続時
      const config = json as SlotConfig
      if (slots.has(config.guid)) {
        slots.get(config.guid)?.userList.add(config.username)
        ws.close()
      } else {
        const slot = new WebSocketSlot(ws, config)
        slots.set(config.guid, slot)
      }
    } else {
      // command処理
      const command = json as SlotCommand
      switch (command.command) {
        case "close":
          ws.close()
          slots.delete(command.guid)
          break
      }
    }
  })

  ws.on("error", (err) => {
    console.log(err)
  })
})

serve(async (req: Request): Promise<Response> => {
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
  return new Response("not found", { status: 404 })
})