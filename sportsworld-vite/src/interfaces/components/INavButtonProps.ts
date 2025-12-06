export type destinationVariant =
  | "/"
  | "/admin"
  | "/finances"
  | "/venues"
  | "/register";

export interface INavButtonProps {
  destination: destinationVariant;
}
