import { useContext, useState, type FC } from "react";
import { VenueContext } from "../../contexts/VenueContext";
import type { IVenueContext } from "../../interfaces/contexts/IVenueContext";
import type { IVenueListProps } from "../../interfaces/components/IVenueListProps";
import { VenueCard } from "./VenueCard";

export const VenueList: FC<IVenueListProps> = ({
  cardVariant = "view",
  isLimited = false,
  layoutVariant = "horizontal",
}) => {
  const { 
    venues, 
    searchResults, 
    errorMessage, 
    isLoading, 
    searchByName } =
    useContext(VenueContext) as IVenueContext;

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [confirmingId, setConfirmingId] = useState<number | null>(null); 

  // --- Styling variabler ---
  const headerContainerStyling =
    "flex justify-between items-center mb-6 p-2 px-8 bg-black rounded-sm";
  const titleStyling = "text-2xl text-white font-bold";
  const searchContainerStyling = "flex gap-2";
  const searchInputStyling =
    "px-4 py-2 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#870000] w-64";
  const searchButtonStyling =
    "px-4 py-2 rounded bg-[#4C0000] text-white font-bold hover:bg-[#870000] transition-colors cursor-pointer";
  const loadingContainerStyling = "flex justify-center items-center py-12";
  const loadingTextStyling = "text-gray-500 text-lg";
  const errorContainerStyling =
    "bg-red-50 border border-red-400 text-red-700 px-4 py-3 my-10 rounded max-w-[200px] mx-auto";
  const cardsContainerBaseStyling = "grid grid-cols-12 gap-6 p-4 mb-8";

  // admin-page ikke får horizontal scroll på lg-breakpoint
  const cardsContainerLgStyling =
    layoutVariant === "horizontal"
      ? "lg:flex lg:flex-row lg:overflow-x-auto lg:gap-4 lg:p-4"
      : ""; // default styling (grid)

  const cardsContainerXlStyling = "xl:grid xl:overflow-visible xl:p-4";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchByName(searchQuery);
      setIsSearchActive(true);
    } else {
      // Hvis søkefeltet er tomt, vis alle venues igjen
      setIsSearchActive(false);
    }
  };

  // Velg datakilde basert på om vi søker eller ikke
  let displayVenues = isSearchActive ? searchResults : venues;

  let displayTitle;
  switch (cardVariant) {
    case "view":
      displayTitle = "Featured venues";
      break;
    case "manage":
      displayTitle = "All venues";
      break;
    default:
      displayTitle = "All venues";
      break;
  }

  const renderJsx = () => {
    if (isLoading) {
      return (
        <>
          <div className={headerContainerStyling}>
            <h2 className={titleStyling}>{displayTitle}</h2>
            <form onSubmit={handleSearch} className={searchContainerStyling}>
              <input
                type="text"
                placeholder="Search venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={searchInputStyling}
              />
              <button type="submit" className={searchButtonStyling}>
                Search
              </button>
            </form>
          </div>
          <div className={loadingContainerStyling}>
            <div className={loadingTextStyling}>Loading venues...</div>
          </div>
        </>
      );
    }

    // Feilmelding eller tom liste
    if (errorMessage || displayVenues.length === 0) {
      const errorMsg = errorMessage
        ? errorMessage
        : isSearchActive
        ? `No venues found matching "${searchQuery}"`
        : "No venues available";

      return (
        <>
          <div className={headerContainerStyling}>
            <h2 className={titleStyling}>{displayTitle}</h2>
            <form onSubmit={handleSearch} className={searchContainerStyling}>
              <input
                type="text"
                placeholder="Search venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={searchInputStyling}
              />
              <button type="submit" className={searchButtonStyling}>
                Search
              </button>
            </form>
          </div>
          <div className={errorContainerStyling}>
            <p>{errorMsg}</p>
          </div>
        </>
      );
    }

    const cardsContainerStyling = `${cardsContainerBaseStyling} ${cardsContainerLgStyling} ${cardsContainerXlStyling}`;

    // Viser kun 4 venue-cards
    if (isLimited) {
      return (
        <>
          <div className={headerContainerStyling}>
            <h2 className={titleStyling}>{displayTitle}</h2>
          </div>
          <div className={cardsContainerStyling}>
            {displayVenues.slice(0, 4).map((venue) => (
              <VenueCard key={venue.id} venue={venue} variant={cardVariant} />
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        <div className={headerContainerStyling}>
          <h2 className={titleStyling}>{displayTitle}</h2>
          <form onSubmit={handleSearch} className={searchContainerStyling}>
            <input
              type="text"
              placeholder="Search venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={searchInputStyling}
            />
            <button type="submit" className={searchButtonStyling}>
              Search
            </button>
          </form>
        </div>
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
            />
          ))}
        </div>
      </>
    );
  };

  return renderJsx();
};
