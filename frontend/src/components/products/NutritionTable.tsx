import type { NutritionFacts } from "@/types";

interface NutritionTableProps {
  facts: NutritionFacts;
  servingSize?: string;
}

export function NutritionTable({ facts, servingSize }: NutritionTableProps) {
  const rows = [
    { label: "Total Fat", value: `${facts.fat}g`, highlight: false },
    { label: "Total Carbohydrates", value: `${facts.carbs}g`, highlight: false },
    { label: "Total Sugars", value: `${facts.sugar}g`, highlight: false, indent: true },
    { label: "Protein", value: `${facts.protein}g`, highlight: false },
    { label: "Sodium", value: `${facts.sodium}mg`, highlight: false },
  ];

  return (
    <div className="border-2 border-gray-900 dark:border-gray-100 rounded-xl overflow-hidden text-sm">
      {/* Header */}
      <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-4">
        <p className="text-2xl font-black">Nutrition Facts</p>
        {servingSize && (
          <p className="text-sm mt-1">Serving size {servingSize}</p>
        )}
      </div>

      {/* Calories */}
      <div className="border-b-8 border-gray-900 dark:border-gray-100 px-4 py-2">
        <div className="flex justify-between items-end">
          <p className="font-bold">Calories</p>
          <p className="text-4xl font-black">{facts.calories}</p>
        </div>
      </div>

      {/* Nutrients */}
      <div className="px-4">
        <p className="text-right text-xs border-b border-gray-400 py-1 dark:text-gray-400">
          % Daily Value*
        </p>
        {rows.map((row, i) => (
          <div
            key={i}
            className={`flex justify-between py-1.5 border-b border-gray-200 dark:border-dark-border ${
              row.indent ? "pl-4" : ""
            } ${row.highlight ? "font-bold" : ""}`}
          >
            <span className="text-gray-800 dark:text-gray-200">{row.label}</span>
            <span className="font-semibold text-gray-900 dark:text-dark-text">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-dark-border">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          * Percent Daily Values are based on a 2,000 calorie diet.
        </p>
      </div>
    </div>
  );
}
