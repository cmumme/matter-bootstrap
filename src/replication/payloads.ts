import { AnyComponent } from "@rbxts/matter"

export type EntityPayload = Record<string, { data: AnyComponent | undefined }>
export type WorldPayload = Record<string, EntityPayload>
