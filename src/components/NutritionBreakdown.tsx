import React, { useState } from 'react';
import { NutritionInfo } from '../types.ts';
import { Flame, Info, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Scale } from 'lucide-react';

interface NutritionBreakdownProps {
  nutrition: NutritionInfo;
  servings: number;
  currentServings: number;
  recipeTitle?: string;
}

// Helper to parse numeric value and unit from strings like "18g", "580mg", "3.2mg"
const parseAmount = (val?: string): { num: number; unit: string } | null => {
  if (!val) return null;
  const match = val.match(/^([\d.]+)\s*([a-zA-Z%]*)$/);
  if (!match) return null;
  return { num: parseFloat(match[1]), unit: match[2] || 'g' };
};

// Format scaled amounts
const formatScaledValue = (val: string | undefined, scale: number): string => {
  if (!val) return '—';
  const parsed = parseAmount(val);
  if (!parsed || isNaN(parsed.num)) return val;
  const scaledNum = parsed.num * scale;
  const formatted = scaledNum >= 10 ? Math.round(scaledNum) : Math.round(scaledNum * 10) / 10;
  return `${formatted}${parsed.unit}`;
};

export const NutritionBreakdown: React.FC<NutritionBreakdownProps> = ({
  nutrition,
  servings,
  currentServings,
}) => {
  const [viewMode, setViewMode] = useState<'per-serving' | 'total'>('per-serving');
  const [isExpanded, setIsExpanded] = useState(true);

  const scaleFactor = viewMode === 'total' ? currentServings : 1;
  const displayServingsLabel = viewMode === 'total' ? `${currentServings} Servings (Full Batch)` : '1 Serving';

  // Base values
  const caloriesPerServing = nutrition.calories || 0;
  const displayCalories = Math.round(caloriesPerServing * scaleFactor);
  const displayKilojoules = Math.round(displayCalories * 4.184);

  // Extract parsed macros for energy calculation
  const parsedProtein = parseAmount(nutrition.protein)?.num || 0;
  const parsedCarbs = parseAmount(nutrition.carbs)?.num || 0;
  const parsedFat = parseAmount(nutrition.fat)?.num || 0;

  // Calorie breakdown calculation (Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g)
  const proteinKcal = parsedProtein * 4;
  const carbsKcal = parsedCarbs * 4;
  const fatKcal = parsedFat * 9;
  const totalMacroKcal = proteinKcal + carbsKcal + fatKcal || 1;

  const proteinPct = Math.round((proteinKcal / totalMacroKcal) * 100);
  const carbsPct = Math.round((carbsKcal / totalMacroKcal) * 100);
  const fatPct = Math.max(0, 100 - proteinPct - carbsPct);

  // Standard FDA Daily Values reference amounts
  // Fat: 78g, Saturated Fat: 20g, Cholesterol: 300mg, Sodium: 2300mg, Carbs: 275g, Fiber: 28g, Protein: 50g, Potassium: 4700mg, Calcium: 1300mg, Iron: 18mg, Vitamin D: 20mcg
  const calculateDV = (key: string, amountStr?: string, explicitDV?: number): number | null => {
    if (explicitDV !== undefined && explicitDV !== null) {
      return Math.round(explicitDV * (viewMode === 'total' ? currentServings : 1));
    }
    if (!amountStr) return null;
    const parsed = parseAmount(amountStr);
    if (!parsed) return null;

    const val = parsed.num * scaleFactor;
    const targets: Record<string, number> = {
      fat: 78,
      saturatedFat: 20,
      cholesterol: 300,
      sodium: 2300,
      carbs: 275,
      fiber: 28,
      protein: 50,
      potassium: 4700,
      calcium: 1300,
      iron: 18,
      sugar: 50,
      vitaminD: 20,
    };

    const target = targets[key];
    if (!target) return null;
    return Math.round((val / target) * 100);
  };

  // Structured breakdown data access
  const breakdown = nutrition.breakdown || {};
  const saturatedFatVal = nutrition.saturatedFat || breakdown.saturatedFat;
  const transFatVal = nutrition.transFat || breakdown.transFat || '0g';
  const unsaturatedFatVal = nutrition.unsaturatedFat || breakdown.monounsaturatedFat || breakdown.polyunsaturatedFat;
  const cholesterolVal = nutrition.cholesterol || breakdown.cholesterol;
  const sodiumVal = nutrition.sodium || breakdown.sodium;
  const potassiumVal = nutrition.potassium || breakdown.potassium;
  const sugarVal = nutrition.sugar || breakdown.sugars;
  const addedSugarsVal = breakdown.addedSugars;
  const calciumVal = nutrition.calcium || breakdown.calcium;
  const ironVal = nutrition.iron || breakdown.iron;
  const vitaminDVal = nutrition.vitaminD || breakdown.vitaminD;

  // Health and dietary highlights based on 1 serving
  const highlights: string[] = [];
  if (parsedProtein >= 30) highlights.push(`High Protein (${nutrition.protein})`);
  else if (parsedProtein >= 20) highlights.push(`Good Source of Protein (${nutrition.protein})`);

  const parsedFiber = parseAmount(nutrition.fiber)?.num || 0;
  if (parsedFiber >= 5) highlights.push(`High Fiber (${nutrition.fiber})`);

  const parsedSodium = parseAmount(sodiumVal)?.num;
  if (parsedSodium && parsedSodium <= 350) highlights.push('Low Sodium');

  const parsedSugar = parseAmount(sugarVal)?.num;
  if (parsedSugar !== undefined && parsedSugar <= 4) highlights.push('Low Sugar');

  const ironDv = calculateDV('iron', ironVal, nutrition.dailyValues?.iron);
  if (ironDv && ironDv >= 15) highlights.push(`Rich in Iron (${ironDv}% DV)`);

  const calciumDv = calculateDV('calcium', calciumVal, nutrition.dailyValues?.calcium);
  if (calciumDv && calciumDv >= 15) highlights.push(`Good Source of Calcium (${calciumDv}% DV)`);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
      {/* Header with View Mode Switcher */}
      <div className="p-5 sm:p-6 border-b border-stone-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-900 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-md">
                <Scale className="w-3.5 h-3.5 text-amber-700" />
                Nutritional Breakdown
              </span>
              <span className="text-xs text-stone-400 font-medium">per serving</span>
            </div>
            <h3 className="font-serif-display text-xl font-bold text-stone-900 mt-1.5">
              Nutrition & Macronutrient Profile
            </h3>
            {nutrition.servingSize && (
              <p className="text-xs text-stone-500 mt-0.5">
                Standard portion: <span className="font-medium text-stone-700">{nutrition.servingSize}</span>
              </p>
            )}
          </div>

          {/* Toggle between Per Serving and Scaled Total */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl self-start sm:self-auto border border-stone-200/80">
            <button
              type="button"
              onClick={() => setViewMode('per-serving')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'per-serving'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Per Serving
            </button>
            <button
              type="button"
              onClick={() => setViewMode('total')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'total'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Total ({currentServings} {currentServings === 1 ? 'serving' : 'servings'})
            </button>
          </div>
        </div>

        {/* Energy Banner */}
        <div className="mt-5 p-4 rounded-xl bg-linear-to-r from-stone-900 via-stone-850 to-stone-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-stone-300">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Energy ({displayServingsLabel})</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold tracking-tight tabular-nums font-serif text-amber-200">
                {displayCalories}
              </span>
              <span className="text-sm font-semibold text-stone-300">Calories (kcal)</span>
              <span className="text-xs text-stone-400 border-l border-stone-700 pl-2 ml-1 tabular-nums">
                {displayKilojoules.toLocaleString()} kJ
              </span>
            </div>
          </div>

          {/* Dynamic Macro Ratio Bar */}
          <div className="w-full sm:w-64 space-y-1.5">
            <div className="flex justify-between text-[11px] font-medium text-stone-300">
              <span className="text-emerald-300 font-semibold">{proteinPct}% Protein</span>
              <span className="text-amber-300 font-semibold">{carbsPct}% Carbs</span>
              <span className="text-rose-300 font-semibold">{fatPct}% Fat</span>
            </div>
            <div className="h-2.5 w-full bg-stone-800 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${proteinPct}%` }}
                title={`Protein: ${proteinPct}%`}
              />
              <div
                className="bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${carbsPct}%` }}
                title={`Carbohydrates: ${carbsPct}%`}
              />
              <div
                className="bg-rose-400 h-full transition-all duration-300"
                style={{ width: `${fatPct}%` }}
                title={`Fat: ${fatPct}%`}
              />
            </div>
            <div className="text-[10px] text-stone-400 text-right">
              % of total energy from macronutrients
            </div>
          </div>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-4">
          {/* Protein */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Protein
              </span>
              <span className="text-[11px] font-bold text-emerald-800 tabular-nums">
                {calculateDV('protein', nutrition.protein, nutrition.dailyValues?.protein)}% DV
              </span>
            </div>
            <div className="mt-1 text-lg font-bold text-stone-900 tabular-nums">
              {formatScaledValue(nutrition.protein, scaleFactor)}
            </div>
            <div className="mt-1.5 w-full bg-stone-200/80 rounded-full h-1 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${Math.min(100, calculateDV('protein', nutrition.protein, nutrition.dailyValues?.protein) || 0)}%` }}
              />
            </div>
          </div>

          {/* Carbohydrates */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 hover:border-amber-300 transition-colors">
            <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Carbs
              </span>
              <span className="text-[11px] font-bold text-amber-800 tabular-nums">
                {calculateDV('carbs', nutrition.carbs, nutrition.dailyValues?.carbs)}% DV
              </span>
            </div>
            <div className="mt-1 text-lg font-bold text-stone-900 tabular-nums">
              {formatScaledValue(nutrition.carbs, scaleFactor)}
            </div>
            <div className="mt-1.5 w-full bg-stone-200/80 rounded-full h-1 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${Math.min(100, calculateDV('carbs', nutrition.carbs, nutrition.dailyValues?.carbs) || 0)}%` }}
              />
            </div>
          </div>

          {/* Fat */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 hover:border-rose-300 transition-colors">
            <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                Total Fat
              </span>
              <span className="text-[11px] font-bold text-rose-800 tabular-nums">
                {calculateDV('fat', nutrition.fat, nutrition.dailyValues?.fat)}% DV
              </span>
            </div>
            <div className="mt-1 text-lg font-bold text-stone-900 tabular-nums">
              {formatScaledValue(nutrition.fat, scaleFactor)}
            </div>
            <div className="mt-1.5 w-full bg-stone-200/80 rounded-full h-1 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full"
                style={{ width: `${Math.min(100, calculateDV('fat', nutrition.fat, nutrition.dailyValues?.fat) || 0)}%` }}
              />
            </div>
          </div>

          {/* Dietary Fiber */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 hover:border-stone-400 transition-colors">
            <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-stone-500"></span>
                Fiber
              </span>
              <span className="text-[11px] font-bold text-stone-800 tabular-nums">
                {calculateDV('fiber', nutrition.fiber, nutrition.dailyValues?.fiber)}% DV
              </span>
            </div>
            <div className="mt-1 text-lg font-bold text-stone-900 tabular-nums">
              {formatScaledValue(nutrition.fiber, scaleFactor)}
            </div>
            <div className="mt-1.5 w-full bg-stone-200/80 rounded-full h-1 overflow-hidden">
              <div
                className="bg-stone-600 h-full rounded-full"
                style={{ width: `${Math.min(100, calculateDV('fiber', nutrition.fiber, nutrition.dailyValues?.fiber) || 0)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Nutrition Highlights Tags */}
        {highlights.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Nutritional Highlights:
            </span>
            {highlights.map((h, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-medium border border-stone-200"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {h}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Accordion / Full Breakdown Table */}
      <div className="p-5 sm:p-6 bg-stone-50/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Detailed Nutrient Breakdown
            </h4>
            <span className="text-[11px] text-stone-400">
              ({displayServingsLabel})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-semibold text-amber-900 hover:text-amber-800 cursor-pointer"
          >
            <span>{isExpanded ? 'Hide Details' : 'Show All Nutrients'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-4">
            <div className="overflow-hidden border border-stone-200 rounded-xl bg-white text-xs">
              {/* Table Header */}
              <div className="grid grid-cols-12 bg-stone-100/80 px-4 py-2.5 font-semibold text-stone-600 border-b border-stone-200">
                <div className="col-span-6 sm:col-span-7">Nutrient</div>
                <div className="col-span-3 sm:col-span-3 text-right">Amount</div>
                <div className="col-span-3 sm:col-span-2 text-right">% Daily Value*</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-stone-100">
                {/* Total Fat */}
                <div className="grid grid-cols-12 px-4 py-2 font-bold text-stone-900 bg-stone-50/30">
                  <div className="col-span-6 sm:col-span-7">Total Fat</div>
                  <div className="col-span-3 sm:col-span-3 text-right tabular-nums">
                    {formatScaledValue(nutrition.fat, scaleFactor)}
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-right font-bold text-stone-800 tabular-nums">
                    {calculateDV('fat', nutrition.fat, nutrition.dailyValues?.fat)}%
                  </div>
                </div>

                {/* Saturated Fat */}
                {saturatedFatVal && (
                  <div className="grid grid-cols-12 px-4 py-1.5 text-stone-600 pl-8">
                    <div className="col-span-6 sm:col-span-7">Saturated Fat</div>
                    <div className="col-span-3 sm:col-span-3 text-right tabular-nums">
                      {formatScaledValue(saturatedFatVal, scaleFactor)}
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-right tabular-nums">
                      {calculateDV('saturatedFat', saturatedFatVal, nutrition.dailyValues?.saturatedFat)}%
                    </div>
                  </div>
                )}

                {/* Trans Fat */}
                {transFatVal && (
                  <div className="grid grid-cols-12 px-4 py-1.5 text-stone-600 pl-8">
                    <div className="col-span-6 sm:col-span-7 italic">Trans Fat</div>
                    <div className="col-span-3 sm:col-span-3 text-right tabular-nums">
                      {formatScaledValue(transFatVal, scaleFactor)}
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-right text-stone-400">—</div>
                  </div>
                )}

                {/* Unsaturated Fat */}
                {unsaturatedFatVal && (
                  <div className="grid grid-cols-12 px-4 py-1.5 text-stone-600 pl-8">
                    <div className="col-span-6 sm:col-span-7">Poly / Monounsaturated</div>
                    <div className="col-span-3 sm:col-span-3 text-right tabular-nums">
                      {formatScaledValue(unsaturatedFatVal, scaleFactor)}
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-right text-stone-400">—</div>
                  </div>
                )}

                {/* Cholesterol */}
                {cholesterolVal && (
                  <div className="grid grid-cols-12 px-4 py-2 font-semibold text-stone-900">
                    <div className="col-span-6 sm:col-span-7">Cholesterol</div>
                    <div className="col-span-3 sm:col-span-3 text-right tabular-nums">
                      {formatScaledValue(cholesterolVal, scaleFactor)}
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-right tabular-nums">
                      {calculateDV('cholesterol', cholesterolVal, nutrition.dailyValues?.cholesterol)}%
                    </div>
                  </div>
                )}

                {/* Sodium */}
                {sodiumVal && (
                  <div className="grid grid-cols-12 px-4 py-2 font-semibold text-stone-900 bg-stone-50/30">
                    <div className="col-span-6 sm:col-span-7">Sodium</div>
                    <div className="col-span-3 sm:col-span-3 text-right tabular-nums">
                      {formatScaledValue(sodiumVal, scaleFactor)}
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-right font-bold text-stone-800 tabular-nums">
                      {calculateDV('sodium', sodiumVal, nutrition.dailyValues?.sodium)}%
                    </div>
                  </div>
                )}

                {/* Total Carbohydrate */}
                <div className="grid grid-cols-12 px-4 py-2 font-bold text-stone-900">
                  <div className="col-span-6 sm:col-span-7">Total Carbohydrates</div>
                  <div className="col-span-3 sm:col-span-3 text-right tabular-nums">
                    {formatScaledValue(nutrition.carbs, scaleFactor)}
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-right font-bold text-stone-800 tabular-nums">
                    {calculateDV('carbs', nutrition.carbs, nutrition.dailyValues?.carbs)}%
                  </div>
                </div>

                {/* Dietary Fiber */}
                <div className="grid grid-cols-12 px-4 py-1.5 text-stone-600 pl-8">
                  <div className="col-span-6 sm:col-span-7">Dietary Fiber</div>
                  <div className="col-span-3 sm:col-span-3 text-right tabular-nums">
                    {formatScaledValue(nutrition.fiber, scaleFactor)}
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-right tabular-nums">
                    {calculateDV('fiber', nutrition.fiber, nutrition.dailyValues?.fiber)}%
                  </div>
                </div>

                {/* Total Sugars */}
                {sugarVal && (
                  <div className="grid grid-cols-12 px-4 py-1.5 text-stone-600 pl-8">
                    <div className="col-span-6 sm:col-span-7">Total Sugars</div>
                    <div className="col-span-3 sm:col-span-3 text-right tabular-nums">
                      {formatScaledValue(sugarVal, scaleFactor)}
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-right text-stone-400">
                      {calculateDV('sugar', sugarVal, nutrition.dailyValues?.sugars) ? `${calculateDV('sugar', sugarVal, nutrition.dailyValues?.sugars)}%` : '—'}
                    </div>
                  </div>
                )}

                {/* Added Sugars */}
                {addedSugarsVal && (
                  <div className="grid grid-cols-12 px-4 py-1.5 text-stone-500 pl-12 text-[11px]">
                    <div className="col-span-6 sm:col-span-7">Includes {formatScaledValue(addedSugarsVal, scaleFactor)} Added Sugars</div>
                    <div className="col-span-3 sm:col-span-3 text-right tabular-nums">
                      {formatScaledValue(addedSugarsVal, scaleFactor)}
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-right tabular-nums">
                      {calculateDV('sugar', addedSugarsVal)}%
                    </div>
                  </div>
                )}

                {/* Protein */}
                <div className="grid grid-cols-12 px-4 py-2 font-bold text-stone-900 bg-stone-50/30">
                  <div className="col-span-6 sm:col-span-7">Protein</div>
                  <div className="col-span-3 sm:col-span-3 text-right tabular-nums">
                    {formatScaledValue(nutrition.protein, scaleFactor)}
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-right font-bold text-stone-800 tabular-nums">
                    {calculateDV('protein', nutrition.protein, nutrition.dailyValues?.protein)}%
                  </div>
                </div>

                {/* Potassium */}
                {potassiumVal && (
                  <div className="grid grid-cols-12 px-4 py-1.5 text-stone-600">
                    <div className="col-span-6 sm:col-span-7">Potassium</div>
                    <div className="col-span-3 sm:col-span-3 text-right tabular-nums">
                      {formatScaledValue(potassiumVal, scaleFactor)}
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-right tabular-nums">
                      {calculateDV('potassium', potassiumVal, nutrition.dailyValues?.potassium)}%
                    </div>
                  </div>
                )}

                {/* Calcium */}
                {calciumVal && (
                  <div className="grid grid-cols-12 px-4 py-1.5 text-stone-600">
                    <div className="col-span-6 sm:col-span-7">Calcium</div>
                    <div className="col-span-3 sm:col-span-3 text-right tabular-nums">
                      {formatScaledValue(calciumVal, scaleFactor)}
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-right tabular-nums">
                      {calculateDV('calcium', calciumVal, nutrition.dailyValues?.calcium)}%
                    </div>
                  </div>
                )}

                {/* Iron */}
                {ironVal && (
                  <div className="grid grid-cols-12 px-4 py-1.5 text-stone-600">
                    <div className="col-span-6 sm:col-span-7">Iron</div>
                    <div className="col-span-3 sm:col-span-3 text-right tabular-nums">
                      {formatScaledValue(ironVal, scaleFactor)}
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-right tabular-nums">
                      {calculateDV('iron', ironVal, nutrition.dailyValues?.iron)}%
                    </div>
                  </div>
                )}

                {/* Vitamin D */}
                {vitaminDVal && (
                  <div className="grid grid-cols-12 px-4 py-1.5 text-stone-600">
                    <div className="col-span-6 sm:col-span-7">Vitamin D</div>
                    <div className="col-span-3 sm:col-span-3 text-right tabular-nums">
                      {formatScaledValue(vitaminDVal, scaleFactor)}
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-right tabular-nums">
                      {calculateDV('vitaminD', vitaminDVal, nutrition.dailyValues?.vitaminD)}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Scientific and Dietary Footnote */}
            <div className="flex items-start gap-2 text-[11px] text-stone-500 leading-relaxed pt-1">
              <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
              <span>
                * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 
                2,000 calories a day is used for general nutrition advice. Nutritional data is calculated per serving 
                based on USDA nutrient database values for culinary raw ingredients.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
