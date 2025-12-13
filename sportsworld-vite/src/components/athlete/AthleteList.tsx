import { useContext, useState, type FC, type FormEvent } from "react";
import { AthleteCard } from "./AthleteCard";
import { AthleteContext } from "../../contexts/AthleteContext";
import type { IAthleteContext } from "../../interfaces/contexts/IAthleteContext";
import type { IAthleteListProps } from "../../interfaces/components/IAthleteListProps";
import type { IAthleteResponseList } from "../../interfaces/IServiceResponses";

// Håndterer visning av AthleteCards

export const AthleteList: FC<IAthleteListProps> = ({
  filterType = "all",
  cardVariant = "view",
  layoutVariant = "horizontal",
}) => {
  const { athletes, initError, searchResults, athleteIsLoading, searchByName } =
    useContext(AthleteContext) as IAthleteContext;

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [actionFeedback, setActionFeedback] = useState("");

  // confirming-state er på foreldrenivå, ikke i AthleteCard, slik at kun ett kort om gangen kan holde denne staten.
  // Dette gjør at dersom man trykker på delete et annet sted, mens et bekreftelsesvindu er åpent, vil det forrige lukkes automatisk
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const [operationSuccess, setOperationSuccess] = useState<boolean | null>(
    null
  );
  const [operationError, setOperationError] = useState<string>("");

  // Tilpasser errormessage til brukeren
  let errorMessage = "No fighters available";
  if (operationSuccess === false) {
    errorMessage = operationError;
  } else if (isSearchActive && filterType === "all") {
    errorMessage = `No fighters found`;
  } else if (filterType === "owned") {
    errorMessage = "No fighters signed yet";
  }
  // --- Styling variabler ---
  const errorContainerStyling =
    "bg-red-50 border border-red-400 text-red-700 px-4 py-3 my-10 rounded max-w-[200px] mx-auto";

  // Komponenter øverst på siden trenger ekstra top padding. denne er kun øverst når filtertypen er all
  const extraPadding = filterType === "all" ? "pt-12" : "";
  const sectionContainerStyling = `py-12 ${extraPadding}`;

  const headerContainerStyling =
    "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 p-2 px-8 bg-black";
  const titleStyling = "text-2xl text-white font-bold mb-2 sm:mb-0 text-center";
  const feedbackStyling = "text-green-500 font-bold mb-2 sm:mb-0 text-center";

  const searchContainerStyling =
    "flex flex-col sm:flex-row py-2 sm:py-0 gap-2 w-full sm:w-auto";
  const searchInputStyling =
    "px-4 py-2 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#870000] w-full sm:w-64";
  const searchButtonStyling =
    "w-full sm:w-auto px-4 py-2 rounded bg-[#4C0000] text-white font-bold hover:bg-[#870000] transition-colors cursor-pointer";
  // sr-only: screen-reader only.
  // klasse som gjør innhold usynlig for seende brukere, men tilgjengelig for screen readers
  const searchBarLabelStyling = "sr-only";

  const loadingContainerStyling = "flex justify-center items-center py-12";
  const loadingTextStyling = "text-gray-500 text-lg";

  const cardsContainerBaseStyling = "grid grid-cols-12 gap-6 px-6";
  // Endre layout basert på layoutVariant, slik at admin-page ikke får horizontal scroll på lg-breakpoint
  const cardsContainerLgStyling =
    layoutVariant === "horizontal"
      ? "lg:flex lg:flex-row lg:overflow-x-auto lg:py-4 lg:gap-4 "
      : ""; // default styling (grid)
  // Går tilbake til vanlig grid-layout på xl
  const cardsContainerXlStyling = "xl:grid xl:overflow-visible";
  const cardsContainerStyling = `${cardsContainerBaseStyling} ${cardsContainerLgStyling} ${cardsContainerXlStyling}`;

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setOperationSuccess(null);
    setActionFeedback("");
    setOperationError("");

    if (searchQuery.trim()) {
      const response: IAthleteResponseList = await searchByName(searchQuery);
      console.log(response.error);
      // Tomt resultat gir også false på success, så må sjekke etter error message for å vite om noe teknisk gikk galt
      if (!response.success && response.error) {
        setOperationSuccess(false);
        setOperationError(response.error);
      } else {
        setOperationSuccess(true);
      }
      setIsSearchActive(true);
    } else {
      // Hvis søkefeltet er tomt, vis alle athletes igjen
      setIsSearchActive(false);
      setOperationSuccess(null);
      setOperationError("");
    }
  };

  // Velg datakilde basert på om vi søker eller ikke
  let filteredAthletes = isSearchActive ? searchResults : athletes;

  // Filtrer og sett tittel basert på listens filtertype
  let displayTitle;
  switch (filterType) {
    case "owned":
      filteredAthletes = filteredAthletes.filter(
        (athlete) => athlete.purchased
      );
      displayTitle = "Fighters in your arsenal";
      break;
    case "available":
      filteredAthletes = filteredAthletes.filter(
        (athlete) => !athlete.purchased
      );
      displayTitle = "Available Fighters";
      break;
    case "all":
    default:
      displayTitle = "All Fighters";
      break;
  }

  const renderJsx = () => {
    if (athleteIsLoading) {
      return (
        <section className={sectionContainerStyling}>
          <div className={headerContainerStyling}>
            <h2 className={titleStyling}>{displayTitle}</h2>
          </div>
          <div className={loadingContainerStyling}>
            <div className={loadingTextStyling}>Loading fighters...</div>
          </div>
        </section>
      );
    }

    if (initError) {
      return (
        <section className={sectionContainerStyling}>
          <div className={headerContainerStyling}>
            <h2 className={titleStyling}>{displayTitle}</h2>
          </div>
          <div className={errorContainerStyling}>
            <p>{initError}</p>
          </div>
        </section>
      );
    }

    if (filteredAthletes.length === 0) {
      return (
        <section className={sectionContainerStyling}>
          <div className={headerContainerStyling}>
            <h2 className={titleStyling}>{displayTitle}</h2>
            <p className={feedbackStyling}>{actionFeedback}</p>
            {filterType === "all" && (
              <form onSubmit={handleSearch} className={searchContainerStyling}>
                <label
                  htmlFor="athlete-search"
                  className={searchBarLabelStyling}
                >
                  Search fighters
                </label>
                <input
                  type="text"
                  placeholder="Search fighters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={searchInputStyling}
                />
                <button type="submit" className={searchButtonStyling}>
                  Search
                </button>
              </form>
            )}
          </div>
          <div className={errorContainerStyling}>
            <p>{errorMessage}</p>
          </div>
        </section>
      );
    }

    return (
      <section className={sectionContainerStyling}>
        <div className={headerContainerStyling}>
          <h2 className={titleStyling}>{displayTitle}</h2>
          <p className={feedbackStyling}>{actionFeedback}</p>
          {filterType === "all" && (
            <form onSubmit={handleSearch} className={searchContainerStyling}>
              <label htmlFor="athlete-search" className={searchBarLabelStyling}>
                Search fighters
              </label>
              <input
                type="text"
                placeholder="Search fighters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={searchInputStyling}
              />
              <button type="submit" className={searchButtonStyling}>
                Search
              </button>
            </form>
          )}
        </div>
        <div className={cardsContainerStyling}>
          {filteredAthletes.map((athlete) => (
            <AthleteCard
              key={athlete.id}
              athlete={athlete}
              variant={cardVariant}
              layoutVariant={layoutVariant}
              confirming={confirmingId === athlete.id}
              onActionFeedback={(feedback) => {
                setActionFeedback(feedback);
              }}
              onConfirmingChange={(isConfirming) =>
                setConfirmingId(isConfirming ? athlete.id : null)
              }
            />
          ))}
        </div>
      </section>
    );
  };

  return renderJsx();
};
