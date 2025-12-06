// ID og image trenger ikke være nullable. Vi benytter Omit<IAthlete, "id"> i post funksjonen, og Omit<IAthlete, "id | image" i context-nivå funksjonen>.

// Grunn:
// Reflekterer at enhver atlet fra databasen har Id og image.
// På komponent nivå tillater det f.eks å bruke athlete.id, uten at man trenger å kontrollere om den finnes eller bruke non-null assertion.
// I praksis når man genererer komponenter på page-nivå vil enhver atlet som bearbeides ha en id og image.
// Nå reflekterer koden også det.

export interface IAthlete {
  id: number;
  name: string;
  gender: string;
  price: number;
  image: string;
  purchased: boolean;
}
