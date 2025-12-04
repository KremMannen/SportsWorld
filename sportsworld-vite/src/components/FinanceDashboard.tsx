import type { FC } from "react";

export const FinanceDashboard: FC = () => {
  return (
    <div className="container px-4 py-8 max-w-[1600px] grid grid-cols-12 gap-6 w-full mx-auto text-center">
      {/* Account Balance */}
      <div className="col-span-12 md:col-span-4">
        <div className="rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black w-full">
          <h3 className="text-md text-white">Account Balance</h3>
        </div>
        <p className="text-2xl font-bold mt-3 text-black bg-transparent">
          $12,450
        </p>
      </div>

      {/* Fighters Owned */}
      <div className="col-span-12 md:col-span-4 hidden md:block">
        <div className="rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-black w-full">
          <h3 className="text-md text-white">Fighters Owned</h3>
        </div>
        <p className="text-2xl font-bold mt-3 text-black bg-transparent">18</p>
      </div>

      {/* Fighters Worth */}
      <div className="col-span-12 md:col-span-4 hidden md:block">
        <div className="rounded-sm shadow-md shadow-black/40 px-4 py-2 bg-black text-white w-full">
          <h3 className="text-md text-white">Fighters Worth</h3>
        </div>
        <p className="text-2xl font-bold mt-3 text-black bg-transparent">
          $34,200
        </p>
      </div>
    </div>
  );
};
