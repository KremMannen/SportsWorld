// ============================================================================
// CONSOLIDATED STYLING VARIABLES
// ============================================================================
// Har en drøm å konsolidere all styling til en fil.
// ATM gjør denne filen ingenting, den inneholder styling
// generert av Claude basert på alle komponentene.

// ============================================================================
// BUTTONS
// ============================================================================
export const buttons = {
  // Base button styles
  base: "px-4 py-2 rounded transition-colors duration-200 text-white font-bold cursor-pointer",
  baseWide:
    "px-6 py-2 rounded transition-colors font-bold cursor-pointer text-white",

  // Colors
  primary: "bg-black hover:bg-[#870000] hover:shadow",
  danger: "bg-[#4C0000] hover:bg-[#870000] hover:shadow",

  // Full width variant
  fullWidth: "w-full",

  // Combined common patterns
  primaryFull:
    "w-full px-4 py-2 rounded transition-colors duration-200 text-white font-bold bg-black hover:bg-[#870000] hover:shadow cursor-pointer",
  dangerFull:
    "w-full px-4 py-2 rounded transition-colors duration-200 text-white font-bold bg-[#4C0000] hover:bg-[#870000] hover:shadow cursor-pointer",
  search:
    "w-full sm:w-auto px-4 py-2 rounded bg-[#4C0000] text-white font-bold hover:bg-[#870000] transition-colors cursor-pointer",
} as const;

// ============================================================================
// CARDS
// ============================================================================
export const cards = {
  // Base card structures
  base: "rounded-lg shadow-md overflow-hidden",
  baseWithTransition:
    "rounded-lg shadow-md overflow-hidden transition-transform duration-200",

  // Colors
  dark: "bg-[#252828] text-white",
  darker: "bg-[#3D4645] text-white",
  light: "bg-white text-black",

  // Shadows
  shadowDefault: "shadow-black/20",
  shadowHeavy: "shadow-black/40",
  shadowVeryHeavy: "shadow-black/60",

  // Hover effects
  hoverScale: "hover:scale-[1.05] hover:cursor-pointer",
  hoverScaleWithShadow: "hover:scale-[1.05] hover:shadow-black/40",
  hoverShadowOnly: "hover:shadow-black/40",

  // Heights
  heightSmall: "h-32",
  heightMedium: "h-40",
  heightLarge: "h-48",

  // Grid spans - standard card layouts
  gridStandard: "col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3",
  gridHorizontal:
    "col-span-12 sm:col-span-6 lg:flex-shrink-0 lg:w-[400px] xl:col-span-3 xl:w-auto",

  // Delete confirmation card specific
  deleteBase:
    "bg-[#252828] text-white text-lg font-bold rounded-lg shadow-md overflow-hidden border-1 border-red-600 shadow-black/60 scale-[1.05]",

  // Financial card variants
  financeLimited:
    "col-span-12 sm:col-span-12 md:col-span-4 w-full max-w-lg mx-auto",
  financeStandard: "col-span-12 sm:col-span-6",
} as const;

// ============================================================================
// CARD CONTENT SECTIONS
// ============================================================================
export const cardContent = {
  // Image containers
  imageSquare: "w-32 h-32",
  imageRectangle: "w-32 h-48",
  imageWide: "w-full h-40",
  image: "w-full h-full object-cover",

  // Content areas
  content: "p-4 flex-1 flex flex-col justify-between",
  contentFlexCol: "p-4 flex flex-col justify-between",

  // Text elements
  title: "text-xl font-bold",
  titleLarge: "text-2xl font-bold",

  // Button containers
  buttonContainer: "flex gap-2",
  buttonContainerWithPadding: "flex gap-2 pt-2",

  // Delete confirmation specific
  deleteContent: "p-4 h-full flex flex-col justify-between",
  deleteText: "flex-1 flex items-center justify-center text-center",
} as const;

// ============================================================================
// FORMS & INPUTS
// ============================================================================
export const forms = {
  // Form containers
  container: "flex flex-col gap-4 p-4",

  // Input fields
  input:
    "flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4C0000] min-w-0",
  inputSearch:
    "px-4 py-2 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#870000] w-full sm:w-64",

  // Input containers
  inputContainer: "flex flex-col gap-1",
  inputContainerRow:
    "flex flex-col sm:flex-row gap-4 items-stretch sm:items-center",

  // Labels
  label: "text-sm font-medium text-gray-700",
  labelScreenReaderOnly: "sr-only",

  // File input
  fileInput:
    "px-4 py-2 border border-gray-300 rounded cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#4C0000] file:text-white file:cursor-pointer hover:file:bg-[#870000]",
} as const;

