import { Game } from "@rbxts/matter-bootstrap"
import { MatterDebugger } from "@rbxts/matter-bootstrap"
import bootstrap from "shared/bootstrap"
import PlayerEntities from "shared/plugins/PlayerEntities"

declare global {
	// A globally-scoped HelloWorldGame type allows systems to properly type
	// their arguments and access plugins with ease
	type HelloWorldGame = ReturnType<typeof bootstrap>
}
