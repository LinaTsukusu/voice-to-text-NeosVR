import { WebSocketClient } from "../deps.ts";


export type SlotConfig = {
  guid: string
  username: string,
  config: Record<string, unknown>,
}

export type SlotCommand = {
  guid: string
  command: string
}


export class WebSocketSlot {
  readonly userList: Set<string> = new Set()
  readonly guid: string
  readonly config: Record<string, unknown>

  constructor(
    public readonly ws: WebSocketClient,
    slotConfig: SlotConfig
  ) {
    this.userList.add(slotConfig.username)
    this.guid = slotConfig.guid
    this.config = slotConfig.config || {}
  }


}
