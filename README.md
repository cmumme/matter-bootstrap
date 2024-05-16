# @rbxts/matter-bootstrap
A simple class that handles everything needed to bootstrap a Matter world including hot-reloading, live debug, networking (using ``@rbxts/yetanothernet``), and component replication.

```ts
// server/index.ts
import { ServerStorage } from "@rbxts/services"
import MatterBootstrap from "@rbxts/matter-bootstrap"
import { Components } from "shared/components"

new MatterBootstrap(ServerStorage.MatterSystems, Components)
```

```ts
// shared/components.ts
import { component } from "@rbxts/matter"
import { Replicated } from "@rbxts/matter-bootstrap"

export class Components {
	@Replicated
	public static readonly secondsPlayedTimer = 
		component<{
			secondsPlayed: number
		}>("secondsPlayedTimer")
}
```