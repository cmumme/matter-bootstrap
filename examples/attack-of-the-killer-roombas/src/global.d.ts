import bootstrap from "shared/bootstrap"

declare global {
	// A globally-scoped game type allows systems to properly type
	// their arguments and access plugins with ease
	type AttackOfTheKillerRoombas = ReturnType<typeof bootstrap>
}
