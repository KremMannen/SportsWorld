export type destinationVariant =
  | "/"
  | "/admin"
  | "/finances"
  | "/venues"
  | "/register";

export interface INavButton {
  destination: destinationVariant;
}