// ============================================================================
// LAYOUT CONTAINERS
// ============================================================================
export const layout = {
  // Section containers
  section: "py-12",
  sectionWithPadding: "py-12 pt-12",
  sectionCentered:
    "col-span-9 col-start-3 sm:col-span-6 lg:col-span-4 py-6 pt-12",

  // Grid containers
  gridBase: "grid grid-cols-12 gap-6 px-6",
  gridCards: "grid grid-cols-12 gap-6 px-6",

  // Horizontal scroll layout (for lg breakpoint)
  horizontalLg: "lg:flex lg:flex-row lg:overflow-x-auto lg:gap-4",

  // Return to grid on xl
  gridXl: "xl:grid xl:overflow-visible",

  // Finance dashboard specific
  financeContainer: "col-span-12 lg:col-span-6 grid grid-cols-12 gap-6",
  financeSection: "w-full pt-12 grid grid-cols-12 gap-6 text-center",
  financeSectionError: "pt-12",
} as const;

// ============================================================================
// HEADERS & NAVIGATION
// ============================================================================
export const headers = {
  // List/table headers
  container:
    "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 p-2 px-8 bg-black",
  title: "text-2xl text-white font-bold mb-2 sm:mb-0 text-center",

  // Search containers
  searchContainer:
    "flex flex-col sm:flex-row py-2 sm:py-0 gap-2 w-full sm:w-auto",

  // Title sections (for forms)
  titleSection:
    "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black w-full",
  titleSectionDark:
    "rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-[#252828]",
  titleText: "text-lg text-white font-bold",
} as const;

// ============================================================================
// STATUS & FEEDBACK
// ============================================================================
export const status = {
  // Loading states
  loadingContainer: "flex justify-center items-center py-12",
  loadingText: "text-gray-500 text-lg",
  loadingCentered: "text-center",
  loadingCenteredText: "text-xl text-gray-600",

  // Error states
  error:
    "bg-red-50 border border-red-400 text-red-700 px-4 py-3 my-10 rounded max-w-[200px] mx-auto",
  errorLarge:
    "flex flex-col gap-4 max-w-[250px] mx-auto bg-red-50 border border-red-400 text-red-700 p-2 mb-10 rounded",
  errorInline:
    "bg-red-50 border border-red-400 text-red-700 px-4 py-3 mb-10 rounded",
} as const;

// ============================================================================
// FINANCIAL SPECIFIC
// ============================================================================
export const finance = {
  // Value displays
  value: "text-2xl font-bold mt-3 text-[#4C0000] bg-transparent",
  debtText: "text-2xl font-bold mt-3 text-[#4C0000] bg-transparent",

  // Loan window specific
  loanInputContainer:
    "flex flex-col sm:flex-row gap-4 items-stretch sm:items-center lg:-mt-11",
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Combines multiple style strings conditionally
 * @param styles - Array of style strings or conditional tuples [condition, style]
 * @returns Combined style string
 */
export const combineStyles = (
  ...styles: (string | [boolean, string])[]
): string => {
  return styles
    .map((style) => {
      if (Array.isArray(style)) {
        const [condition, className] = style;
        return condition ? className : "";
      }
      return style;
    })
    .filter(Boolean)
    .join(" ");
};

/**
 * Creates a card style based on layout variant
 * @param layoutVariant - 'grid' or 'horizontal'
 * @returns Grid span classes
 */
export const getCardGridClasses = (
  layoutVariant: "grid" | "horizontal"
): string => {
  return layoutVariant === "grid" ? cards.gridStandard : cards.gridHorizontal;
};

/**
 * Creates container styling based on layout variant
 * @param layoutVariant - 'grid' or 'horizontal'
 * @returns Container classes
 */
export const getContainerClasses = (
  layoutVariant: "grid" | "horizontal"
): string => {
  return combineStyles(
    layout.gridCards,
    [layoutVariant === "horizontal", layout.horizontalLg],
    layout.gridXl
  );
};
