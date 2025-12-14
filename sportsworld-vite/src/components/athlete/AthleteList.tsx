import { useContext, useState, type FC, type FormEvent } from "react";
import { AthleteCard } from "./AthleteCard";
import { AthleteContext } from "../../contexts/AthleteContext";
import type { IAthleteContext } from "../../interfaces/contexts/IAthleteContext";
import type { IAthleteListProps } from "../../interfaces/components/IAthleteListProps";
import type { IAthleteResponseList } from "../../interfaces/IServiceResponses";
import type { IAthlete } from "../../interfaces/objects/IAthlete";

// Håndterer visning av AthleteCards

export const AthleteList: FC<IAthleteListProps> = ({
  filterType = "all",
  cardVariant = "view",
  layoutVariant = "horizontal",
}) => {
  const {
    athletes,
    initError,
    hasInitialized,
    searchResults,
    athleteIsLoading,
    searchByName,
  } = useContext(AthleteContext) as IAthleteContext;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string>("");

  // confirming-state er på foreldrenivå, ikke i AthleteCard, slik at kun ett kort om gangen kan holde denne staten.
  // Dette gjør at dersom man trykker på delete et annet sted, mens et bekreftelsesvindu er åpent, vil det forrige lukkes automatisk
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  // Mellomlagring av success-proppen fra service responsene ved funksjonskall
  const [operationSuccess, setOperationSuccess] = useState<boolean | null>(
    null
  );
  // Mellomlagring av error-proppen fra service responsene
  const [operationError, setOperationError] = useState<string>("");

  // --- Styling variabler ---
  const errorContainerStyling =
    "bg-red-50 border border-red-400 text-red-700 px-4 py-3 my-10 rounded max-w-[200px] mx-auto";

  // Komponenter øverst på siden trenger ekstra top padding. denne er kun øverst når filtertypen er all
  const extraPadding = filterType === "all" ? "pt-12" : "";
  const sectionContainerStyling = `py-12 ${extraPadding}`;

  const headerContainerStyling =
    "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 p-2 px-8 bg-black";
  const titleStyling = "text-2xl text-white font-bold mb-2 sm:mb-0 text-center";
  const feedbackStyling = "text-sm text-black text-center";
  const feedbackContainerStyling = `gap-2 rounded-sm px-2 py-1 border border-gray-300 shadow bg-white flex items-center justify-center max-w-[400px] mx-auto mt-4`;

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
      if (!response.success && response.error) {
        setOperationSuccess(response.success);
        setOperationError(response.error);
      } else if (response.success) {
        setOperationSuccess(true);
        setActionFeedback("Search performed.");
        if (response.data.length === 0) {
          setActionFeedback("Search performed, no hits.");
        }
      }

      setIsSearchActive(true);
    } else {
      // Hvis søkefeltet er tomt, vis alle athletes igjen
      setIsSearchActive(false);
      setOperationSuccess(null);
      setOperationError("");
    }
  };

  // Bruker actionfeedback til å vise beskjed til bruker dersom ingen athleter er signed eller available på forsiden
  const getEmptyStateMessage = () => {
    if (filteredAthletes.length > 0) return "";

    if (filterType === "owned") {
      return "No fighters signed yet";
    }
    if (filterType === "available") {
      return "No fighters available";
    }
    return "";
  };

  // Velg datakilde basert på om vi søker eller ikke
  let filteredAthletes: IAthlete[] = isSearchActive ? searchResults : athletes;
  // Filtrer og sett tittel basert på listens filtertype
  let displayTitle: string;

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
    // Generer header og evt søkefelt i header
    const renderHeader = () => (
      <header className={headerContainerStyling}>
        <h2 className={titleStyling}>{displayTitle}</h2>
        {filterType === "all" && (
          <form onSubmit={handleSearch} className={searchContainerStyling}>
            <label htmlFor="athlete-search" className={searchBarLabelStyling}>
              Search fighters
            </label>
            <input
              id="athlete-search"
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
      </header>
    );

    // Viser hovedinnhold, evt ved teknisk feil feilmeldinger
    const getMainContent = () => {
      if (initError) {
        return (
          <div className={errorContainerStyling}>
            <p>{initError}</p>
          </div>
        );
      }

      if (!hasInitialized) {
        return (
          <div className={loadingContainerStyling}>
            <div className={loadingTextStyling}>Loading fighters...</div>
          </div>
        );
      }

      if (operationSuccess === false) {
        return (
          <div className={errorContainerStyling}>
            <p>{operationError}</p>
          </div>
        );
      }

      // Viser Athlete kortene
      return (
        <div className={cardsContainerStyling}>
          {filteredAthletes.map((athlete) => (
            <AthleteCard
              key={athlete.id}
              athlete={athlete}
              variant={cardVariant}
              layoutVariant={layoutVariant}
              confirming={confirmingId === athlete.id}
              onConfirmingChange={(isConfirming) =>
                setConfirmingId(isConfirming ? athlete.id : null)
              }
              onActionFeedback={(feedback) => {
                setActionFeedback(feedback);
              }}
            />
          ))}
        </div>
      );
    };

    // Generer feedback til bruker
    const renderFeedback = () => {
      if (initError || !hasInitialized) return null;

      return (
        <>
          {athleteIsLoading && (
            <p className={loadingTextStyling}>Loading athletes...</p>
          )}
          {(actionFeedback || getEmptyStateMessage()) && (
            <div className={feedbackContainerStyling}>
              <p className={feedbackStyling}>
                {actionFeedback || getEmptyStateMessage()}
              </p>
            </div>
          )}
        </>
      );
    };

    // Returnerer resultat med section wrapper
    return (
      <section className={sectionContainerStyling}>
        {renderHeader()}
        {getMainContent()}
        {renderFeedback()}
      </section>
    );
  };

  return renderJsx();
};
