import { useContext, useState, type FC, type FormEvent } from "react";
import { AthleteCard } from "./AthleteCard";
import { AthleteContext } from "../../contexts/AthleteContext";
import type { IAthleteContext } from "../../interfaces/contexts/IAthleteContext";
import type { IAthleteListProps } from "../../interfaces/components/IAthleteListProps";

export const AthleteList: FC<IAthleteListProps> = ({
  filterType = "all",
  cardVariant = "view",
  layoutVariant = "horizontal",
}) => {
  const {
    athletes,
    searchResults,
    athleteErrorMessage,
    athleteIsLoading,
    searchByName,
  } = useContext(AthleteContext) as IAthleteContext;

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // confirming-state er på foreldrenivå, ikke i AthleteCard, slik at kun ett kort om gangen kan holde denne staten.
  // Dette gjør at dersom man trykker på delete et annet sted, mens et bekreftelsesvindu er åpent, vil det forrige lukkes automatisk
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

  // Endre layout basert på layoutVariant, slik at admin-page ikke får horizontal scroll på lg-breakpoint
  const cardsContainerLgStyling =
    layoutVariant === "horizontal"
      ? "lg:flex lg:flex-row lg:overflow-x-auto lg:gap-4 lg:p-4"
      : ""; // Tom streng komponentene får default styling (grid)

  const cardsContainerXlStyling = "xl:grid xl:overflow-visible xl:p-4";

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchByName(searchQuery);
      setIsSearchActive(true);
    } else {
      // Hvis søkefeltet er tomt, vis alle athletes igjen
      setIsSearchActive(false);
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
        <>
          <div className={headerContainerStyling}>
            <h2 className={titleStyling}>{displayTitle}</h2>
            <form onSubmit={handleSearch} className={searchContainerStyling}>
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
          </div>
          <div className={loadingContainerStyling}>
            <div className={loadingTextStyling}>Loading fighters...</div>
          </div>
        </>
      );
    }

    if (athleteErrorMessage || filteredAthletes.length === 0) {
      const errorMessage = athleteErrorMessage
        ? athleteErrorMessage
        : isSearchActive
        ? `No fighters found matching "${searchQuery}"`
        : filterType === "owned"
        ? "No fighters signed yet"
        : "No fighters available";

      return (
        <>
          <div className={headerContainerStyling}>
            <h2 className={titleStyling}>{displayTitle}</h2>
            <form onSubmit={handleSearch} className={searchContainerStyling}>
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
          </div>
          <div className={errorContainerStyling}>
            <p>{errorMessage}</p>
          </div>
        </>
      );
    }

    const cardsContainerStyling = `${cardsContainerBaseStyling} ${cardsContainerLgStyling} ${cardsContainerXlStyling}`;

    return (
      <>
        <div className={headerContainerStyling}>
          <h2 className={titleStyling}>{displayTitle}</h2>
          <form onSubmit={handleSearch} className={searchContainerStyling}>
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
        </div>
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
            />
          ))}
        </div>
      </>
    );
  };

  return renderJsx();
};
