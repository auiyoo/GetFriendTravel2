/**
 * Matching Algorithm for GetFriendTravel
 * Scores trips based on compatibility factors
 */

const calculateMatchScore = (trip1, trip2) => {
  let score = 0;
  const breakdown = {};

  // 1. Same destination (40 points)
  if (trip1.destination.country === trip2.destination.country) {
    score += 40;
    breakdown.destination = 40;
    if (trip1.destination.province && trip2.destination.province &&
        trip1.destination.province === trip2.destination.province) {
      score += 10;
      breakdown.province = 10;
    }
  } else {
    breakdown.destination = 0;
  }

  // 2. Overlapping dates (30 points)
  const overlap = getDateOverlap(trip1.dateRange, trip2.dateRange);
  if (overlap > 0) {
    const overlapDays = Math.min(overlap, 7);
    const dateScore = Math.round((overlapDays / 7) * 30);
    score += dateScore;
    breakdown.dates = dateScore;
  } else {
    breakdown.dates = 0;
  }

  // 3. Budget compatibility (20 points)
  const budgetScore = getBudgetScore(trip1.budget, trip2.budget);
  score += budgetScore;
  breakdown.budget = budgetScore;

  // 4. Travel style match (10 points)
  const styleScore = getStyleScore(trip1.travelStyles, trip2.travelStyles);
  score += styleScore;
  breakdown.styles = styleScore;

  return { score: Math.min(score, 100), breakdown };
};

const getDateOverlap = (range1, range2) => {
  const start = Math.max(new Date(range1.start), new Date(range2.start));
  const end = Math.min(new Date(range1.end), new Date(range2.end));
  if (end > start) {
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }
  return 0;
};

const getBudgetScore = (budget1, budget2) => {
  // Check if budget ranges overlap
  const overlapMin = Math.max(budget1.min, budget2.min);
  const overlapMax = Math.min(budget1.max, budget2.max);
  if (overlapMax >= overlapMin) {
    return 20;
  }
  // Partial score if close
  const gap = overlapMin - overlapMax;
  const range = Math.max(budget1.max, budget2.max) - Math.min(budget1.min, budget2.min);
  const proximity = 1 - (gap / range);
  return Math.max(0, Math.round(proximity * 20));
};

const getStyleScore = (styles1, styles2) => {
  if (!styles1?.length || !styles2?.length) return 0;
  const common = styles1.filter(s => styles2.includes(s));
  const maxStyles = Math.max(styles1.length, styles2.length);
  return Math.round((common.length / maxStyles) * 10);
};

/**
 * Find compatible trips for a given trip
 * Returns sorted list of compatible trips with scores
 */
const findCompatibleTrips = (sourceTripRequest, allTripRequests) => {
  const results = [];

  for (const trip of allTripRequests) {
    // Skip same trip or same creator
    if (trip._id.toString() === sourceTripRequest._id.toString()) continue;
    if (trip.creator.toString() === sourceTripRequest.creator.toString()) continue;
    if (trip.status !== 'open') continue;

    const { score, breakdown } = calculateMatchScore(sourceTripRequest, trip);

    if (score >= 40) { // minimum threshold
      results.push({ trip, score, breakdown });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  return results;
};

module.exports = { calculateMatchScore, findCompatibleTrips };
