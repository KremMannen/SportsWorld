// ID trenger ikke være nullable. Vi benytter Omit<IAthlete, "id"> i post funksjonene istedet.

// Grunn:
// Reflekterer at enhver atlet skal ha en ID assosiert med seg.
// På komponent nivå, tillater det f.eks:
//    onClick={() => onDelete?.(athlete.id)}
// Uten at man trenger å kontrollere at athlete.id eksisterer med f.eks if check, eller bruk non-null assertion.
// I praksis når man genererer komponenter på page-nivå vil enhver atlet som bearbeides ha en id.
// Nå reflekterer koden også det.

export interface IAthlete {
  id: number;
  name: string;
  gender: string;
  price: number;
  image?: string;
  purchased: boolean;
}
