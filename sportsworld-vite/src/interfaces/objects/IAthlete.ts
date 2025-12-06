// ID og image trenger ikke være nullable. Vi benytter Omit<IAthlete, "id"> i post funksjonen, og Omit<IAthlete, "id | image" i context-nivå funksjonen>.
// Reflekterer at enhver atlet fra databasen har Id og image.
// På komponent nivå tillater det f.eks å bruke athlete.id, uten at man trenger å kontrollere om den finnes eller bruke non-null assertion.

export interface IAthlete {
  id: number;
  name: string;
  gender: string;
  price: number;
  image: string;
  purchased: boolean;
}
