import {
  useContext,
  useState,
  type ChangeEvent,
  type FC,
  type FormEvent,
} from "react";
import { VenueContext } from "../../contexts/VenueContext";
import type { IVenueContext } from "../../interfaces/contexts/IVenueContext";
import type { IVenueListProps } from "../../interfaces/components/IVenueListProps";
import { VenueCard } from "./VenueCard";
import type {
  IVenueResponseList,
  IVenueResponseSingle,
} from "../../interfaces/IServiceResponses";
import type { IVenue } from "../../interfaces/objects/IVenue";

export const VenueList: FC<IVenueListProps> = ({
  cardVariant = "view",
  isLimited = false,
  layoutVariant = "horizontal",
}) => {
  const {
    venues,
    initError,
    hasInitialized,
    searchResults,
    isLoading,
    searchByName,
    searchByID,
  } = useContext(VenueContext) as IVenueContext;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string>("");

  const [operationSuccess, setOperationSuccess] = useState<boolean | null>(
    null
  );
  const [operationError, setOperationError] = useState<string>("");

  // confirming-state er på foreldrenivå, ikke i VenueCard, slik at kun ett kort om gangen kan holde denne staten.
  // Dette gjør at dersom man trykker på delete et annet sted, mens et bekreftelsesvindu er åpent, vil det forrige lukkes automatisk
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  // --- Styling variabler ---
  const sectionContainerStyling = "py-12";

  const headerContainerStyling =
    "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 p-2 px-8 bg-black";
  const titleStyling = "text-2xl text-white font-bold mb-2 sm:mb-0 text-center";
  const searchContainerStyling =
    "flex flex-col sm:flex-row py-2 sm:py-0 gap-2 w-full sm:w-auto";
  const searchInputStyling =
    "px-4 py-2 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#870000] w-full sm:w-64";
  const searchButtonStyling =
    "w-full sm:w-auto px-4 py-2 rounded bg-[#4C0000] text-white font-bold hover:bg-[#870000] transition-colors cursor-pointer";
  const searchBarLabelStyling = "sr-only";

  const feedbackStyling = "text-sm text-black text-center";
  const feedbackContainerStyling = `gap-2 rounded-sm px-2 py-1 border border-gray-300 shadow bg-white flex items-center justify-center max-w-[400px] mx-auto mt-4`;

  const loadingContainerStyling =
    "flex mx-auto justify-center items-center py-12";
  const loadingTextStyling = "text-gray-500 text-lg text-center col-span-12";

  const errorContainerStyling =
    "bg-red-50 border border-red-400 text-red-700 px-4 py-3 my-10 rounded max-w-[200px] mx-auto";

  const cardsContainerBaseStyling = "grid grid-cols-12 gap-6 px-6";
  // Venues-page ikke får horizontal scroll på lg-breakpoint
  const cardsContainerLgStyling =
    layoutVariant === "horizontal"
      ? "lg:flex lg:flex-row lg:overflow-x-auto lg:gap-4"
      : ""; // default styling (grid)
  // Går tilbake til vanlig grid-layout på xl
  const cardsContainerXlStyling = "xl:grid xl:overflow-visible";
  const cardsContainerStyling = `${cardsContainerBaseStyling} ${cardsContainerLgStyling} ${cardsContainerXlStyling}`;

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setOperationSuccess(null);
    setActionFeedback("");
    setOperationError("");

    // Hvis søkefeltet er tomt, vis alle venues igjen
    if (!searchQuery.trim()) {
      setIsSearchActive(false);
      return;
    }

    const isNumericSearch = !isNaN(Number(searchQuery));

    // Søk på ID hvis det er et tall
    if (isNumericSearch) {
      const response: IVenueResponseSingle = await searchByID(
        Number(searchQuery)
      );

      if (!response.success && response.error) {
        setOperationSuccess(false);
        setOperationError(response.error);
        setIsSearchActive(true);
        return;
      }

      if (response.success) {
        setOperationSuccess(true);
        setIsSearchActive(true);

        if (response.data === null) {
          // Ingen treff på ID, prøv navn søk i tilfelle tallet var en del av navnet
          await handleNameSearch();
        } else {
          setActionFeedback("Search performed.");
        }
        return;
      }
    }

    // Søk på navn
    await handleNameSearch();
  };

  const handleNameSearch = async () => {
    const response: IVenueResponseList = await searchByName(searchQuery);

    if (!response.success && response.error) {
      setOperationError(response.error);
    } else if (response.success) {
      if (response.data.length === 0) {
        setActionFeedback("Search performed, no hits.");
      } else {
        setActionFeedback("Search performed.");
      }
    }
    setOperationSuccess(response.success);
    setIsSearchActive(true);
  };

  // Velg datakilde basert på om vi søker eller ikke
  let displayVenues: IVenue[] = isSearchActive ? searchResults : venues;
  let displayTitle: string;

  switch (cardVariant) {
    case "view":
      displayTitle = "Featured Venues";
      break;
    case "manage":
      displayTitle = "All Venues";
      break;
    default:
      displayTitle = "All Venues";
      break;
  }

  const renderJsx = () => {
    // Header-seksjonen
    const renderHeader = () => (
      <header className={headerContainerStyling}>
        <h2 className={titleStyling}>{displayTitle}</h2>
        {isLimited === false && (
          <form onSubmit={handleSearch} className={searchContainerStyling}>
            <label htmlFor="venue-search" className={searchBarLabelStyling}>
              Search venues
            </label>
            <input
              id="venue-search"
              type="text"
              placeholder="Search venues by name or ID..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className={searchInputStyling}
            />
            <button type="submit" className={searchButtonStyling}>
              Search
            </button>
          </form>
        )}
      </header>
    );

    // Bestemmer hvilket innhold som skal vises
    const renderContent = () => {
      if (initError) {
        return (
          <div className={errorContainerStyling}>
            <p>{initError}</p>
          </div>
        );
      }

      // Context initialiserer, viser loading melding
      if (!hasInitialized) {
        return (
          <div className={loadingContainerStyling}>
            <div className={loadingTextStyling}>Loading venues...</div>
          </div>
        );
      }

      // Ved feil vises tilhørende feilmelding
      if (operationSuccess === false) {
        return (
          <div className={errorContainerStyling}>
            <p>{operationError}</p>
          </div>
        );
      }

      // Viser kun 4 venue-cards på forsiden
      if (isLimited) {
        return (
          <div className={cardsContainerStyling}>
            {displayVenues.slice(0, 4).map((venue) => (
              <VenueCard key={venue.id} venue={venue} variant={cardVariant} />
            ))}
            {isLoading && (
              <p className={loadingTextStyling}>Updating venues...</p>
            )}
          </div>
        );
      }

      // Liste med venues
      return (
        <div className={cardsContainerStyling}>
          {displayVenues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              variant={cardVariant}
              layoutVariant={layoutVariant}
              confirming={confirmingId === venue.id}
              onConfirmingChange={(isConfirming) =>
                setConfirmingId(isConfirming ? venue.id : null)
              }
              onActionFeedback={(feedback) => {
                setActionFeedback(feedback);
              }}
            />
          ))}
          {isLoading && <p className={loadingTextStyling}>Loading venues...</p>}
        </div>
      );
    };

    // Helper for å rendre feedback (kun når ikke i limited mode eller tekniske feil har skjedd)
    const renderFeedback = () => {
      if (
        initError ||
        !hasInitialized ||
        operationSuccess === false ||
        isLimited
      ) {
        return null;
      }

      return (
        <>
          {actionFeedback && (
            <div className={feedbackContainerStyling}>
              <p className={feedbackStyling}>{actionFeedback}</p>
            </div>
          )}
        </>
      );
    };

    // Returnerer resultat med section wrapper
    return (
      <section className={sectionContainerStyling}>
        {renderHeader()}
        {renderContent()}
        {renderFeedback()}
      </section>
    );
  };

  return renderJsx();
};
