import React, { useState } from 'react';
import { useRecipes } from '../context/RecipeContext.tsx';
import {
  Sparkles,
  ThumbsUp,
  Plus,
  Check,
  ChefHat,
  ArrowLeft,
  Search,
  MessageSquare,
} from 'lucide-react';

export const CommunityRequestsView: React.FC = () => {
  const {
    communityRequests,
    submitRecipeRequest,
    voteRecipeRequest,
    setActiveView,
    setIsRecommendationOpen,
  } = useRecipes();

  const [dishName, setDishName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [votedIds, setVotedIds] = useState<Record<string, boolean>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;

    setIsSubmitting(true);
    const success = await submitRecipeRequest(
      dishName.trim(),
      cuisine.trim() || 'General',
      notes.trim() || 'A requested dish for the SavoryTable community'
    );
    setIsSubmitting(false);

    if (success) {
      setDishName('');
      setCuisine('');
      setNotes('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3500);
    }
  };

  const handleVote = (id: string) => {
    if (votedIds[id]) return;
    setVotedIds((prev) => ({ ...prev, [id]: true }));
    voteRecipeRequest(id);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-24 text-stone-900">
      {/* Header */}
      <div className="border-b border-stone-200/90 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Recipe Catalogue</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
                <ChefHat className="w-4 h-4" />
                <span>Test Kitchen Wishlist</span>
              </div>
              <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-950">
                Community Recipe Requests
              </h1>
              <p className="mt-1 text-sm text-stone-600 max-w-2xl leading-relaxed">
                Want a specific recipe created and tested? Submit your requests below and vote on community favorites for our culinary development team.
              </p>
            </div>

            <button
              onClick={() => setIsRecommendationOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer shadow-xs self-start md:self-auto"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Ask AI Recommender Immediately</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Submit Request Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
            <h2 className="font-serif-display text-xl font-bold text-stone-950 mb-1">
              Request a New Dish
            </h2>
            <p className="text-xs text-stone-500 mb-5">
              Tell our test kitchen what you're dying to cook
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="e.g. Traditional French Beef Bourguignon"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-2 focus:outline-amber-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Cuisine / Region
                </label>
                <input
                  type="text"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  placeholder="e.g. French, Japanese, Mexican, Levant"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-2 focus:outline-amber-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Notes & Key Details
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Looking for a gluten-free adaptation, or specific technique for a shattering crispy crust."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-2 focus:outline-amber-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Recipe Request</span>
              </button>

              {submitted && (
                <div className="p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Your request has been added to the board!</span>
                </div>
              )}
            </form>
          </div>

          {/* RIGHT: Community Voting Feed */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-serif-display text-xl font-bold text-stone-950">
                Community Wishlist ({communityRequests.length})
              </h2>
              <span className="text-xs text-stone-500">Sorted by popularity & votes</span>
            </div>

            <div className="space-y-3.5">
              {communityRequests.map((req) => {
                const hasVoted = votedIds[req.id];

                return (
                  <div
                    key={req.id}
                    className="p-5 rounded-xl bg-white border border-stone-200 shadow-2xs hover:border-amber-200 transition-all flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-400 mb-1">
                        <span className="text-amber-800 uppercase tracking-wider">{req.cuisine}</span>
                        <span aria-hidden="true">·</span>
                        <span>Requested by {req.requestedBy}</span>
                        <span aria-hidden="true">·</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.status === 'Published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'Testing'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-stone-100 text-stone-700'
                        }`}>
                          {req.status}
                        </span>
                      </div>

                      <h3 className="font-serif-display text-lg font-bold text-stone-900">
                        {req.dishName}
                      </h3>

                      <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
                        {req.notes}
                      </p>
                    </div>

                    {/* Upvote Button */}
                    <button
                      onClick={() => handleVote(req.id)}
                      disabled={hasVoted}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 min-w-14 ${
                        hasVoted
                          ? 'bg-amber-50 border-amber-300 text-amber-900'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 mb-1 ${hasVoted ? 'fill-current text-amber-600' : ''}`} />
                      <span className="text-xs font-bold tabular-nums">{req.votes}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
